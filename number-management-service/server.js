const express = require('express');
const axios = require('axios');

const app = express();
const timeout = 1000; // milliseconds

app.get('/numbers', async (req, res) => {
    // getting url param data.
    const { url } = req.query;

    // test case for checking the url has correct parameters.
    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    // written turnery operator to check the urls are multilple.
    const urls = Array.isArray(url) ? url : [url];

    // requested urls to get the data.
    const requests = urls.map(async (url) => {
        try {
            const response = await axios.get(url, { timeout });
            const { data } = response;
            if (Array.isArray(data)) {
                return data;
            }
        } catch (error) {
            // Request error or timeout, ignore the URL
        }
        return [];
    });

    // getting the data from the requested urls. 
    try {
        const results = await Promise.all(requests);
        const numbers = Array.from(new Set(results.flat()));
        numbers.sort((a, b) => a - b);
        return res.json({ numbers });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

const port = 8008;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
