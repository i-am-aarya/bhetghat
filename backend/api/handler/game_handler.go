package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"sync"

	"github.com/gofiber/contrib/websocket"

	"bhetghat-server/models"
)

var (
	clients = make(map[*websocket.Conn]bool)
	mut     = sync.Mutex{}
)

func WSConn(c *websocket.Conn) {
	defer c.Close()
	clients[c] = true
	fmt.Println("CONNECTED")
	for {
		var p models.Packet
		err := c.ReadJSON(&p)
		if err != nil {
			fmt.Println("error reading json: ", err)
			clients[c] = false
			delete(clients, c)
			break
		}

		switch p.Type {
		// pup -> position update
		case "pup":

		case "chat":
			var message models.ChatPayload

			err := json.Unmarshal(p.Payload, &message)
			if err != nil {
				log.Println("error deserealizing chat payload")
				continue
			}
			fmt.Printf("message: %+v\n", message)

		case "comm":
			fmt.Println("communication request received")
		}

		// broadcast
		for cl := range clients {
			mut.Lock()
			err := cl.WriteJSON(p)
			mut.Unlock()

			if err != nil {
				fmt.Println("error writing json: ", err)
				clients[c] = false
				delete(clients, cl)
				break
			}
		}

	}
}
