package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Message struct {
	Text       string             `bson:"text"       json:"text"`
	Sender     primitive.ObjectID `bson:"sender"     json:"sender"`
	RoomSentTo primitive.ObjectID `bson:"roomSentTo" json:"roomSentTo"`
}
