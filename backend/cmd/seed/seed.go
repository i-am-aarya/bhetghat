package main

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"

	db "bhetghat-server/database"
	"bhetghat-server/models"
)

var ctx = context.Background()

func MakeUser(firstName, lastName string, isAdmin bool) models.User {
	hashedPass, err := bcrypt.GenerateFromPassword(
		[]byte(fmt.Sprintf("%s_%s", firstName, lastName)),
		bcrypt.DefaultCost,
	)
	if err != nil {
		log.Fatal("Error creating user for seed")
	}
	return models.User{
		FirstName:      firstName,
		LastName:       lastName,
		Email:          fmt.Sprintf("%s%s@bhetghat.com", firstName, lastName),
		Username:       fmt.Sprintf("%s.%s", firstName, lastName),
		HashedPassword: string(hashedPass),
		IsAdmin:        isAdmin,
	}
}

func main() {
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(db.DBURI))
	if err != nil {
		log.Fatal("ERROR CONNECTING TO DATABASE: ", err)
	}

	userColl := client.Database("bhetghat").Collection("users")

	users := []models.User{
		MakeUser("hari", "bahadur", false),
		MakeUser("turi", "kumar", true),
	}

	for _, user := range users {
		userColl.InsertOne(ctx, user)
	}

	fmt.Println("DATABASE SEED SUCCESSFUL")
}
