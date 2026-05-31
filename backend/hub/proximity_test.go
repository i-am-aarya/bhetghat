// proximity_test.go
package hub

import (
	"fmt"
	"testing"
)

func BenchmarkGetNearbyPlayers(b *testing.B) {
	for _, n := range []int{10, 50, 100, 500} {
		b.Run(fmt.Sprintf("%d_players", n), func(b *testing.B) {
			pm := NewProximityManager()

			// Seed N players at random positions
			for i := 0; i < n; i++ {
				username := fmt.Sprintf("user%d", i)
				pm.UpdatePosition(username, i*10, i*10)
			}

			b.ResetTimer()
			b.RunParallel(func(pb *testing.PB) {
				for pb.Next() {
					pm.GetNearbyPlayers("user0")
				}
			})
		})
	}
}
