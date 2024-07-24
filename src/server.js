const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors'); // Import the cors package
const app = express();
const port = 5001; // Make sure the port matches your backend port

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Route for arithmetic calculations
app.post('/calculate', (req, res) => {
  const { expression } = req.body;

  try {
    // Use eval cautiously, this is just for demo purposes
    const result = eval(expression);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: 'Invalid expression' });
  }
});

// Route for currency conversion
app.post('/convert', async (req, res) => {
  const { amount, fromCurrency, toCurrency } = req.body;

  if (!amount || !fromCurrency || !toCurrency) {
    return res
      .status(400)
      .json({ error: 'Amount, fromCurrency, and toCurrency are required' });
  }

  try {
    // Fetch exchange rates from ExchangeRate-API
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );

    const rate = response.data.rates[toCurrency];
    if (rate) {
      const result = (amount * rate).toFixed(2);
      res.json({ result });
    } else {
      res.status(400).json({ error: 'Invalid currency code' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching conversion rate' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
