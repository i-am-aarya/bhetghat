package main

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"

	db "bhetghat-server/database"
	"bhetghat-server/models"
	"bhetghat-server/repository"
)

var ctx = context.Background()

func CreateUniqueIndexes(coll *mongo.Collection, field ...string) error {
	for _, f := range field {
		fieldIndex := mongo.IndexModel{
			Keys:    bson.M{f: 1},
			Options: options.Index().SetUnique(true),
		}
		_, err := coll.Indexes().CreateOne(ctx, fieldIndex)
		if err != nil {
			return err
		}
	}
	return nil
}

func MakeUser(firstName, lastName string, isAdmin bool) *models.User {
	hashedPass, err := bcrypt.GenerateFromPassword(
		[]byte(fmt.Sprintf("%s_%s", firstName, lastName)),
		bcrypt.DefaultCost,
	)
	if err != nil {
		log.Fatal("Error creating user for seed")
	}
	return &models.User{
		FirstName:      firstName,
		LastName:       lastName,
		Email:          fmt.Sprintf("%s.%s@bhetghat.com", firstName, lastName),
		Username:       fmt.Sprintf("%s.%s", firstName, lastName),
		HashedPassword: string(hashedPass),
		IsAdmin:        isAdmin,
	}
}

// SeedUsers creates Indexes, and inserts one admin and one non-admin user in the database
func SeedUsers(mongoUserRepo *repository.MongoUserRepo, users []*models.User) error {
	for _, user := range users {
		_, err := mongoUserRepo.Insert(ctx, user)
		if err != nil {
			// log.Fatal("ERROR INSERTING USER: ", err)
			return err
		}
	}
	return nil
}

func main() {

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(db.DBURI))
	if err != nil {
		log.Fatal("ERROR CONNECTING TO DATABASE: ", err)
	}

	bhetghatDB := client.Database("bhetghat")
	usersCollName := "users"
	usersColl := bhetghatDB.Collection(usersCollName)
	mongoUserRepo := repository.NewMongoUserRepo(bhetghatDB, usersCollName)

	err = CreateUniqueIndexes(usersColl, "username", "email")
	if err != nil {
		log.Fatal("ERROR CREATING UNIQUE INDEXES: ", err)
	}

	users := []*models.User{
		MakeUser("hari", "bahadur", false), // hari bahadur is a non-admin user
		MakeUser("madan", "bahadur", true), // madan bahadur is an admin
	}

	err = SeedUsers(mongoUserRepo, users)
	if err != nil {
		log.Fatal("ERROR SEEDING USERS: ", err)
	}

	log.Println("--- SEED USER SUCCESSFUL")
}
