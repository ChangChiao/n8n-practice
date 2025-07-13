# n8n 整合指南（詳細版）

## 準備工作

### 1. 安裝依賴
```bash
cd fetchData
./setup.sh
```

### 2. 確認環境變數
確保 `.env` 檔案包含必要的設定：
```
ECOMMERCE_TEST_LOGIN_URL=https://e-commerce-test-site-iota.vercel.app/login
ECOMMERCE_USERNAME=admin
ECOMMERCE_PASSWORD=1234
```

## 三種執行方法

### 方法 1: Execute Command 節點（推薦）

1. 在 n8n 中匯入 `workflows/execute-puppeteer-script.json`
2. 工作流程包含：
   - Manual Trigger：手動觸發執行
   - Execute Command：執行外部腳本
   - Webhook + Respond：接收腳本回傳的數據

**優點**：簡單直接，不需要修改原始腳本

### 方法 2: 使用 HTTP Request 節點

1. 修改腳本以作為 API 服務運行
2. 使用 n8n 的 HTTP Request 節點呼叫

### 方法 3: Docker 整合

如果 n8n 在 Docker 中運行，需要：

1. 將腳本目錄掛載到容器：
```yaml
volumes:
  - ./fetchData:/home/node/fetchData
```

2. 在容器內安裝依賴：
```bash
docker exec -it n8n /bin/sh
cd /home/node/fetchData
npm install
npx playwright install-deps
```

## 執行腳本

### 手動執行測試
```bash
cd fetchData
node alternative-puppeteer-function.js
```

### 從 n8n 執行

1. 開啟 n8n (http://localhost:5678)
2. 匯入 workflow：`execute-puppeteer-script.json`
3. 點擊 "Execute Workflow"

## 排程執行

在 workflow 中將 Manual Trigger 替換為 Schedule Trigger：
- 設定執行頻率（每日、每小時等）
- 腳本會自動執行並將數據發送到 webhook

## 故障排除

### 1. 權限問題
```bash
sudo chown -R $(whoami) ./fetchData
```

### 2. Playwright 瀏覽器問題
```bash
npx playwright install --with-deps chromium
```

### 3. n8n 無法執行外部命令
確保 n8n 環境變數：
```
NODE_FUNCTION_ALLOW_EXTERNAL=*
EXECUTIONS_PROCESS=main
```

### 4. Webhook 無法接收數據
- 確認 webhook URL 正確
- 檢查 n8n 是否在 http://localhost:5678 運行
- 確認防火牆未阻擋連接