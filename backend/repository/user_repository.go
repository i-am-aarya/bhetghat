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
	GetByID(ctx context.Context, userID primitive.ObjectID) (*models.User, error)
	GetByUsername(ctx context.Context, username string) (*models.User, error)
	GetByEmail(ctx context.Context, email string) (*models.User, error)
	GetAll(ctx context.Context) ([]*models.User, error)
	Insert(ctx context.Context, user *models.User) (*models.User, error)
	Update(ctx context.Context, userID primitive.ObjectID, update *bson.M) (*models.User, error)
	FindByIDs(ctx context.Context, ids []primitive.ObjectID) ([]*models.User, error)
}

type MongoUserRepo struct {
	coll *mongo.Collection
}

func NewMongoUserRepo(db *mongo.Database, collectionName string) *MongoUserRepo {
	return &MongoUserRepo{
		coll: db.Collection(collectionName),
	}
}

func (r *MongoUserRepo) GetByUsername(ctx context.Context, username string) (*models.User, error) {
	var user *models.User
	err := r.coll.FindOne(ctx, bson.M{"username": username}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return user, nil
}

func (r *MongoUserRepo) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	var user *models.User
	err := r.coll.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return user, nil
}

func (r *MongoUserRepo) GetByID(ctx context.Context, userID primitive.ObjectID) (*models.User, error) {
	var user models.User
	err := r.coll.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *MongoUserRepo) Insert(ctx context.Context, user *models.User) (*models.User, error) {
	res, err := r.coll.InsertOne(ctx, user)
	if err != nil {
		return nil, err
	}
	user.ID = res.InsertedID.(primitive.ObjectID)
	return user, nil
}

func (r *MongoUserRepo) GetAll(ctx context.Context) ([]*models.User, error) {
	var users []*models.User
	res, err := r.coll.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	for res.Next(ctx) {
		var user *models.User
		err := res.Decode(&user)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func (r *MongoUserRepo) Update(ctx context.Context, userID primitive.ObjectID, update *bson.M) (*models.User, error) {
	res, err := r.coll.UpdateOne(ctx, bson.M{"_id": userID}, bson.M{"$set": update})
	if err != nil {
		return nil, err
	}
	if res.MatchedCount == 0 {
		return nil, mongo.ErrNoDocuments
	}
	return r.GetByID(ctx, userID)
}

func (r *MongoUserRepo) FindByIDs(ctx context.Context, ids []primitive.ObjectID) ([]*models.User, error) {
	filter := bson.M{"_id": bson.M{"$in": ids}}
	cur, err := r.coll.Find(ctx, filter)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
	}

	var users []*models.User
	for cur.Next(ctx) {
		var user *models.User

		if err := cur.Decode(&user); err != nil {
			return nil, err
		}

		users = append(users, user)

	}

	return users, nil

}
