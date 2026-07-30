package config

import (
	"context"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client

func InitMongo(ctx context.Context) error {

	dbUri, exists := os.LookupEnv("MONGODB_URI")
	if !exists {
		log.Fatal("database uri not found")
	}

	var err error
	MongoClient, err = mongo.Connect(ctx, options.Client().ApplyURI(dbUri))
	if err != nil {
		log.Printf("error : %v", err)
		return err
	}

	err = MongoClient.Ping(ctx, nil)
	if err != nil {
		log.Printf("error in database ping: %v", err)
		return err
	}

	return err
}
