package service

import "errors"

var (
	ErrRoomNotFound        = errors.New("room not found")
	ErrRoomFull            = errors.New("room is full")
	ErrAlreadyMember       = errors.New("already a member")
	ErrInvalidPassword     = errors.New("invalid room password")
	ErrUnauthorized        = errors.New("unauthorized")
	ErrInvalidRoomID       = errors.New("invalid room id")
	ErrInvalidParams       = errors.New("invalid request params")
	ErrInvalidSearchParams = errors.New("invalid search params")
	ErrPasswordTooShort    = errors.New("room password too short")
	ErrNameTooShort        = errors.New("room name too short")
)
