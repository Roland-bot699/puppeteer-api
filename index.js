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
    '--disable-blink-features=AutomationControlled'
  ],
});
const page = await browser.newPage();

await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

await page.goto(url, { waitUntil: 'domcontentloaded' }); 
await page.waitForSelector('.xincai_block ul li', { timeout: 10000 }); // 最多等10秒

const content = await page.content();
await browser.close();
res.send(content);

  } catch (err) {
    console.error(err);
    res.status(500).send('爬蟲錯誤');
  }
});

app.get('/', (req, res) => {
  res.send('Puppeteer API server is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});