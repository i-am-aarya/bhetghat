package handler

import (
	"bhetghat-server/hub"
	"bhetghat-server/models"
	"encoding/json"
	"log"

	"github.com/gofiber/contrib/websocket"
)

func WSConn(c *websocket.Conn) {
	defer c.Close()
	globalHub := hub.GetHubInstance()

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

	client := &hub.Client{
		Hub:      globalHub,
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

	globalHub.RegisterCh <- client

	go client.WritePump()
	client.ReadPump()

}
