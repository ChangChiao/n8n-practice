### How to update n8n image

```bash
docker compose down

docker compose pull

docker compose up -d
```

### export config

# ① 在容器內把所有 workflow 各自匯出到 /tmp/workflows 目錄

```
docker exec -i n8n-n8n-1 sh -c \
  "n8n export:workflow --all --separate --output=/tmp/workflows"
```

# ② 把整個目錄複製到宿主機（這裡放到 workflow/ 資料夾）

```
docker cp n8n-n8n-1:/tmp/workflows ./workflow/
```

# execute playwright script

```
node /home/node/fetchData/fetch-web-function.js
```
