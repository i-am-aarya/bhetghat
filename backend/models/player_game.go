package models

// type PlayerPosition struct {
// 	X float64 `json:"x"`
// 	Y float64 `json:"y"`
// }
//
// type Player struct {
// 	Name     string         `json:"n"`
// 	Position PlayerPosition `json:"p"`
// }

// type Packet struct {
// 	Type    string      `json:"t"`
// 	Payload interface{} `json:"p"`
// }

type Packet struct {
	Name     string   `json:"n"`
	Position Position `json:"p"`
}

// type Packet struct {
// 	Type string `json:"t"`
// }
// type Payload struct {
// 	Name     string         `json:"n"`
// 	Position PlayerPosition `json:"p"`
// 	Message  string         `json:"m"`
// 	Receiver string         `json:"r"`
// }
