// 如果 n8n-nodes-puppeteer 無法使用，可以使用 HTTP Request 節點配合此函數

const { chromium } = require("playwright");
require("dotenv").config();

async function scrapeEcommerce() {
  const launchOptions = {
    headless: true, // Docker 環境中必須使用 headless
  };
  
  // 如果設定了系統 Chromium 路徑，使用它
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  }
  
  const browser = await chromium.launch(launchOptions);

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  });

  const page = await context.newPage();

  try {
    // 前往登入頁面
    await page.goto(
      process.env.ECOMMERCE_TEST_LOGIN_URL ||
        "https://e-commerce-test-site-iota.vercel.app"
    );

    // 填寫登入資訊
    await page.fill("#username", process.env.ECOMMERCE_USERNAME || "admin");
    await page.fill("#password", process.env.ECOMMERCE_PASSWORD || "1234");

    // 點擊登入
    await page.click('button[type="submit"]');

    // 等待使用者手動輸入驗證碼
    await page.fill("#verificationCode", "0000");
    // console.log("請在30秒內手動輸入驗證碼...");
    // await page.waitForTimeout(10000); // 等待10秒

    // 點擊登入
    await page.click('button[type="submit"]');

    // 等待登入完成
    await page.waitForLoadState("networkidle");

    // 導航到報表頁面
    await page.click("text=訂單查詢");
    await page.waitForSelector("table.order-header");

    // 擷取數據
    const data = await page.evaluate(() => {
      const table = document.querySelector("table.order-header");
      const rows = table.querySelectorAll("tbody tr");
      const results = [];

      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length > 0) {
          results.push({
            orderId: cells[0]?.textContent?.trim(),
            name: cells[1]?.textContent?.trim(),
            address: cells[2]?.textContent?.trim(),
            phone: cells[3]?.textContent?.trim(),
            item: cells[4]?.textContent?.trim(),
            time: cells[5]?.textContent?.trim(),
            amount: cells[6]?.textContent?.trim(),
          });
        }
      });

      return results;
    });

    await browser.close();
    return data;
  } catch (error) {
    await browser.close();
    throw new Error(`抓取失敗: ${error.message}`);
  }
}

// 主函數
async function main() {
  const results = {
    ecommerce: null,
    timestamp: new Date().toISOString(),
  };

  try {
    results.ecommerce = await scrapeEcommerce();
  } catch (error) {
    console.error("電商平台錯誤:", error);
    results.ecommerce = { error: error.message };
  }

  // 發送資料到 webhook
  try {
    console.log("準備發送資料到 webhook:", JSON.stringify(results, null, 2));
    const webhookResponse = await postToWebhook(results);
    console.log("Webhook 回應:", webhookResponse);
    console.log("資料已成功發送到 webhook");
  } catch (error) {
    console.error("發送到 webhook 失敗:", error);
  }

  return results;
}

// 發送資料到 webhook 的函數
async function postToWebhook(data) {
  const webhookUrl =
    process.env.WEBHOOK_URL ||
    "http://localhost:5678/webhook-test/38872084-125c-4a5f-ab75-358d9941928e";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.text();
    return {
      statusCode: response.status,
      data: responseData,
    };
  } catch (error) {
    throw error;
  }
}

// 執行
main()
  .then((results) => {
    console.log("執行結果:", JSON.stringify(results, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error("執行失敗:", error);
    process.exit(1);
  });
