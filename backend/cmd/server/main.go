package main

import (
	"context"
	"fmt"
	"log"
	"time"

	db "bhetghat-server/database"
	"bhetghat-server/server"
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

	server := server.NewServer()

	log.Fatal(server.App.Listen(":8000"))
}
