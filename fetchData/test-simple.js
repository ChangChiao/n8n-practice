console.log("測試開始");
console.log(
  JSON.stringify({
    success: true,
    message: "Hello from script",
    timestamp: new Date().toISOString(),
  })
);
console.log("測試結束");
process.exit(0);
