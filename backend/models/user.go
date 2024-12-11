package models

import (
	"errors"
	"regexp"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// User model stored in database
type User struct {
	ID             primitive.ObjectID `bson:"_id,omitempty"            json:"id,omitempty"`
	FirstName      string             `bson:"firstName,omitempty"      json:"firstName"`
	LastName       string             `bson:"lastName,omitempty"       json:"lastName"`
	Email          string             `bson:"email,omitempty"          json:"email"`
	Username       string             `bson:"username,omitempty"       json:"username"`
	HashedPassword string             `bson:"hashedPassword,omitempty" json:"-"`
	IsAdmin        bool               `bson:"isAdmin,omitempty"        json:"isAdmin"`
}

// Params for User registration
type CreateUserParams struct {
	ID        primitive.ObjectID `json:"id,omitempty"`
	FirstName string             `json:"firstName"`
	LastName  string             `json:"lastName"`
	Email     string             `json:"email"`
	Username  string             `json:"username"`
	Password  string             `json:"password"`
}

// Params for updating User
type UpdateUserParams struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type LoginUserParams struct {
	Username string `json:"username"`
	Password string `json:"password"`
	// Email    string `json:"email"`
}

func (u *User) Validate() error {

	if !isEmailValid(u.Email) {
		return errors.New("invalid email")
	}
	if len(u.FirstName) <= 1 {
		return errors.New("firstname too short")
	}
	if len(u.LastName) <= 1 {
		return errors.New("lastname too short")
	}
	// if
	return nil
}

func isEmailValid(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}
