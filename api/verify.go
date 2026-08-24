package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"strconv" 
)

type RequestBody struct {
	Password int `json:"password"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req RequestBody
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	envPassword := os.Getenv("PASSWORD")

	receivedPasswordStr := strconv.Itoa(req.Password)

	if receivedPasswordStr != envPassword {
		http.Error(w, "Authority Denied", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"success": true, "message": "Authorized"}`))
}