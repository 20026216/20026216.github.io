// server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();

const API_KEY = process.env.NINJA_API_KEY;

app.get('/crypto/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/cryptoprice?symbol=${symbol}`, {
            headers: {
                'X-Api-Key': API_KEY,
            },
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});
app.get('/crypto/symbols', async (req, res) => {
    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/cryptosymbols`, {
            headers: {
                'X-Api-Key': API_KEY,
            },
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching symbols' });
    }
});
app.get('/stock/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/stockprice?ticker=${symbol}`, {
            headers: {
                'X-Api-Key': API_KEY,
            },
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching stock data' });
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
