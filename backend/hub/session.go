package hub

import (
	"crypto/sha256"
	"fmt"
	"sort"
	"strings"
	"sync"
	"time"
)

// call session
type Session struct {
	ID        string
	Members   map[string]bool
	CreatedAt time.Time
	ExpiresAt time.Time
}

type SessionManager struct {
	Sessions map[string]*Session
	mutex    sync.RWMutex
}

func (rm *SessionManager) CreateRoom(members []string) string {
	if len(members) < 2 {
		return ""
	}
	sorted := sort.StringSlice(members)
	sorted.Sort()
	hash := sha256.Sum256([]byte(strings.Join(sorted, ":")))
	roomID := fmt.Sprintf("%x", hash[:8])

	rm.mutex.Lock()
	defer rm.mutex.Unlock()

	if room, exists := rm.Sessions[roomID]; exists {
		room.ExpiresAt = time.Now().Add(1 * time.Hour)
		return roomID
	}

	rm.Sessions[roomID] = &Session{
		ID:        roomID,
		Members:   make(map[string]bool),
		CreatedAt: time.Now(),
		ExpiresAt: time.Now().Add(1 * time.Hour),
	}

	return roomID
}

func (rm *SessionManager) CleanupExpiredRooms() {
	ticker := time.NewTimer(5 * time.Minute)

	for range ticker.C {
		rm.mutex.Lock()
		for id, room := range rm.Sessions {
			if time.Now().After(room.ExpiresAt) {
				delete(rm.Sessions, id)
			}
		}
		rm.mutex.Unlock()
	}
}
