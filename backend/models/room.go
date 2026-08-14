package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Room struct {
	ID               primitive.ObjectID   `bson:"_id,omitempty"         json:"id,omitempty"`
	Name             string               `bson:"name"                  json:"name,omitempty"`
	OwnerID          primitive.ObjectID   `bson:"ownerID"               json:"ownerID,omitempty"`
	RoomCode         string               `bson:"roomCode"              json:"roomCode,omitempty"`
	HashedPassword   string               `bson:"password,omitempty"    json:"-"`
	RequiresPassword bool                 `bson:"requiresPassword"      json:"requiresPassword,omitempty"`
	Members          []primitive.ObjectID `bson:"members,omitempty"     json:"-"`
	MemberCount      int                  `bson:"memberCount,omitempty" json:"memberCount,omitempty"`
	Capacity         int                  `bson:"capacity,omitempty"    json:"capacity,omitempty"`
	MemberSummaries  []UserSummary        `bson:"-"                     json:"members,omitempty"`
}

type CreateRoomParams struct {
	Name     string `json:"name"`
	Password string `json:"password,omitempty"`
}

type JoinRoomParams struct {
	RoomCode string `json:"roomCode"`
	Password string `json:"password,omitempty"`
}

type UpdateRoomParams struct {
	Name             string `json:"name,omitempty" bson:"name,omitempty"`
	Password         string `json:"password,omitempty" bson:"password,omitempty"`
	Capacity         int    `json:"capacity,omitempty" bson:"capacity,omitempty"`
	RequiresPassword bool   `json:"requiresPassword,omitempty" bson:"requiresPassword,omitempty"`
}
