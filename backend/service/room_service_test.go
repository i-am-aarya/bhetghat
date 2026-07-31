package service_test

import (
	"bhetghat-server/models"
	"bhetghat-server/service"
	"context"
	"testing"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type mockRoomRepo struct {
	insertFunc    func(room *models.Room) (*models.Room, error)
	getByRoomCode func(code string) (*models.Room, error)
}

func (m *mockRoomRepo) Insert(ctx context.Context, room *models.Room) (*models.Room, error) {
	return m.insertFunc(room)
}

func (m *mockRoomRepo) Update(ctx context.Context, roomID primitive.ObjectID, update *models.UpdateRoomParams) (*models.Room, error) {
	panic("update called")
}

func (m *mockRoomRepo) GetByRoomCode(ctx context.Context, code string) (*models.Room, error) {
	return m.getByRoomCode(code)
}

func (m *mockRoomRepo) GetByID(ctx context.Context, id primitive.ObjectID) (*models.Room, error) {
	panic("get by id called")
}

func (m *mockRoomRepo) GetByName(ctx context.Context, name string) (*models.Room, error) {
	panic("get by name called")
}

func (m *mockRoomRepo) GetAll(ctx context.Context) ([]*models.Room, error) {
	panic("get all called")
}

func (m *mockRoomRepo) AddMember(ctx context.Context, roomID primitive.ObjectID, userID primitive.ObjectID) error {
	panic("add member called")
}
func (m *mockRoomRepo) RemoveMember(ctx context.Context, roomID primitive.ObjectID, userID primitive.ObjectID) error {
	panic("removemember called")
}
func (m *mockRoomRepo) Delete(ctx context.Context, roomID primitive.ObjectID) error {
	panic("delete called")
}

type mockUserRepo struct {
}

func (m *mockUserRepo) GetByID(ctx context.Context, userID primitive.ObjectID) (*models.User, error) {
	panic("called!")
}
func (m *mockUserRepo) GetByUsername(ctx context.Context, username string) (*models.User, error) {
	panic("called!")
}
func (m *mockUserRepo) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	panic("called!")
}
func (m *mockUserRepo) GetAll(ctx context.Context) ([]*models.User, error) {
	panic("called!")
}
func (m *mockUserRepo) Insert(ctx context.Context, user *models.User) (*models.User, error) {
	panic("called!")
}
func (m *mockUserRepo) Update(ctx context.Context, userID primitive.ObjectID, update *models.UpdateUserParams) (*models.User, error) {
	panic("called!")
}

func TestCreateRoom_NoPassword(t *testing.T) {
	mock := &mockRoomRepo{
		insertFunc: func(room *models.Room) (*models.Room, error) {
			room.ID = primitive.NewObjectID()
			return room, nil
		},
		getByRoomCode: func(code string) (*models.Room, error) {
			return nil, nil
		},
	}

	mockUserRepo := &mockUserRepo{}

	svc := service.NewRoomService(mock, mockUserRepo)

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

}

func TestCreateRoom_WithPassword(t *testing.T) {

	mock := &mockRoomRepo{
		insertFunc: func(room *models.Room) (*models.Room, error) {
			room.ID = primitive.NewObjectID()

			return room, nil
		},
		getByRoomCode: func(code string) (*models.Room, error) {
			return nil, nil
		},
	}

	mockUserRepo := &mockUserRepo{}

	ctx := context.Background()
	svc := service.NewRoomService(mock, mockUserRepo)
	userID := primitive.NewObjectID()

	room, err := svc.CreateRoom(ctx, "roomwpass", "password123", true, userID)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if room == nil {
		t.Fatalf("expected room to be created, got nil")
	}

	if room.Name != "roomwpass" {
		t.Errorf("expected name='roomwpass', got %q", room.Name)
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
