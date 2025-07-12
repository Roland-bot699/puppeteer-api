const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/search', async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) return res.status(400).send('請提供 keyword');

  const url = `https://www.sex100.co/search/?keyword=${encodeURIComponent(keyword)}`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-zygote',
        '--disable-gpu',
        '--single-process'
      ]
    });

    const page = await browser.newPage();

    // 繞過年齡遮罩或 JS 阻擋：設定 User-Agent 和 Headers
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    );

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'zh-TW,zh;q=0.9'
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // 直接擷取 HTML 原始碼回傳
    const content = await page.content();
    await browser.close();

    res.status(200).send(content);
  } catch (err) {
    console.error('❌ Puppeteer error:', err);
    res.status(500).send('❌ 爬蟲失敗，請查看 Railway logs');
  }
});

app.get('/', (req, res) => {
  res.send('✅ Puppeteer API is running on Railway');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});