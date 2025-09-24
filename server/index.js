const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

// Plaid Client Configuration
const plaidConfig = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});

const plaidClient = new PlaidApi(plaidConfig);

// In-memory storage for the access_token. In a real app, you'd store this in a database.
let ACCESS_TOKEN = null;

// --- API ROUTES ---

// Creates a link_token, which is required as a parameter when initializing Link.
app.post('/api/create_link_token', async (req, res) => {
    try {
        const createTokenRequest = {
            user: {
                // This needs to be a unique ID for each user. For a hackathon,
                // a static string is fine.
                client_user_id: 'user-id',
            },
            client_name: 'Cash Current',
            products: ['transactions'], // We want to be able to pull transaction data.
            country_codes: ['US'],
            language: 'en',
        };

        const createTokenResponse = await plaidClient.linkTokenCreate(createTokenRequest);
        res.json(createTokenResponse.data);
    } catch (error) {
        // Log the error to the console for debugging
        console.error("Error creating link token:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to create link token' });
    }
});

// Exchanges a public_token for an access_token.
app.post('/api/set_access_token', async (req, res) => {
    try {
        const { public_token } = req.body;
        if (!public_token) {
            return res.status(400).json({ error: 'Public token is required.' });
        }

        const tokenResponse = await plaidClient.itemPublicTokenExchange({
            public_token: public_token,
        });

        ACCESS_TOKEN = tokenResponse.data.access_token;

        console.log("Access Token stored successfully!");
        res.json({ message: "Access token set successfully." });
    } catch (error) {
        console.error("Error exchanging public token:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to exchange public token' });
    }
});

// Fetches transactions for a given user.
// Fetches transactions for a given user.
app.get('/api/transactions', async (req, res) => {
    if (!ACCESS_TOKEN) {
        return res.status(403).json({ error: "No access token found. Please link an account first." });
    }
    try {
        const response = await plaidClient.transactionsSync({
            access_token: ACCESS_TOKEN,
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching transactions:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});