### How to update n8n image

```bash
docker compose down

docker compose pull

docker compose up -d
```

### export config

```
docker exec -it n8n-n8n-1 sh -c "n8n export:workflow --all --output=/tmp/notion.json && cat /tmp/notion.json" > notion/notion.json
```
