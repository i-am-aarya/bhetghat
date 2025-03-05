package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/redis/go-redis/v9"

	db "bhetghat-server/database"
	"bhetghat-server/hub"
	"bhetghat-server/server"
)

func main() {
	ctx, cancelFunc := context.WithTimeout(context.Background(), time.Second*5)
	defer cancelFunc()

	// redis
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatal("Redis connection failed:", err)
	}
	// log.Printf("Connected to Redis\n")

	err := db.ConnectDB(ctx)
	if err != nil {
		log.Fatal("ERROR CONNECTING TO DATABASE", err)
	}
	fmt.Println("CONNECTED TO DATABASE SUCCESSFULLY")
	defer db.MongoClient.Disconnect(ctx)

	roomManager := &hub.RoomManager{
		Rooms:       make(map[string]*hub.Room),
		RedisClient: rdb,
	}

	globalHub := hub.GetHubInstance()

	globalHub.Proximity = hub.NewProximityManager()
	globalHub.Proximity.RoomManager = roomManager

	go roomManager.CleanupExpiredRooms()

	log.Printf("HUB %p running\n", globalHub)
	go globalHub.Run()

	server := server.NewServer()

	log.Fatal(server.App.Listen(":8000"))
	// log.Fatal(server.App.ListenTLS(":8000", "cert.pem", "key.pem"))
}
