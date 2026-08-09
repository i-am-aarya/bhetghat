package service

import (
	"bhetghat-server/models"
	"bhetghat-server/repository"
	"context"
	"crypto/rand"
	"errors"
	"log"
	"slices"
	"strings"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

const codeCharset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
const codeLength = 6

type RoomService struct {
	roomRepo repository.RoomRepository
	userRepo repository.UserRepository
}

func NewRoomService(roomRepo repository.RoomRepository, userRepo repository.UserRepository) *RoomService {
	return &RoomService{
		roomRepo: roomRepo,
		userRepo: userRepo,
	}
}

func (s *RoomService) CreateRoom(ctx context.Context, name, password string, userID primitive.ObjectID) (*models.Room, error) {

	if len(strings.TrimSpace(name)) < 4 {
		log.Println("name: ", name)
		return nil, ErrNameTooShort
	}

	// defaults
	r := &models.Room{
		Name:             name,
		RequiresPassword: false,
		OwnerID:          userID,
		Members:          []primitive.ObjectID{userID},
		MemberCount:      1,
		Capacity:         100,
	}

	var code string
	for range 5 {
		var err error
		code, err = s.generateRoomCode()
		if err != nil {
			return nil, err
		}
		existing, err := s.roomRepo.GetByRoomCode(ctx, code)
		if existing != nil {
			code = ""
		} else {
			break
		}
	}
	if code == "" {
		return nil, errors.New("error while generating code")
	}

	r.RoomCode = code

	if password != "" {
		if len(strings.TrimSpace(password)) < 4 {
			return nil, ErrPasswordTooShort
		}
		hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}

		r.HashedPassword = string(hash)
		r.RequiresPassword = true
	}

	room, err := s.roomRepo.Insert(ctx, r)
	if err != nil {
		return nil, err
	}

	return room, nil
}

func (s *RoomService) UpdateRoom(ctx context.Context, roomID primitive.ObjectID, params *models.UpdateRoomParams) (*models.Room, error) {
	if params.Password != "" {
		hash, err := bcrypt.GenerateFromPassword([]byte(params.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		params.Password = string(hash)
		params.RequiresPassword = true
	}

	return s.roomRepo.Update(ctx, roomID, params)
}

func (s *RoomService) GetAllMembers(ctx context.Context, roomID primitive.ObjectID) ([]*models.User, error) {

	room, err := s.roomRepo.GetByID(ctx, roomID)
	if err != nil {
		return nil, err
	}

	if room == nil {
		return nil, ErrRoomNotFound
	}
	var users []*models.User

	for _, memberID := range room.Members {
		user, err := s.userRepo.GetByID(ctx, memberID)
		if err != nil {
			return nil, err
		}
		if user != nil {
			users = append(users, user)
		}
	}
	return users, nil
}

func (s *RoomService) JoinRoom(ctx context.Context, userID primitive.ObjectID, roomCode string) (*models.Room, error) {

	room, err := s.roomRepo.GetByRoomCode(ctx, roomCode)
	if err != nil {
		return nil, err
	}
	if room == nil {
		return nil, ErrRoomNotFound
	}

	if room.MemberCount >= room.Capacity {
		return nil, ErrRoomFull
	}

	if slices.Contains(room.Members, userID) {
		return nil, ErrAlreadyMember
	}

	return room, s.roomRepo.AddMember(ctx, room.ID, userID)
}

func (s *RoomService) LeaveRoom(ctx context.Context, userID, roomID primitive.ObjectID) error {
	return s.roomRepo.RemoveMember(ctx, roomID, userID)
}

func (s *RoomService) SearchRooms(ctx context.Context, query string) ([]*models.Room, error) {

	if query == "" {
		return nil, errors.New("no query string")
	}

	if len(query) < 3 {
		return nil, errors.New("query must be at least 3 characters")
	}

	return s.roomRepo.Search(ctx, query)
}

// Get all rooms
func (s *RoomService) GetRooms(ctx context.Context) ([]*models.Room, error) {
	return s.roomRepo.GetAll(ctx)
}

func (s *RoomService) DeleteRoom(ctx context.Context, roomID, userID primitive.ObjectID) error {
	room, err := s.roomRepo.GetByID(ctx, roomID)
	if err != nil {
		return err
	}

	if room.OwnerID == userID {
		return s.roomRepo.Delete(ctx, roomID)
	}

	return errors.New("only owner can delete the room")
}

func (s *RoomService) GetRoom(ctx context.Context, roomID primitive.ObjectID) (*models.Room, error) {
	room, err := s.roomRepo.GetByID(ctx, roomID)
	if err != nil {
		return nil, err
	}

	return room, nil
}

func (s *RoomService) GetUsersRooms(ctx context.Context, userID primitive.ObjectID) ([]*models.Room, error) {
	rooms, err := s.roomRepo.GetRoomsByMemberID(ctx, userID)
	if err != nil {
		return nil, err
	}

	if rooms == nil {
		return nil, ErrRoomNotFound
	}

	return rooms, nil
}

func (s *RoomService) generateRoomCode() (string, error) {
	b := make([]byte, codeLength)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	for i := range b {
		b[i] = codeCharset[int(b[i])%len(codeCharset)]
	}
	return string(b), nil
}
