package handler

import (
	"bhetghat-server/hub"
	"bhetghat-server/models"
	"encoding/json"
	"log"
	"log/slog"

	"github.com/gofiber/contrib/websocket"
)

type WSHandler struct {
	registry *hub.HubRegistry
}

func NewWSHandler(registry *hub.HubRegistry) *WSHandler {
	return &WSHandler{
		registry: registry,
	}
}

func (h *WSHandler) HandleGameWS(c *websocket.Conn) {
	defer c.Close()
	room, ok := c.Locals("room").(*models.Room)
	if !ok || room == nil {
		slog.Error("room not found in locals")
		return
	}

	var initialPkt models.Packet
	if err := c.ReadJSON(&initialPkt); err != nil {
		log.Printf("ERROR READING JSON: %v", err)
		return
	}
	log.Printf("INITIAL PACKET from %s", initialPkt.Sender)

	var playerEnterPayload models.PlayerEnterPayload
	if err := json.Unmarshal(initialPkt.Payload, &playerEnterPayload); err != nil {
		log.Printf("ERROR READING JSON: %v", err)
		return
	}

	roomHub := h.registry.GetOrCreate(room.ID)
	log.Printf("USER: %s\t\tHUB: %s", playerEnterPayload.Sender, roomHub)

	client := &hub.Client{
		Hub:      roomHub,
		Conn:     c,
		Send:     make(chan *models.Packet, 256),
		Username: playerEnterPayload.Sender,
		PlayerState: hub.PlayerState{
			Username:       playerEnterPayload.Sender,
			SpriteURL:      playerEnterPayload.ImgSrc,
			X:              playerEnterPayload.X,
			Y:              playerEnterPayload.Y,
			AnimationState: playerEnterPayload.AnimationState,
			Direction:      playerEnterPayload.Direction,
			Frame:          playerEnterPayload.Frame,
		},
	}

	roomHub.RegisterCh <- client

	go client.WritePump()
	client.ReadPump()

}
