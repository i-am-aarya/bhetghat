package main

import (
	"context"
	"fmt"
	"log"
	"time"

	db "bhetghat-server/database"
	"bhetghat-server/hub"
	"bhetghat-server/server"
	"net/http"
	_ "net/http/pprof"
)

func main() {
	ctx, cancelFunc := context.WithTimeout(context.Background(), time.Second*5)
	defer cancelFunc()

	err := db.ConnectDB(ctx)
	if err != nil {
		log.Fatal("ERROR CONNECTING TO DATABASE", err)
	}
	fmt.Println("CONNECTED TO DATABASE SUCCESSFULLY")
	defer db.MongoClient.Disconnect(ctx)

	roomManager := &hub.RoomManager{
		Rooms: make(map[string]*hub.Room),
	}

	globalHub := hub.GetHubInstance()

	globalHub.Proximity = hub.NewProximityManager()
	globalHub.Proximity.RoomManager = roomManager

	go roomManager.CleanupExpiredRooms()

	log.Printf("HUB %p running\n", globalHub)
	go globalHub.Run()

	server := server.NewServer()

	// In main():
	go func() {
		log.Println(http.ListenAndServe("localhost:6060", nil))
	}()

	log.Fatal(server.App.Listen(":8000"))
}
