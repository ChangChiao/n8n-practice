# Docker 使用指南

這份文件說明如何使用 Docker 來執行 n8n web scraper，讓你不需要在本機安裝任何相依套件。

## 前置準備

1. 安裝 Docker 和 Docker Compose
2. 複製 `.env.example` 為 `.env` 並設定環境變數：
   ```bash
   cp .env.example .env
   ```

## 環境變數設定

編輯 `.env` 檔案，設定以下變數：

- `ECOMMERCE_TEST_LOGIN_URL`: 電商平台登入網址
- `ECOMMERCE_USERNAME`: 登入帳號
- `ECOMMERCE_PASSWORD`: 登入密碼
- `WEBHOOK_URL`: n8n webhook URL（在 Docker 中請使用 `http://host.docker.internal:5678/...`）

## 使用方式

### 1. 建置 Docker 映像檔

```bash
make build
# 或
docker-compose build
```

### 2. 執行 web scraper

```bash
make run
# 或
docker-compose run --rm web-scraper
```

### 3. 執行測試腳本

```bash
make test
# 或
docker-compose run --rm test-script
```

### 4. 在背景執行

```bash
make up
# 或
docker-compose up -d
```

### 5. 查看日誌

```bash
make logs
# 或
docker-compose logs -f
```

### 6. 進入容器 shell（除錯用）

```bash
make shell
# 或
docker-compose run --rm web-scraper /bin/bash
```

### 7. 停止所有服務

```bash
make down
# 或
docker-compose down
```

### 8. 清理資源

```bash
make clean
```

## 注意事項

1. **Webhook URL**: 如果 n8n 運行在本機，在 Docker 容器中需要使用 `host.docker.internal` 而不是 `localhost`。

2. **Playwright**: 使用官方的 Playwright Docker 映像檔，已包含所有必要的瀏覽器相依套件。

3. **資料儲存**: 如果需要儲存擷取的資料或截圖，會儲存在 `./data` 目錄中。

4. **網路**: 所有服務都在 `n8n-network` 網路中運行，方便服務間通訊。

## 疑難排解

### 無法連接到 webhook

確認 `.env` 中的 `WEBHOOK_URL` 設定正確：

- 本機 n8n: `http://host.docker.internal:5678/webhook-test/...`
- 遠端 n8n: 使用實際的網址

### 瀏覽器無法啟動

確認 Docker 有足夠的記憶體（建議至少 2GB）。

### 權限問題

容器內使用非 root 使用者執行，如果遇到權限問題，請確認 `./data` 目錄有正確的權限。
