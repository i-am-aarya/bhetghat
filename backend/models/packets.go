package models

import "encoding/json"

type Packet struct {
	Type    string          `json:"t"`
	Sender  string          `json:"s"`
	Payload json.RawMessage `json:"pl"`
}

// playerstate
type StatePayload struct {
	Sender         string `json:"s"`
	X              int    `json:"x"`
	Y              int    `json:"y"`
	AnimationState string `json:"a"`
	Direction      string `json:"d"`
	Frame          int    `json:"f"`
}

type ChatPayload struct {
	Sender  string `json:"s"`
	Message string `json:"m"`
}

type PlayerEnterPayload struct {
	Sender         string `json:"s"`
	X              int    `json:"x"`
	Y              int    `json:"y"`
	ImgSrc         string `json:"img"`
	AnimationState string `json:"a"`
	Direction      string `json:"d"`
	Frame          int    `json:"f"`
}

type CommUpdatePayload struct {
	NearbyUsers []string `json:"nearby"`
	RoomHash    string   `json:"roomHash"`
}

type EventSchedulePayload struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Delay       int    `json:"delay"`
}
