package db

import (
	"context"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client

func ConnectDB(ctx context.Context) error {

	dbUri, exists := os.LookupEnv("MONGODB_URI")
	if !exists {
		log.Fatal("database uri not found")
	}
	fmt.Println("DBURI")
	fmt.Println("DBURI")
	fmt.Println("DBURI")
	fmt.Println("DBURI")
	fmt.Println("DBURI", dbUri)
	fmt.Println("DBURI")
	fmt.Println("DBURI")
	fmt.Println("DBURI")
	fmt.Println("DBURI")
	fmt.Println("DBURI")
	fmt.Println("DBURI")
	fmt.Println("DBURI")

	var err error
	MongoClient, err = mongo.Connect(ctx, options.Client().ApplyURI(dbUri))

	err = MongoClient.Ping(ctx, nil)
	if err != nil {
		return err
	}

	return err
}
