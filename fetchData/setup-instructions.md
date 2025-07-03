# n8n 自動化數據抓取設置指南

## 前置作業

### 1. 安裝 n8n-nodes-puppeteer

```bash
# 進入 n8n container
docker exec -it n8n /bin/sh

# 安裝社群節點
npm install -g n8n-nodes-puppeteer

# 重啟 n8n
exit
docker restart n8n
```

### 2. 設置 Google Sheets API

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Google Sheets API
4. 建立 OAuth 2.0 憑證
5. 在 n8n 中設置 Google Sheets OAuth2 憑證

### 3. 設置 OpenAI API

1. 前往 [OpenAI Platform](https://platform.openai.com/)
2. 建立 API Key
3. 在 n8n 中設置 OpenAI 憑證

## 工作流程設置

### 1. 匯入工作流程

1. 登入 n8n (http://localhost:5678)
2. 點擊 "Import from File"
3. 選擇 `workflows/data-scraping-workflow.json`

### 2. 更新設定

需要更新以下內容：

1. **Google Sheets ID**

   - 在 "Update Google Sheets" 和 "Save Analysis to Sheets" 節點中
   - 將 `YOUR_GOOGLE_SHEET_ID` 替換為實際的 Google Sheets ID

2. **網站 URL**

   - 在 "電商網站" 中更新實際的 URL

3. **選擇器 (Selectors)**
   - 根據實際網站結構更新 CSS 選擇器
   - 使用瀏覽器開發者工具檢查元素

### 3. 測試執行

1. 點擊 "Execute Workflow" 進行手動測試
2. 檢查每個節點的輸出
3. 確認數據正確寫入 Google Sheets

## 自訂選擇器指南

### 電商平台 選擇器

```javascript
// 登入表單
await page.type("#username", "admin"); // 使用者名稱輸入框
await page.type("#password", "1234"); // 密碼輸入框
await page.click("#login-button"); // 登入按鈕

// 數據表格
await page.waitForSelector(".data-table"); // 等待表格載入
const rows = document.querySelectorAll(".data-table tr"); // 表格列
```

## 故障排除

### 1. Puppeteer 無法執行

- 確認已安裝 n8n-nodes-puppeteer
- 檢查 NODE_FUNCTION_ALLOW_EXTERNAL 環境變數

### 2. 登入失敗

- 檢查選擇器是否正確
- 確認帳號密碼無誤
- 增加等待時間

### 3. 數據抓取失敗

- 使用 `headless: false` 觀察執行過程
- 檢查網頁結構是否改變
- 更新選擇器

### 4. Google Sheets 寫入失敗

- 確認 OAuth2 憑證設置正確
- 檢查 Sheet ID 和名稱
- 確認有寫入權限
