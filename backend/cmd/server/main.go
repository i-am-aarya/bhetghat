package main

import (
	"context"
	"fmt"
	"log"
	"time"

	// db "bhetghat-server/database"
	"bhetghat-server/config"
	"bhetghat-server/server"
	"net/http"
	_ "net/http/pprof"

	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("error loading .env file: ", err)
	}

	ctx, cancelFunc := context.WithTimeout(context.Background(), time.Second*5)
	defer cancelFunc()

	err = config.InitMongo(ctx)
	if err != nil {
		log.Fatal("ERROR CONNECTING TO DATABASE", err)
	}
	fmt.Println("CONNECTED TO DATABASE SUCCESSFULLY")
	defer config.MongoClient.Disconnect(ctx)

	if err := config.InitRedis(); err != nil {
		log.Fatal("Redis failed: ", err)
	}

	// roomManager := &hub.SessionManager{
	// 	Sessions: make(map[string]*hub.Session),
	// }

	// globalHub := hub.GetHubInstance()

	// globalHub.Proximity = hub.NewProximityManager()
	// globalHub.Proximity.RoomManager = roomManager

	// go roomManager.CleanupExpiredRooms()

	// log.Printf("HUB %p running\n", globalHub)
	// go globalHub.Run()

	server := server.NewServer()

	go func() {
		log.Println(http.ListenAndServe("localhost:6060", nil))
	}()

	log.Fatal(server.App.Listen(":8080"))
}
