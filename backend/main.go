package main

import (
	"net/http"
)

func main() {
	srv := &http.Server{
		Addr: ":8000",
	}

	srv.ListenAndServe()
}
