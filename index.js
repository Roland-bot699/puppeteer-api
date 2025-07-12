const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

app.get('/search', async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) return res.status(400).send('請提供 keyword');

  try {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(`https://www.sex100.co/search/?keyword=${encodeURIComponent(keyword)}`, {
      waitUntil: 'networkidle2'
    });

    const content = await page.content();
    await browser.close();

    res.send(content);
  } catch (e) {
    console.error('❌ Puppeteer 錯誤:', e);
    res.status(500).send('Puppeteer 錯誤');
  }
});

// 正確的 PORT 與監聽方式
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
});