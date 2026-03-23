FROM nginx:stable
COPY . /usr/share/nginx/html
EXPOSE 80
```

That's it — 3 lines! Nginx will serve all your HTML/CSS/JS files directly.

---

## Step 2 — Add `.dockerignore` to repo root
```
.git
.gitignore
Dockerfile
*.zip
README.md
