const express = require('express');
const puppeteer = require('puppeteer');
const notifier = require('node-notifier');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Price check function
async function checkPrice(url, priceLimit) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load', timeout: 0 });
    const priceSelector = 'span.a-price-whole';
    await page.waitForSelector(priceSelector);
    let priceText = await page.$eval(priceSelector, el => el.innerText.replace(/[₹,]/g, ''));
    let price = parseFloat(priceText);
    await browser.close();
    
    if (price <= priceLimit) {
        notifier.notify({
            title: 'Amazon Price Alert!',
            message: `Price dropped to ₹${price}!`,
            wait: true
        });
    }
    return price;
}

// API endpoint
app.post('/check-price', async (req, res) => {
    try {
        const price = await checkPrice(req.body.url, req.body.priceLimit);
        res.json({ success: true, price });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});