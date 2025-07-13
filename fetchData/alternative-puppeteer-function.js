// 如果 n8n-nodes-puppeteer 無法使用，可以使用 HTTP Request 節點配合此函數

const { chromium } = require("playwright");
require("dotenv").config();

async function scrapeEcommerce() {
  const browser = await chromium.launch({
    headless: false, // 設為 true 以在背景執行
  });

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  });

  const page = await context.newPage();

  try {
    // 前往登入頁面
    await page.goto(
      process.env.ECOMMERCE_TEST_LOGIN_URL ||
        "https://e-commerce-test-site-iota.vercel.app/login"
    );

    // 填寫登入資訊
    await page.fill("#username", process.env.ECOMMERCE_USERNAME || "admin");
    await page.fill("#password", process.env.ECOMMERCE_PASSWORD || "1234");

    // 點擊登入
    await page.click('button[type="submit"]');

    // 等待登入完成
    await page.waitForLoadState("networkidle");

    // 導航到報表頁面
    await page.click("text=報表");
    await page.waitForSelector("table.data-table");

    // 擷取數據
    const data = await page.evaluate(() => {
      const table = document.querySelector("table.data-table");
      const rows = table.querySelectorAll("tbody tr");
      const results = [];

      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length > 0) {
          results.push({
            date: cells[0]?.textContent?.trim(),
            metric1: cells[1]?.textContent?.trim(),
            metric2: cells[2]?.textContent?.trim(),
            metric3: cells[3]?.textContent?.trim(),
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
    // smartQuery: null,
    timestamp: new Date().toISOString(),
  };

  // try {
  //   results.smartQuery = await scrapeSmartQuery();
  // } catch (error) {
  //   console.error("Smart Query 錯誤:", error);
  //   results.smartQuery = { error: error.message };
  // }

  try {
    results.ecommerce = await scrapeEcommerce();
  } catch (error) {
    console.error("電商平台錯誤:", error);
    results.ecommerce = { error: error.message };
  }

  // 發送資料到 webhook
  try {
    await postToWebhook(results);
    console.log("資料已成功發送到 webhook");
  } catch (error) {
    console.error("發送到 webhook 失敗:", error);
  }

  return results;
}

// 發送資料到 webhook 的函數
async function postToWebhook(data) {
  const webhookUrl =
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
