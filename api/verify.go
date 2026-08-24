package handler

import (
	"encoding/json"
	"net/http"
	"os"
)

type RequestBody struct {
	Password string `json:"password"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, `{"success": false, "error": "Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	var req RequestBody
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, `{"success": false, "error": "Invalid JSON format"}`, http.StatusBadRequest)
		return
	}

	envPassword := os.Getenv("PASSWORD")

	if req.Password != envPassword {
		http.Error(w, `{"success": false, "error": "Unauthorized: 비밀번호가 틀렸습니다."}`, http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"success": true, "message": "인증 완료되었습니다."}`))
}
