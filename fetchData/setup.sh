#!/bin/bash

echo "安裝 n8n Puppeteer 腳本依賴..."

# 進入腳本目錄
cd "$(dirname "$0")"

# 安裝 npm 依賴
echo "安裝 npm packages..."
npm install

# 安裝 Playwright 瀏覽器
echo "安裝 Playwright 瀏覽器..."
npx playwright install chromium

echo "設置完成！"
echo ""
echo "請確保 .env 檔案已正確設置："
echo "- ECOMMERCE_TEST_LOGIN_URL"
echo "- ECOMMERCE_USERNAME"
echo "- ECOMMERCE_PASSWORD"