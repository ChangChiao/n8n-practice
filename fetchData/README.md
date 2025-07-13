# n8n Puppeteer 資料抓取工具

這個專案提供了一個使用 Playwright 的資料抓取腳本，可以整合到 n8n 工作流程中。

## 檔案結構

```
fetchData/
├── alternative-puppeteer-function.js  # 主要的抓取腳本
├── package.json                       # Node.js 專案設定
├── setup.sh                          # 安裝腳本
├── .env.example                      # 環境變數範例
├── .env                             # 環境變數設定（不在版控中）
├── workflows/
│   ├── data-scraping-workflow.json  # n8n 內建 puppeteer 節點工作流程
│   └── execute-puppeteer-script.json # 執行外部腳本的工作流程
└── README.md                        # 本檔案
```

## 快速開始

### 1. 安裝依賴

```bash
cd fetchData
./setup.sh
```

### 2. 設定環境變數

複製 `.env.example` 到 `.env` 並填入必要資訊：

```bash
cp .env.example .env
```

編輯 `.env` 檔案：
```
ECOMMERCE_TEST_LOGIN_URL=https://e-commerce-test-site-iota.vercel.app/login
ECOMMERCE_USERNAME=admin
ECOMMERCE_PASSWORD=1234
```

### 3. 測試腳本

```bash
node alternative-puppeteer-function.js
```

### 4. 整合到 n8n

1. 開啟 n8n (http://localhost:5678)
2. 匯入 `workflows/execute-puppeteer-script.json`
3. 執行工作流程

## 工作流程說明

### execute-puppeteer-script.json
- 使用 Execute Command 節點執行外部腳本
- 包含 Webhook 接收腳本回傳的數據
- 適合需要使用本地安裝的 Playwright

### data-scraping-workflow.json
- 使用 n8n 內建的 Function 節點
- 需要安裝 n8n-nodes-puppeteer
- 適合在 n8n 環境內直接執行

## 故障排除

如果遇到問題，請參考 `n8n-integration-guide.md` 中的詳細說明。