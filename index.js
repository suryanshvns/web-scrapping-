const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

// URL of the webpage to scrape
const url = 'https://books.toscrape.com/';

// Function to scrape the webpage
async function scrapeWebsite() {
    try {
        // Fetch HTML of the webpage
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            }
        });
        const html = response.data;

        // Load HTML into cheerio
        const $ = cheerio.load(html);

        // Select elements to scrape
        const books = [];

        // Select each book element
        $('article.product_pod').each((index, element) => {
            // Extract data from each book
            const title = $(element).find('h3 a').attr('title');
            const price = $(element).find('p.price_color').text().trim();

            // Push data into books array
            books.push({ title, price });
        });

        return books;
    } catch (error) {
        console.error('Error while scraping the website:', error);
        return [];
    }
}

// Define route to serve scraped data
app.get('/', async (req, res) => {
    const books = await scrapeWebsite();
    res.json(books);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
