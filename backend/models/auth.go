package models

type TokenPair struct {
	AccessToken  string
	RefreshToken string
}

type TokenResponse struct {
	User        *User  `json:"user"`
	AccessToken string `json:"accessToken"`
}

type RefreshResponse struct {
	AccessToken string `json:"accessToken"`
}
