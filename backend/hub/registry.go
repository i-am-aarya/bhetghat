package hub

import (
	"sync"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type HubRegistry struct {
	mu sync.RWMutex

	// roomID -> hub
	hubs map[primitive.ObjectID]*Hub
}

func NewHubRegistry() *HubRegistry {
	return &HubRegistry{
		hubs: make(map[primitive.ObjectID]*Hub),
	}
}

func (r *HubRegistry) GetOrCreate(roomID primitive.ObjectID) *Hub {
	r.mu.Lock()
	defer r.mu.Unlock()

	if hub, ok := r.hubs[roomID]; ok {
		return hub
	}

	roomManager := &SessionManager{
		Sessions: make(map[string]*Session),
	}

	hub := NewHub(roomID)
	hub.Proximity = NewProximityManager()
	hub.Proximity.SessionManager = roomManager

	r.hubs[roomID] = hub
	go hub.Run()

	return hub
}

func (r *HubRegistry) Remove(roomID primitive.ObjectID) {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.hubs, roomID)
}
