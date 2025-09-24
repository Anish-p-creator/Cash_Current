const puppeteer = require('puppeteer');

// A mapping of bank names to their login URLs and HTML selectors.
// You would expand this for each bank you want to support.
const BANK_CONFIG = {
    'default_mock_bank': {
        loginUrl: 'https://example-bank.com/login', // Replace with the actual login URL
        selectors: {
            usernameInput: '#username',
            passwordInput: '#password',
            loginButton: '#login-button',
            // Selector to confirm successful login (e.g., a dashboard element)
            loginSuccessElement: '#account-dashboard',
            // Selectors for the transaction data
            transactionTable: '#transaction-history',
            transactionRow: '.transaction-row', // Selector for each <tr>
            dateCell: '.transaction-date',       // Selector for the date <td>
            descriptionCell: '.transaction-description', // Selector for the description <td>
            amountCell: '.transaction-amount'     // Selector for the amount <td>
        }
    }
};

/**
 * Scrapes account and transaction data from a bank's website.
 * @param {string} username - The user's bank login username.
 * @param {string} password - The user's bank login password.
 * @param {string} bankName - The name of the bank to scrape.
 * @returns {Promise<Object>} - A promise that resolves to { accounts, transactions }.
 */
async function scrapeBankData(username, password, bankName = 'default_mock_bank') {
    const config = BANK_CONFIG[bankName];
    if (!config) {
        throw new Error(`Configuration for bank "${bankName}" not found.`);
    }

    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({
            headless: true, // Set to false to watch the browser in action
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.goto(config.loginUrl, { waitUntil: 'networkidle2' });
        console.log(`Mapsd to ${config.loginUrl}`);

        // --- Login Process ---
        console.log('Typing credentials...');
        await page.type(config.selectors.usernameInput, username);
        await page.type(config.selectors.passwordInput, password);
        await page.click(config.selectors.loginButton);
        console.log('Clicked login button.');

        // Wait for the main dashboard/account page to load after login
        await page.waitForSelector(config.selectors.loginSuccessElement, { timeout: 15000 });
        console.log('Login successful. Now scraping data...');

        // --- Data Extraction ---
        // This function runs in the browser's context
        const scrapedData = await page.evaluate((selectors) => {
            const transactions = [];
            const transactionRows = document.querySelectorAll(selectors.transactionRow);

            transactionRows.forEach(row => {
                const dateEl = row.querySelector(selectors.dateCell);
                const descriptionEl = row.querySelector(selectors.descriptionCell);
                const amountEl = row.querySelector(selectors.amountCell);

                if (dateEl && descriptionEl && amountEl) {
                    // Clean and parse the text content
                    const amountText = amountEl.innerText.replace('$', '').replace(',', '').trim();
                    const amount = parseFloat(amountText);

                    transactions.push({
                        date: dateEl.innerText.trim(),
                        description: descriptionEl.innerText.trim(),
                        amount: amount,
                        // Simple categorization logic for the demo
                        category: descriptionEl.innerText.toLowerCase().includes('uber') ? 'Transportation' : 'Shopping'
                    });
                }
            });

            // You would also scrape account balances here
            const accountInfo = {
                accountName: 'Primary Checking',
                balance: 2455.29, // Scrape this from the page
                accountNumber: '...1234'
            };

            return {
                accounts: [accountInfo],
                transactions: transactions
            };
        }, config.selectors); // Pass selectors into the evaluate function

        console.log(`Scraped ${scrapedData.transactions.length} transactions.`);
        return scrapedData;

    } catch (error) {
        console.error("Scraping failed:", error);
        // Take a screenshot on error for debugging
        if (page) await page.screenshot({ path: 'error_screenshot.png' });
        throw new Error('Could not log in or scrape data. The bank website may have changed or credentials may be incorrect.');
    } finally {
        if (browser) {
            await browser.close();
            console.log('Browser closed.');
        }
    }
}

module.exports = { scrapeBankData };
