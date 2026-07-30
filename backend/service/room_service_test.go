package service_test

import (
	"bhetghat-server/models"
	"bhetghat-server/service"
	"context"
	"testing"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type mockRoomRepo struct {
	insertFunc func(room *models.Room) (*models.Room, error)
}

func (m *mockRoomRepo) Insert(ctx context.Context, room *models.Room) (*models.Room, error) {
	return m.insertFunc(room)
}

func (m *mockRoomRepo) Update(ctx context.Context, roomID primitive.ObjectID, update *bson.M) (*models.Room, error) {
	panic("update called")
}

func (m *mockRoomRepo) GetByRoomCode(ctx context.Context, code string) (*models.Room, error) {
	panic("get by room code called")
}

func (m *mockRoomRepo) GetById(ctx context.Context, id primitive.ObjectID) (*models.Room, error) {
	panic("get by id called")
}

func (m *mockRoomRepo) GetByName(ctx context.Context, name string) (*models.Room, error) {
	panic("get by name called")
}

func (m *mockRoomRepo) GetAll(ctx context.Context) ([]*models.Room, error) {
	panic("get all called")
}

func TestCreateRoom_NoPassword(t *testing.T) {
	mock := &mockRoomRepo{
		insertFunc: func(room *models.Room) (*models.Room, error) {
			room.ID = primitive.NewObjectID()
			return room, nil
		},
	}

	svc := service.NewRoomService(mock)

	ctx := context.Background()
	userID := primitive.NewObjectID()

	room, err := svc.CreateRoom(ctx, "gaming-den", "", false, userID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if room.Name != "gaming-den" {
		t.Errorf("expected name='gaming-den', got %q", room.Name)
	}

	if room.RequiresPassword != false {
		t.Errorf("expected RequiresPassword = false")
	}

	if room.HashedPassword != "" {
		t.Errorf("expected empty HashedPassword")
	}

	if room.MemberCount != 1 {
		t.Errorf("expected membercount = 1, got %d", room.MemberCount)
	}

	if room.Capacity != 100 {
		t.Errorf("expected capacity = 100, got %d", room.Capacity)
	}

	if room.RoomCode != "aaaaaa" {
		t.Errorf("expected room code = aaaaaa, got %q", room.RoomCode)
	}

}

func TestCreateRoom_WithPassword(t *testing.T) {

	mock := &mockRoomRepo{
		insertFunc: func(room *models.Room) (*models.Room, error) {
			room.ID = primitive.NewObjectID()

			return room, nil
		},
	}

	ctx := context.Background()
	svc := service.NewRoomService(mock)
	userID := primitive.NewObjectID()

	room, err := svc.CreateRoom(ctx, "dhen", "dhendhen123", true, userID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if room == nil {
		t.Fatalf("expected room to be created, got nil")
	}

	if room.Name != "dhen" {
		t.Errorf("expected name='dhen', got %q", room.Name)
	}

	if room.RequiresPassword != true {
		t.Errorf("expected RequiresPassword = true")
	}

	if room.HashedPassword == "" {
		t.Errorf("expected HashedPassword to be set")
	}

	if room.MemberCount != 1 {
		t.Errorf("expected membercount = 1, got %d", room.MemberCount)
	}

	if room.Capacity != 100 {
		t.Errorf("expected capacity = 100, got %d", room.Capacity)
	}

	if room.RoomCode != "aaaaaa" {
		t.Errorf("expected room code = aaaaaa, got %q", room.RoomCode)
	}

	if room.OwnerID != userID {
		t.Errorf("expected ownerID = %s, got %s", userID, room.OwnerID)
	}

	if room.Members[0] != userID {
		t.Errorf("expected member = %s, got %s", userID, room.Members[0])
	}

	if room.MemberCount != 1 {
		t.Errorf("expected membercount = 1, got %d", room.MemberCount)
	}

	if room.Capacity != 100 {
		t.Errorf("expected capacity = 100, got %d", room.Capacity)
	}

}
