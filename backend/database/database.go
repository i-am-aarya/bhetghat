package db

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	DBURI = "mongodb://localhost:27017"
)

var MongoClient *mongo.Client

func ConnectDB(ctx context.Context) error {
	var err error
	MongoClient, err = mongo.Connect(ctx, options.Client().ApplyURI(DBURI))

	err = MongoClient.Ping(ctx, nil)
	if err != nil {
		return err
	}

	return err
}
