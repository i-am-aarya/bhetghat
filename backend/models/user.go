package models

import (
	"errors"
	"regexp"
	"strings"

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
	ID              primitive.ObjectID `json:"id,omitempty"`
	FirstName       string             `json:"firstName,omitempty"`
	LastName        string             `json:"lastName,omitempty"`
	Email           string             `json:"email"`
	Username        string             `json:"username"`
	Password        string             `json:"password"`
	ConfirmPassword string             `json:"confirmPassword"`
}

func (cu *CreateUserParams) Validate() error {
	if !isEmailValid(cu.Email) {
		return errors.New("invalid email")
	}
	// if len(cu.FirstName) <= 1 {
	// 	return errors.New("firstname too short")
	// }
	// if len(cu.LastName) <= 1 {
	// 	return errors.New("lastname too short")
	// }
	if len(cu.Password) < 8 {
		return errors.New("password too short")
	}
	if len(cu.Username) < 4 {
		return errors.New("username too short")
	}
	if strings.Compare(cu.Password, cu.ConfirmPassword) != 0 {
		return errors.New("passwords dont match")
	}
	return nil
}

// Params for updating User
type UpdateUserParams struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type LoginUserParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	// Username string `json:"username"`
}

func (u *User) Validate() error {
	if !isEmailValid(u.Email) {
		return errors.New("invalid email")
	}
	// if len(u.FirstName) <= 1 {
	// 	return errors.New("firstname too short")
	// }
	// if len(u.LastName) <= 1 {
	// 	return errors.New("lastname too short")
	// }
	return nil
}

func isEmailValid(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}
