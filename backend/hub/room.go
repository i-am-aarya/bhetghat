package hub

import (
	"context"
	"crypto/sha256"
	"fmt"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
)

type Room struct {
	ID        string
	Members   map[string]bool
	CreatedAt time.Time
	ExpiresAt time.Time
}

type RoomManager struct {
	Rooms       map[string]*Room
	RedisClient *redis.Client
	mutex       sync.RWMutex
}

func (rm *RoomManager) CreateRoom(members []string) string {
	if len(members) < 2 {
		return ""
	}
	sorted := sort.StringSlice(members)
	sorted.Sort()
	hash := sha256.Sum256([]byte(strings.Join(sorted, ":")))
	roomID := fmt.Sprintf("%x", hash[:8])

	rm.mutex.Lock()
	defer rm.mutex.Unlock()

	if room, exists := rm.Rooms[roomID]; exists {
		room.ExpiresAt = time.Now().Add(1 * time.Hour)
		return roomID
	}

	rm.Rooms[roomID] = &Room{
		ID:        roomID,
		Members:   make(map[string]bool),
		CreatedAt: time.Now(),
		ExpiresAt: time.Now().Add(1 * time.Hour),
	}

	rm.RedisClient.Set(context.Background(), "room:"+roomID, strings.Join(members, ", "), 1*time.Hour)

	return roomID
}

func (rm *RoomManager) CleanupExpiredRooms() {
	ticker := time.NewTimer(5 * time.Minute)

	for range ticker.C {
		rm.mutex.Lock()
		for id, room := range rm.Rooms {
			if time.Now().After(room.ExpiresAt) {
				delete(rm.Rooms, id)
				rm.RedisClient.Del(context.Background(), "room:"+id)
			}
		}
		rm.mutex.Unlock()
	}
}
