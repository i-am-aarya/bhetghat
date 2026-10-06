package hub

import (
	"fmt"
	"testing"

	"bhetghat-server/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// BenchmarkHubBroadcast measures end-to-end fan-out through Hub.Run:
// one packet in on BroadcastCh → delivered to all N clients' Send channels.
//
// Clients are pre-populated directly (bypassing RegisterCh) so we don't touch
// websocket.Conn at all. That makes this a pure in-memory hot-path benchmark.
func BenchmarkHubBroadcast(b *testing.B) {
	for _, n := range []int{10, 100, 500, 1000, 5000, 10000, 20000} {
		b.Run(fmt.Sprintf("clients_%d", n), func(b *testing.B) {
			hub := NewHub(primitive.NewObjectID())

			clients := make([]*Client, n)
			for i := range n {
				c := &Client{
					Hub:      hub,
					Send:     make(chan *models.Packet, 1),
					Username: fmt.Sprintf("user%d", i),
				}
				clients[i] = c
				hub.Clients[c] = true
			}

			// Start the hub loop. We pre-filled Clients/PlayerStates,
			// so nothing races.
			go hub.Run()

			pkt := &models.Packet{
				Type:    CHAT_MESSAGE,
				Sender:  "someone",
				Payload: []byte(`{"msg":"hi"}`),
			}

			b.ResetTimer()
			for i := 0; i < b.N; i++ {
				hub.BroadcastCh <- pkt
				// Drain each client's Send so the hub doesn't block,
				// and so we measure full delivery.
				for _, c := range clients {
					<-c.Send
				}
			}
		})
	}
}
