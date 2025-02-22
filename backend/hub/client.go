package hub

import (
	"bhetghat-server/models"
	"encoding/json"
	"errors"
	"fmt"
	"log"

	"github.com/gofiber/contrib/websocket"
)

type PlayerState struct {
	Username       string `json:"s"`
	X              int    `json:"x"`
	Y              int    `json:"y"`
	SpriteURL      string `json:"img"`
	AnimationState string `json:"a"`
	Direction      string `json:"d"`
	Frame          int    `json:"f"`
}

type Client struct {
	Hub         *Hub
	Conn        *websocket.Conn
	Send        chan *models.Packet
	Username    string
	PlayerState PlayerState
}

// client ko conn bata padhcha
func (c *Client) ReadPump() {
	defer func() {
		c.Hub.UnregisterCh <- c
		c.Conn.Close()
	}()

	for {
		var pkt models.Packet
		if err := c.Conn.ReadJSON(&pkt); err != nil {
			if errors.Is(err, websocket.ErrCloseSent) {
				c.Hub.UnregisterCh <- c
				return
			}
			log.Printf("ERROR reading packet from client %s: %v", c.Username, err)
			c.Hub.UnregisterCh <- c
		}

		switch pkt.Type {
		case PLAYER_STATE:
			var state models.StatePayload
			if err := json.Unmarshal(pkt.Payload, &state); err != nil {
				log.Printf("ERROR unmarshalling position payload from client %s: %v", c.Username, err)
				continue
			}

			c.Hub.BroadcastCh <- &pkt

		case PLAYER_ENTER:
			var pl models.PlayerEnterPayload
			if err := json.Unmarshal(pkt.Payload, &pl); err != nil {
				log.Printf("ERROR unmarshalling player enter payload from client %s: %v", c.Username, err)
				continue
			}
			log.Printf("Client %s sent payload: %v", c.Username, pl)
			c.Hub.BroadcastCh <- &pkt

			for username, plState := range c.Hub.PlayerStates {
				c.Send <- &models.Packet{
					Type:   PLAYER_ENTER,
					Sender: username,
					Payload: json.RawMessage(
						fmt.Sprintf(
							`{"x":"%d","y":"%d","img":"%s","a":"%s","d":"%s","s":"%s"}`,
							plState.X,
							plState.Y,
							plState.SpriteURL,
							plState.AnimationState,
							plState.Direction,
							plState.Username,
						),
					),
				}
				log.Printf("sent client %s data about %s", c.Username, username)
			}

		case PLAYER_LEAVE:
			c.Hub.UnregisterCh <- c

		case CHAT_MESSAGE:
			var cpl models.ChatPayload
			if err := json.Unmarshal(pkt.Payload, &cpl); err != nil {
				log.Printf("ERROR unmarshalling chat payload from %s: %v", c.Username, err)

				continue
			}
			c.Hub.BroadcastCh <- &pkt
		// store message in database

		case COMM_REQUEST:

		default:
			log.Printf("unknown packet type from client %s: %s", c.Username, pkt.Type)
			// c.Hub.UnregisterCh <- c
			// c.Conn.Close()
			return
		}

	}

}

// client ko conn ma lekhcha
func (c *Client) WritePump() {
	defer c.Conn.Close()
	for {
		select {
		case message, ok := <-c.Send:
			if !ok {
				if err := c.Conn.Close(); err != nil {
					log.Printf("error closing connection %s", err)
				}
				return
			}
			if message.Sender == c.Username {
				continue
			}
			if err := c.Conn.WriteJSON(message); err != nil {
				log.Printf("Error writing JSON to client %s: %v", c.Username, err)
				return
			}
			// log.Printf("message from %s written to %s", message.Sender, c.PlayerState.Username)

		}
	}

}
