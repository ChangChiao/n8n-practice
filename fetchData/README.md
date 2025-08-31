# n8n Web Scraper

這個專案提供 n8n 的外部 Playwright 腳本，用於自動化網頁操作和資料擷取。

## 功能

- 電商平台資料擷取 (`fetch-web-function.js`)
- 批次新增料號功能 (`add-materials.js`)

## 安裝

```bash
npm install
```

## 環境設定

複製 `.env.example` 到 `.env` 並設定以下變數：

```
ECOMMERCE_TEST_LOGIN_URL=https://e-commerce-test-site-iota.vercel.app
ECOMMERCE_USERNAME=admin
ECOMMERCE_PASSWORD=1234
WEBHOOK_URL=http://localhost:5678/webhook-test/xxxxx
```

## 使用方法

### 1. 電商資料擷取

擷取電商平台訂單資料並發送到 n8n webhook：

```bash
node fetch-web-function.js
```

### 2. 批次新增料號

從 CSV 檔案讀取資料並自動新增料號到系統：

```bash
node add-materials.js
```

#### CSV 檔案格式

預設讀取 `materials.csv`，格式如下：

```csv
料號,品名,申請人,部門,物料類別,規格,數量
MAT-20250801,工控電源模組,王小明,研發部,電子零件,DC 24V / 5A,10
MAT-20250802,工業乙太網路交換器,李美玲,資訊部,網通設備,8 Port / Gigabit,5
```

#### 使用自訂 CSV 檔案

```bash
CSV_PATH=/path/to/your/file.csv node add-materials.js
```

## 注意事項

- 執行腳本時會以非 headless 模式執行，可以看到瀏覽器操作過程
- 驗證碼預設填入 "0000"
- 批次新增料號時，每筆資料處理間隔 1 秒，避免操作過快
- 如果新增失敗，程式會繼續處理下一筆資料並記錄錯誤訊息