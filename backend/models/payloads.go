package models

type PlayerEnter struct {
	UserID string `json:"uid"`
}

type Position struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

type PositionUpdate struct {
	UserID   string   `json:"uid"`
	Position Position `json:"p"`
}
