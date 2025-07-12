// index.js
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/search', async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) return res.status(400).send('請提供 keyword');

  const url = `https://www.sex100.co/search/?keyword=${encodeURIComponent(
    keyword
  )}`;

  let browser;
  try {
    browser = await puppeteer.launch({
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
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // 等到真正列表元素出現再回傳，避免只拿到 loading 畫面
    await page.waitForSelector('.index_menu_row', { timeout: 30000 });

    const content = await page.content();
    res.send(content);
  } catch (err) {
    console.error('❌ Puppeteer error:', err);
    res.status(500).send('❌ 爬蟲失敗，請查看 Railway logs');
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
});

app.get('/', (req, res) => {
  res.send('✅ Puppeteer API is running on Railway');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});