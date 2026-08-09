package service

import "errors"

var (
	ErrRoomNotFound        = errors.New("room not found")
	ErrRoomFull            = errors.New("room is full")
	ErrAlreadyMember       = errors.New("already a member")
	ErrInvalidRoomPassword = errors.New("invalid room password")
	ErrUnauthorized        = errors.New("unauthorized")
	ErrInvalidRoomID       = errors.New("invalid room id")
	ErrInvalidParams       = errors.New("invalid request params")
	ErrInvalidSearchParams = errors.New("invalid search params")
	ErrPasswordTooShort    = errors.New("password too short")
	ErrNameTooShort        = errors.New("name too short")
	ErrEmailUnavailable    = errors.New("email already in use")
	ErrUsernameUnavailable = errors.New("username already in use")
	ErrInvalidLoginParams  = errors.New("invalid username or password")
	ErrRoomCodeNotFound    = errors.New("room code not found")
)
