package handler

import (
	"fmt"
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

		// fmt.Println(p.)
		switch p.Type {
		// pup -> position update
		case "pup":
		// fmt.Println("POSITION UPDATE")

		// chat -> chat
		case "chat":
			fmt.Println("ITS A MESSAGE:")
			fmt.Println(p)
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
