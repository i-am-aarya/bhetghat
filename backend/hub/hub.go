package hub

import (
	"encoding/json"
	"fmt"
	"log"
	"sync"

	"bhetghat-server/models"
)

const (
	PLAYER_ENTER = "penter"
	PLAYER_LEAVE = "pleave"
	PLAYER_STATE = "pstate"
	COMM_REQUEST = "comm"
	CHAT_MESSAGE = "chat"
)

type Hub struct {
	Clients      map[*Client]bool
	RegisterCh   chan *Client
	UnregisterCh chan *Client
	BroadcastCh  chan *models.Packet
	PlayerStates map[string]PlayerState
}

func NewHub() *Hub {
	return &Hub{
		Clients:      make(map[*Client]bool, 256),
		RegisterCh:   make(chan *Client, 256),
		UnregisterCh: make(chan *Client, 256),
		BroadcastCh:  make(chan *models.Packet, 256),
		PlayerStates: make(map[string]PlayerState, 256),
	}
}

func (hub *Hub) Run() {
	for {
		select {
		case client := <-hub.RegisterCh:

			for username, state := range hub.PlayerStates {

				if username == client.Username {
					continue
				}

				payloadMap := map[string]interface{}{
					"x":   state.X,
					"y":   state.Y,
					"s":   state.Username,
					"img": state.SpriteURL,
					"d":   state.Direction,
					"a":   state.AnimationState,
					"f":   state.Frame,
				}

				payloadBytes, _ := json.Marshal(payloadMap)
				existingPkt := &models.Packet{
					Type:    PLAYER_ENTER,
					Sender:  state.Username,
					Payload: payloadBytes,
				}

				client.Send <- existingPkt
				log.Printf("Sent %s's player data to new client: %s", existingPkt.Sender, client.Username)

			}

			hub.Clients[client] = true
			hub.PlayerStates[client.Username] = client.PlayerState

			// penter packet
			pkt := &models.Packet{
				Type:    PLAYER_ENTER,
				Sender:  client.Username,
				Payload: json.RawMessage(fmt.Sprintf(`{"x":"%d","y":"%d","img":"%s","a":"%s","d":"%s","s":"%s"}`, client.PlayerState.X, client.PlayerState.Y, client.PlayerState.SpriteURL, client.PlayerState.AnimationState, client.PlayerState.Direction, client.PlayerState.Username)),
			}

			hub.BroadcastCh <- pkt
			log.Printf("BROADCAST %s's ENTRANCE\n", client.PlayerState.Username)

		case client := <-hub.UnregisterCh:
			if _, ok := hub.Clients[client]; ok {
				delete(hub.Clients, client)
				close(client.Send)
				client.Conn.Close()
				log.Printf("closing %s connection\n", client.Username)
				// pleave packet
				pkt := &models.Packet{
					Type:    PLAYER_LEAVE,
					Sender:  client.Username,
					Payload: json.RawMessage(fmt.Sprintf(`{"s":"%s"}`, client.Username)),
				}
				hub.BroadcastCh <- pkt

			}

		case packet := <-hub.BroadcastCh:
			for client := range hub.Clients {
				select {
				case client.Send <- packet:
				}
			}

		}
	}
}

var globalHubInstance *Hub
var once sync.Once

func GetHubInstance() *Hub {
	once.Do(func() {
		globalHubInstance = NewHub()
	})
	return globalHubInstance
}
