package models

type SuccessResponse struct {
	Message string `json:"message"`
	Data    any    `json:"data"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}
