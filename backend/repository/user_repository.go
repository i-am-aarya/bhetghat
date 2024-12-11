package repository

import (
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"bhetghat-server/models"
)

type UserRepository interface {
	// get user by ID
	GetByID(ctx context.Context, userID primitive.ObjectID) (*models.User, error)

	// get by field
	GetByField(ctx context.Context, field string, value interface{}) (*models.User, error)

	// get all users
	GetAll(ctx context.Context) ([]*models.User, error)

	// insert new user
	Insert(ctx context.Context, user *models.User) (*models.User, error)

	// update existing user
	Update(ctx context.Context, user *models.User) (*models.User, error)
}

type MongoUserRepo struct {
	Coll *mongo.Collection
}

func NewMongoUserRepo(db *mongo.Database, collectionName string) *MongoUserRepo {
	return &MongoUserRepo{
		Coll: db.Collection(collectionName),
	}
}

func (r *MongoUserRepo) GetByField(ctx context.Context, field string, value interface{}) (*models.User, error) {
	var user models.User
	filter := bson.M{field: value}
	err := r.Coll.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

// // GetByEmail and GetByUsername could be refractored into one function
// func (r *MongoUserRepo) GetByEmail(ctx context.Context, email string) (*models.User, error) {
// 	var user models.User
// 	filter := bson.M{"email": email}
// 	err := r.Coll.FindOne(ctx, filter).Decode(&user)
// 	if err != nil {
// 		if errors.Is(err, mongo.ErrNoDocuments) {
// 			return nil, nil
// 		}
// 		return nil, err
// 	}
// 	return &user, nil
// }

// // GetByEmail and GetByUsername could be refractored into one function
// func (r *MongoUserRepo) GetByUsername(ctx context.Context, username string) (*models.User, error) {
// 	var user models.User
// 	filter := bson.M{"username": username}
// 	err := r.Coll.FindOne(ctx, filter).Decode(&user)
// 	if err != nil {
// 		if errors.Is(err, mongo.ErrNoDocuments) {
// 			return nil, nil
// 		}
// 		return nil, err
// 	}
// 	return &user, nil
// }

func (r *MongoUserRepo) GetByID(
	ctx context.Context,
	userID primitive.ObjectID,
) (*models.User, error) {
	var user models.User
	filter := bson.M{"_id": userID}
	err := r.Coll.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *MongoUserRepo) Insert(ctx context.Context, user *models.User) (*models.User, error) {
	res, err := r.Coll.InsertOne(ctx, user)
	if err != nil {
		return nil, err
	}
	user.ID = res.InsertedID.(primitive.ObjectID)

	return user, nil
}

// TODO
func (r *MongoUserRepo) GetAll(ctx context.Context) ([]*models.User, error) {
	return nil, nil
}

// TODO
func (r *MongoUserRepo) Update(ctx context.Context, user *models.User) (*models.User, error) {
	return nil, nil
}

// func (r *MongoUserRepo) Update(user *models.User) (*models.User, error) {
//
//   update := bson.M{
//
//   }
// }

/*
func (r *MongoUserRepo) Update(user *models.User) (*models.User, error) {
	// Create an update document to specify which fields to update
	update := bson.D{
		{"$set", bson.D{
			{"firstName", user.FirstName},
			{"lastName", user.LastName},
			{"email", user.Email},
			{"username", user.Username},
			{"isAdmin", user.IsAdmin},
		}},
	}

	// Use the user's ID as the filter to find the document to update
	filter := bson.D{{"_id", user.ID}}

	// Perform the update operation
	_, err := r.Coll.UpdateOne(nil, filter, update)
	if err != nil {
		return nil, err
	}

	// Return the updated user object (you might want to return the updated user after fetching it again)
	updatedUser, err := r.GetByID(user.ID) // Fetch the updated user
	if err != nil {
		return nil, err
	}

	return updatedUser, nil
}
*/
