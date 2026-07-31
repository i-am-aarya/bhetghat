package repository

import (
	"bhetghat-server/models"
	"context"
	"errors"
	"regexp"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type RoomRepository interface {
	GetByRoomCode(ctx context.Context, code string) (*models.Room, error)
	GetByName(ctx context.Context, name string) (*models.Room, error)
	GetByID(ctx context.Context, id primitive.ObjectID) (*models.Room, error)
	GetAll(ctx context.Context) ([]*models.Room, error)
	Insert(ctx context.Context, room *models.Room) (*models.Room, error)
	Update(ctx context.Context, id primitive.ObjectID, update *models.UpdateRoomParams) (*models.Room, error)
	AddMember(ctx context.Context, roomID primitive.ObjectID, userID primitive.ObjectID) error
	RemoveMember(ctx context.Context, roomID primitive.ObjectID, userID primitive.ObjectID) error
	Delete(ctx context.Context, roomID primitive.ObjectID) error
	Search(ctx context.Context, query string) ([]*models.Room, error)
}

type MongoRoomRepo struct {
	coll *mongo.Collection
}

func NewMongoRoomRepo(db *mongo.Database, roomCollectionName string) *MongoRoomRepo {
	return &MongoRoomRepo{
		coll: db.Collection(roomCollectionName),
	}
}

func (r *MongoRoomRepo) GetByRoomCode(ctx context.Context, code string) (*models.Room, error) {
	var room models.Room
	filter := bson.M{"roomCode": code}
	err := r.coll.FindOne(ctx, filter).Decode(&room)
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
	err := r.coll.FindOne(ctx, filter).Decode(&room)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &room, nil
}

func (r *MongoRoomRepo) GetByID(ctx context.Context, id primitive.ObjectID) (*models.Room, error) {
	var room models.Room
	filter := bson.M{"_id": id}
	err := r.coll.FindOne(ctx, filter).Decode(&room)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, errors.New("room not found")
		}
		return nil, err
	}
	return &room, nil
}

func (r *MongoRoomRepo) GetAll(ctx context.Context) ([]*models.Room, error) {
	var rooms []*models.Room
	cur, err := r.coll.Find(ctx, bson.D{})
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
	res, err := r.coll.InsertOne(ctx, room)
	if err != nil {
		return nil, err
	}
	id := res.InsertedID
	room.ID = id.(primitive.ObjectID)
	return room, nil
}

func (r *MongoRoomRepo) Update(ctx context.Context, id primitive.ObjectID, update *models.UpdateRoomParams) (*models.Room, error) {
	_, err := r.coll.UpdateByID(ctx, id, bson.M{"$set": update})
	if err != nil {
		return nil, err
	}
	return r.GetByID(ctx, id)
}

func (r *MongoRoomRepo) AddMember(ctx context.Context, roomID, userID primitive.ObjectID) error {
	_, err := r.coll.UpdateOne(ctx, bson.M{"_id": roomID}, bson.M{"$push": bson.M{"members": userID}, "$inc": bson.M{"memberCount": 1}})
	return err
}

func (r *MongoRoomRepo) RemoveMember(ctx context.Context, roomID, userID primitive.ObjectID) error {
	_, err := r.coll.UpdateOne(ctx, bson.M{"_id": roomID}, bson.M{"$pull": bson.M{"members": userID}, "$inc": bson.M{"memberCount": -1}})
	return err
}

func (r *MongoRoomRepo) Delete(ctx context.Context, roomID primitive.ObjectID) error {
	_, err := r.coll.DeleteOne(ctx, bson.M{"_id": roomID})
	return err
}

func (r *MongoRoomRepo) Search(ctx context.Context, query string) ([]*models.Room, error) {
	filter := bson.M{
		"roomCode": query,
		"name":     bson.M{"$regex": regexp.QuoteMeta(query), "$options": "i"},
	}
	cur, err := r.coll.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var rooms []*models.Room
	for cur.Next(ctx) {
		var room *models.Room

		err := cur.Decode(&room)
		if err != nil {
			return nil, err
		}

		rooms = append(rooms, room)
	}

	return rooms, nil

}
