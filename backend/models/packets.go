package models

type Packet struct {
	Type    string      `json:"t"`
	Payload interface{} `json:"pl"`
}

type PositionPayload struct {
	Name     string   `json:"n"`
	Position Position `json:"p"`
}

type Position struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

type ChatPayload struct {
	Name    string `json:"n"`
	Message string `json:"m"`
}
