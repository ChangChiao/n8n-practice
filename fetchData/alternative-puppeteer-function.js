// 如果 n8n-nodes-puppeteer 無法使用，可以使用 HTTP Request 節點配合此函數

const { chromium } = require("playwright");

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
    await page.goto("https://e-commerce-test-site-iota.vercel.app/login");

    // 填寫登入資訊
    await page.fill("#username", "admin");
    await page.fill("#password", "1234");

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

  return results;
}

// 執行
return await main();
