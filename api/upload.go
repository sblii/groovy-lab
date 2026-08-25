package handler

import (
	"archive/zip"
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/google/go-github/v53/github"
	"golang.org/x/oauth2"
)

func Uploader(w http.ResponseWriter, r *http.Request){
	//Execption Handler 1 : HTTP METHOD
	if r.Method != http.MethodPut && r.Method != http.MethodPost{
		http.Error(w, `{"success": false, "error": "Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	//Exception Handler + : SESSION CHECK
	sessionToken := os.Getenv("SESSION_TOKEN")
	cookie, err := r.Cookie("auth_session")

	if err != nil || cookie.Value != sessionToken {
		http.Error(w, `{"success": false, "error": "Unauthorized: Expired Session / Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	//Exception Handler 2 : ZIP FILE SIZE
	r.Body = http.MaxBytesReader(w, r.Body, 4<<20)
	if err := r.ParseMultipartForm(4<<20); err != nil{
		http.Error(w, `{"success": false, "error": "Exceed maximum size. (Limit: 20MB)"}`, http.StatusRequestEntityTooLarge)
		return
	}

	//Exception Handler 3 : MEMBER AND FILE SET
	memberID := r.FormValue("member")
	file, header, err := r.FormFile("file")
	if err != nil || memberID == "" {
		http.Error(w, `{"success": false, "error": "Wrong data component. (Please check member or file)"}`, http.StatusBadRequest)
		return
	}
	defer file.Close()

	//Exception Handler 4 : ZIP FILE TYPE
	if strings.ToLower(filepath.Ext(header.Filename)) != ".zip" {
		http.Error(w, `{"success": false, "error": "Unallowed file extension. (.ZIP FILE ONLY)"}`, http.StatusBadRequest)
		return
	}

	//tmp file create
	tempDir := "/tmp/upload_file_tmp"
	os.MkdirAll(tempDir, 0755)
	tempFilePath := filepath.Join(tempDir, header.Filename)
	tempFile, err := os.Create(tempFilePath)
	if err != nil {
		http.Error(w, `{"success": false, "error": "tmp file fail."}`, http.StatusInternalServerError)
		return
	}
	io.Copy(tempFile, file)
	tempFile.Close()

	defer os.RemoveAll(tempDir)

	//zip file open
	zipReader, err := zip.OpenReader(tempFilePath)
	if err != nil {
		http.Error(w, `{"success": false, "error": "Zip file fail."}`, http.StatusBadRequest)
		return
	}
	defer zipReader.Close()

	/*Unwrapping / Extension Exception Handler*/
	//Variable Define
	allowedExts := map[string]bool{".html": true, ".css": true, ".js": true, ".webp": true} 
	hasIndexHTML := false
	filesToUpload := make(map[string][]byte)

	for _, zf := range zipReader.File{
		//U/E Exception Handler 1 : MACOS
		if strings.Contains(zf.Name, "__MACOSX/") || strings.HasSuffix(zf.Name, ".DS_Store"){
			continue
		}

		//U/E Exception Handler 2 : Not folder, Only file compare
		if zf.FileInfo().IsDir() {
			continue
		}

		//U/E Exception Handler 3 : Overlapping folder prevent
		parts := strings.Split(strings.Trim(zf.Name, "/"), "/")
		if len(parts) > 2 {
			http.Error(w, `{"success": false, "error": "Too many nested directories. (Single folder allowed)"}`, http.StatusBadRequest)
			return
		}

		//Extract extensions from filename
		fileName := parts[len(parts)-1]
		ext := strings.ToLower(filepath.Ext(fileName))

		//U/E Exception Handler 4 : file extension prevent
		if !allowedExts[ext] {
			http.Error(w, `{"success": false, "error": "Unallowed file extension: `+ext+`"}`, http.StatusBadRequest)
			return
		}

		//Check index html exist.
		if ext == ".html" && fileName == "index.html" {
			hasIndexHTML = true
		}

		//Save to flash memory
		rc, err := zf.Open()
		if err != nil {
			http.Error(w, `{"success": false, "error": "Zip file opn fail: `+fileName+`"}`, http.StatusInternalServerError)
			return
		}
		content, err := io.ReadAll(rc)
		if err != nil {
			rc.Close() // 반환(return) 전에 열려있는 리소스 해제
			http.Error(w, `{"success": false, "error": "Inner file read fail: `+fileName+`"}`, http.StatusInternalServerError)
			return
		}
		rc.Close()

		//Set upload path
		uploadPath := fmt.Sprintf("%s/%s", memberID, fileName)
		filesToUpload[uploadPath] = content

		//U/E Exception Handler 5 : index.html existence 
		if !hasIndexHTML {
			http.Error(w, `{"success": false, "error": "No index.html"}`, http.StatusBadRequest)
			return
		}
	}

	githubToken := os.Getenv("GITHUB_TOKEN")
	repoEnv := os.Getenv("GITHUB_ADDR") // 형식: "owner/repo"
	repoParts := strings.Split(repoEnv, "/")
	if len(repoParts) != 2 {
		http.Error(w, `{"success": false, "error": "Server GITHUB_ADDR error"}`, http.StatusInternalServerError)
		return
	}
	owner, repo := repoParts[0], repoParts[1]

	ctx := context.Background()
	ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: githubToken})
	tc := oauth2.NewClient(ctx, ts)
	client := github.NewClient(tc)

	var wg sync.WaitGroup
	errChan := make(chan error, len(filesToUpload))

	for path, content := range filesToUpload {
		wg.Add(1)
		
		go func(p string, c []byte) {
			defer wg.Done()
			
			// 6-1. 기존 파일의 SHA 값 확인 (있으면 덮어쓰기 용도)
			var fileSHA *string
			fileContent, _, _, err := client.Repositories.GetContents(ctx, owner, repo, p, nil)
			if err == nil && fileContent != nil {
				fileSHA = fileContent.SHA
			}

			// 6-2. 파일 업로드 또는 업데이트
			opts := &github.RepositoryContentFileOptions{
				Message: github.String("Showcase update for " + p),
				Content: c,
				SHA:     fileSHA, // 값이 nil이면 새로 생성, 존재하면 업데이트 처리됨
			}
			
			_, _, err = client.Repositories.UpdateFile(ctx, owner, repo, p, opts)
			if err != nil {
				errChan <- fmt.Errorf("%s Upload fail: %v", p, err)
			}
		}(path, content)
	}

	wg.Wait()
	close(errChan)

	if len(errChan) > 0 {
		firstErr := <-errChan
		http.Error(w, fmt.Sprintf(`{"success": false, "error": "%v"}`, firstErr), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"success": true, "message": "Upload Success"}`))
}