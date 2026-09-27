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

// Params for User registration, used by RegisterHandler
type CreateUserParams struct {
	ID       primitive.ObjectID `json:"id,omitempty"`
	Email    string             `json:"email"`
	Username string             `json:"username"`
	Password string             `json:"password"`
}

func (p *CreateUserParams) Validate() error {
	if !isEmailValid(p.Email) {
		return errors.New("invalid email")
	}
	if len(p.Password) < 8 {
		return errors.New("Password must be at least 8 characters")
	}
	if len(p.Username) < 4 {
		return errors.New("Username must be at least 4 characters")
	}
	return nil
}

// Params for updating User
type UpdateUserParams struct {
	FirstName          string `json:"firstName,omitempty" bson:"firstName,omitempty"`
	LastName           string `json:"lastName,omitempty" bson:"lastName,omitempty"`
	OldPassword        string `json:"oldPassword,omitempty"`
	NewPassword        string `json:"newPassword,omitempty"`
	ConfirmNewPassword string `json:"confirmNewPassword,omitempty"`
}

type LoginUserParams struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func isEmailValid(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

type UserSummary struct {
	ID        primitive.ObjectID `json:"id"`
	Username  string             `json:"username"`
	FirstName string             `json:"firstName,omitempty"`
	LastName  string             `json:"lastName,omitempty"`
}
