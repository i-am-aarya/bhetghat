package hub

import (
	"crypto/sha256"
	"fmt"
	"math"
	"sort"
	"strings"
	"sync"
)

const COMMUNICATION_RADIUS = 250

type Position struct {
	X int
	Y int
}

type ProximityManager struct {
	positions   map[string]Position
	activeRooms map[string][]string
	mutex       sync.RWMutex
	RoomManager *RoomManager
}

func NewProximityManager() *ProximityManager {
	return &ProximityManager{
		positions:   make(map[string]Position),
		activeRooms: make(map[string][]string),
	}
}

func (pm *ProximityManager) GetNearbyPlayers(username string) []string {
	pm.mutex.Lock()
	defer pm.mutex.Unlock()

	currentPos, exists := pm.positions[username]

	if !exists {
		return nil
	}

	var nearby []string
	for user, pos := range pm.positions {
		if user == username {
			continue
		}

		if distance(currentPos, pos) <= COMMUNICATION_RADIUS {
			nearby = append(nearby, user)
		}
	}

	return nearby
}

func (pm *ProximityManager) UpdatePosition(username string, x, y int) {
	pm.mutex.Lock()
	defer pm.mutex.Unlock()

	pm.positions[username] = Position{X: x, Y: y}
}

func (pm *ProximityManager) Cleanup(username string) {
	pm.mutex.Lock()
	defer pm.mutex.Unlock()
	delete(pm.positions, username)
}

func (pm *ProximityManager) GetRoomHash(username string) string {
	pm.mutex.Lock()
	defer pm.mutex.Unlock()

	nearby := pm.GetNearbyPlayersLocked(username)
	if len(nearby) == 0 {
		return ""
	}

	members := append(nearby, username)
	sort.Strings(members)

	return pm.RoomManager.CreateRoom(members)
}

func (pm *ProximityManager) GetNearbyPlayersLocked(username string) []string {
	currentPos, exists := pm.positions[username]
	if !exists {
		return nil
	}

	var nearby []string
	for user, pos := range pm.positions {
		if user != username && distance(currentPos, pos) <= COMMUNICATION_RADIUS {
			nearby = append(nearby, user)
		}
	}
	return nearby

}

func generateRoomID(members []string) string {
	hash := sha256.Sum256([]byte(strings.Join(members, ":")))
	return fmt.Sprintf("%x", hash[:8])
}

func distance(a, b Position) float64 {
	return math.Sqrt(math.Pow(float64(a.X-b.X), 2) + math.Pow(float64(a.Y-b.Y), 2))
}
