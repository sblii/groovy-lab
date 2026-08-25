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
	//Exception Handler 1 : HTTP METHOD
	if r.Method != http.MethodPost {
		http.Error(w, `{"success": false, "error": "Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	//Exception Handler 2 : JSON FORMAT
	var req RequestBody
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, `{"success": false, "error": "Invalid JSON format"}`, http.StatusBadRequest)
		return
	}

	//Exception Handler 3 : Wrong password
	if req.Password != os.Getenv("PASSWORD") {
		http.Error(w, `{"success": false, "error": "Unauthorized: Wrong Password."}`, http.StatusUnauthorized)
		return
	}

	//Token
	sessionToken := os.Getenv("TOKEN") // Vercel 환경변수에 등록해야 함
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_session",
		Value:    sessionToken,
		Path:     "/",
		MaxAge:   3600, 
		HttpOnly: true, 
		Secure:   true, 
		SameSite: http.SameSiteStrictMode,
	})

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"success": true, "message": "Authorized"}`))
}
