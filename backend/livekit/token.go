package livekit

import (
	"time"

	"github.com/livekit/protocol/auth"
)

func GetJoinKey(apiKey, apiSecret, room, identity string) (string, error) {
	at := auth.NewAccessToken(apiKey, apiSecret)
	t := true

	grant := &auth.VideoGrant{
		RoomJoin:     true,
		Room:         room,
		CanPublish:   &t,
		CanSubscribe: &t,
	}

	at.SetVideoGrant(grant).SetIdentity(identity).SetValidFor(time.Hour)

	return at.ToJWT()
}
