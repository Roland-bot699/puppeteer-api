const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/scrape', async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) {
    return res.status(400).send('請提供 keyword');
  }

  const url = `https://www.sex100.co/search/?keyword=${encodeURIComponent(keyword)}`;

  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

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