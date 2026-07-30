package service

import (
	"bhetghat-server/models"
	"bhetghat-server/repository"
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type RoomService struct {
	roomRepo repository.RoomRepository
	userRepo repository.UserRepository
}

func NewRoomService(repo repository.RoomRepository) *RoomService {
	return &RoomService{
		roomRepo: repo,
	}
}

func (s *RoomService) CreateRoom(ctx context.Context, name, password string, hasPassword bool, userID primitive.ObjectID) (*models.Room, error) {
	// defaults
	r := &models.Room{
		Name:             name,
		RequiresPassword: hasPassword,
		OwnerID:          userID,
		Members:          []primitive.ObjectID{userID},
		MemberCount:      1,
		Capacity:         100,
	}

	code, err := s.generateRoomCode(ctx)
	if err != nil {
		return nil, err
	}

	r.RoomCode = code

	if hasPassword {
		hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}

		r.HashedPassword = string(hash)
	}

	room, err := s.roomRepo.Insert(ctx, r)
	if err != nil {
		return nil, err
	}

	return room, nil
}

func (s *RoomService) UpdateRoom(ctx context.Context, roomID primitive.ObjectID, params *models.UpdateRoomParams) (*models.Room, error) {
	update := bson.M{}

	if params.Name != "" {
		update["name"] = params.Name
	}
	if params.Password != "" {
		hash, err := bcrypt.GenerateFromPassword([]byte(params.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}

		update["password"] = string(hash)
		update["requiresPassword"] = true

	}

	if params.Capacity != 0 {
		update["capacity"] = params.Capacity
	}

	return s.roomRepo.Update(ctx, roomID, &update)
}

func (s *RoomService) GetAllMembers(ctx context.Context, roomID primitive.ObjectID) ([]*models.User, error) {

	room, err := s.roomRepo.GetById(ctx, roomID)
	if err != nil {
		return nil, err
	}

	var users []*models.User

	for _, memberID := range room.Members {
		user, err := s.userRepo.GetByID(ctx, memberID)
		if err != nil {
			if errors.Is(err, mongo.ErrNoDocuments) {
				return nil, nil
			}
			return nil, err
		}

		users = append(users, user)

	}
	return users, nil
}

func (s *RoomService) JoinRoom(ctx context.Context, userID, roomID primitive.ObjectID) error {

	return nil
}

func (s *RoomService) LeaveRoom(ctx context.Context, userID, roomID primitive.ObjectID) error {
	return nil
}

func (s *RoomService) SearchRooms(ctx context.Context, code, name string) ([]*models.Room, error) {
	return nil, nil
}

func (s *RoomService) GetRooms(ctx context.Context) ([]*models.Room, error) {
	return nil, nil
}

func (s *RoomService) DeleteRoom(ctx context.Context, roomID, userID primitive.ObjectID) error {
	return nil
}

func (s *RoomService) generateRoomCode(ctx context.Context) (string, error) {
	return "aaaaaa", nil
}
