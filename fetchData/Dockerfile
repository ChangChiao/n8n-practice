# 使用 Playwright 官方映像檔，版本與 package.json 一致
FROM mcr.microsoft.com/playwright:v1.54.1-jammy

# 設定工作目錄
WORKDIR /app

# 複製 package 檔案
COPY package*.json ./

# 安裝 Node.js 相依套件
RUN npm ci --only=production

# 複製應用程式程式碼
COPY . .

# 建立非 root 使用者
RUN groupadd -r appuser && useradd -r -g appuser appuser \
    && chown -R appuser:appuser /app

# 切換到非 root 使用者
USER appuser

# 預設執行命令
CMD ["node", "fetch-web-function.js"]