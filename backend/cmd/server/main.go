package main

import (
	"context"
	"fmt"
	"log"
	"time"

	db "bhetghat-server/database"
	"bhetghat-server/hub"
	"bhetghat-server/server"
)

// var GlobalHub *hub.Hub

func main() {
	ctx, cancelFunc := context.WithTimeout(context.Background(), time.Second*5)
	defer cancelFunc()

	err := db.ConnectDB(ctx)
	if err != nil {
		log.Fatal("ERROR CONNECTING TO DATABASE", err)
	}
	fmt.Println("CONNECTED TO DATABASE SUCCESSFULLY")
	defer db.MongoClient.Disconnect(ctx)

	// GlobalHub = hub.GetHubInstance()
	// go GlobalHub.Run()
	globalHub := hub.GetHubInstance()
	log.Printf("HUB %p running\n", globalHub)
	go globalHub.Run()

	server := server.NewServer()

	log.Fatal(server.App.Listen(":8000"))
	// log.Fatal(server.App.ListenTLS(":8000", "cert.pem", "key.pem"))
}
