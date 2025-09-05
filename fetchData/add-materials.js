const { chromium } = require("playwright");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");
const fs = require("fs");
const path = require("path");
const prompts = require("prompts");
require("dotenv").config();

async function addMaterialsFromCSV() {
  const launchOptions = {
    headless: false, // 本地執行可以使用非 headless 模式
  };

  const browser = await chromium.launch(launchOptions);

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  });

  const page = await context.newPage();

  try {
    // 前往登入頁面
    console.log("正在前往登入頁面...");
    await page.goto(
      process.env.ECOMMERCE_TEST_LOGIN_URL ||
        "https://e-commerce-test-site-iota.vercel.app"
    );

    // 填寫登入資訊
    console.log("填寫登入資訊...");
    await page.fill("#username", process.env.ECOMMERCE_USERNAME || "admin");
    await page.fill("#password", process.env.ECOMMERCE_PASSWORD || "1234");

    // 點擊登入
    await page.click('button[type="submit"]');

    // 等待驗證碼輸入欄位
    await page.waitForSelector("#verificationCode", { timeout: 5000 });

    // 填寫驗證碼
    await page.fill("#verificationCode", "0000");

    // 再次點擊登入
    await page.click('button[type="submit"]');

    // 等待登入完成
    await page.waitForLoadState("networkidle");
    console.log("登入成功！");

    // 讀取 CSV 檔案
    const csvPath =
      process.env.CSV_PATH || path.join(__dirname, "materials.csv");
    console.log(`正在讀取 CSV 檔案: ${csvPath}`);

    if (!fs.existsSync(csvPath)) {
      throw new Error(`找不到 CSV 檔案: ${csvPath}`);
    }

    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
    });

    console.log(`找到 ${records.length} 筆資料需要新增`);

    // 初始化處理狀態陣列
    const processResults = [];

    // 處理每一筆資料
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      console.log(`\n處理第 ${i + 1}/${records.length} 筆資料...`);
      
      // 如果記錄已有狀態且為已完成，則跳過
      if (record.狀態 === "已完成") {
        console.log(`✓ 料號 ${record.料號} 已經完成，跳過處理`);
        processResults.push(record);
        continue;
      }

      try {
        // 導航到料號管理頁面
        await page.click("text=料號管理");
        await page.waitForLoadState("networkidle");

        // 點擊新增料號按鈕
        await page.click("text=新增料號");

        // 等待表單出現
        await page.waitForSelector("form", { timeout: 5000 });

        // 填寫表單欄位
        console.log("填寫料號資訊...");

        // 料號
        if (record.料號) {
          await page.fill('input[name="partNumber"]', record.料號);
        }

        // 品名
        if (record.品名) {
          await page.fill('input[name="partName"]', record.品名);
        }

        // 申請人
        if (record.申請人) {
          await page.fill('input[name="applicant"]', record.申請人);
        }

        // 部門
        if (record.部門) {
          await page.fill('input[name="department"]', record.部門);
        }

        // 物料類別（下拉選單）
        if (record.物料類別) {
          await page.selectOption('select[name="category"]', record.物料類別);
        }

        // 規格
        if (record.規格) {
          await page.fill('textarea[name="specification"]', record.規格);
        }

        // 數量
        if (record.數量) {
          await page.fill('input[name="quantity"]', record.數量);
        }

        // 等待一下確保所有欄位都填寫完成
        await page.waitForTimeout(500);

        // 點擊取消或新增按鈕
        await page.click('button[type="submit"]');

        // 等待提交完成
        // await page.waitForLoadState("networkidle");

        console.log(`✓ 料號 ${record.料號} 新增成功`);

        // 稍微等待避免操作太快
        await page.waitForTimeout(1000);
        
        // 記錄成功狀態
        processResults.push({
          ...record,
          狀態: "已完成"
        });
      } catch (error) {
        console.error(`✗ 料號 ${record.料號} 新增失敗:`, error.message);
        
        // 記錄失敗狀態
        processResults.push({
          ...record,
          狀態: "未完成"
        });
        
        // 如果出錯，嘗試關閉彈窗或返回列表頁
        try {
          await page.click('button:has-text("取消")', { timeout: 2000 });
        } catch (e) {
          // 忽略關閉彈窗的錯誤
        }
      }
    }

    console.log("\n所有資料處理完成！");

    // 詢問是否更新 CSV
    const response = await prompts({
      type: "confirm",
      name: "updateCSV",
      message: "是否將表單進度回填到讀取的 CSV？",
      initial: true
    });

    if (response.updateCSV) {
      // 生成更新後的 CSV 內容
      const updatedCSV = stringify(processResults, {
        header: true,
        columns: Object.keys(processResults[0])
      });

      // 寫回檔案
      fs.writeFileSync(csvPath, updatedCSV, "utf-8");
      console.log("✓ CSV 檔案已更新！");
    }

    // 等待使用者查看結果
    console.log("瀏覽器將在 5 秒後關閉...");
    await page.waitForTimeout(5000);
  } catch (error) {
    console.error("執行失敗:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

// 主函數
async function main() {
  try {
    await addMaterialsFromCSV();
    console.log("程式執行完成");
    process.exit(0);
  } catch (error) {
    console.error("程式執行失敗:", error);
    process.exit(1);
  }
}

// 執行
main();
