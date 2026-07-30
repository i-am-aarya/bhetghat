package repository

import (
	"bhetghat-server/models"
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type RoomRepository interface {
	GetByRoomCode(ctx context.Context, code string) (*models.Room, error)
	GetByName(ctx context.Context, name string) (*models.Room, error)
	GetById(ctx context.Context, id primitive.ObjectID) (*models.Room, error)
	GetAll(ctx context.Context) ([]*models.Room, error)
	Insert(ctx context.Context, room *models.Room) (*models.Room, error)
	Update(ctx context.Context, id primitive.ObjectID, update *bson.M) (*models.Room, error)
	// InsertUser(ctx )
	// Search(ctx context.Context, query string, limit, skip int64) (*models.Room, error)
}

type MongoRoomRepo struct {
	RoomColl *mongo.Collection
	UserColl *mongo.Collection
}

func NewMongoRoomRepo(db *mongo.Database, roomCollectionName, userCollectionName string) *MongoRoomRepo {
	return &MongoRoomRepo{
		RoomColl: db.Collection(roomCollectionName),
		UserColl: db.Collection(userCollectionName),
	}
}

func (r *MongoRoomRepo) GetByRoomCode(ctx context.Context, code string) (*models.Room, error) {
	var room models.Room
	filter := bson.M{"roomCode": code}
	err := r.RoomColl.FindOne(ctx, filter).Decode(&room)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &room, nil
}

func (r *MongoRoomRepo) GetByName(ctx context.Context, name string) (*models.Room, error) {
	var room models.Room
	filter := bson.M{"name": name}
	err := r.RoomColl.FindOne(ctx, filter).Decode(&room)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &room, nil
}

func (r *MongoRoomRepo) GetById(ctx context.Context, id primitive.ObjectID) (*models.Room, error) {
	var room models.Room
	filter := bson.M{"_id": id}
	err := r.RoomColl.FindOne(ctx, filter).Decode(&room)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &room, nil
}

func (r *MongoRoomRepo) GetAll(ctx context.Context) ([]*models.Room, error) {
	var rooms []*models.Room
	cur, err := r.RoomColl.Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	for cur.Next(ctx) {
		var room models.Room
		err := cur.Decode(&room)
		if err != nil {
			return nil, err
		}
		rooms = append(rooms, &room)
	}

	return rooms, nil
}

func (r *MongoRoomRepo) Insert(ctx context.Context, room *models.Room) (*models.Room, error) {
	res, err := r.RoomColl.InsertOne(ctx, room)
	if err != nil {
		return nil, err
	}
	id := res.InsertedID
	room.ID = id.(primitive.ObjectID)
	return room, nil
}

func (r *MongoRoomRepo) Update(ctx context.Context, id primitive.ObjectID, update *bson.M) (*models.Room, error) {
	_, err := r.RoomColl.UpdateByID(ctx, id, bson.M{"$set": update})
	if err != nil {
		return nil, err
	}
	return r.GetById(ctx, id)
}
