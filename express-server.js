const express = require("express");

const app = express();
const PORT = 2000;

const conversionRates = {
  usd: 1500,
  eur: 1700,
  cny: 2000,
};

// Validation middleware
function validateConversion(req, res, next) {
  const { amount, currency } = req.query;

  if (!amount) {
    return res.status(400).json({
      error: "Missing amount parameter",
    });
  }

  if (!currency) {
    return res.status(400).json({
      error: "Missing currency parameter",
    });
  }

  const numericAmount = Number(amount);

  if (isNaN(numericAmount)) {
    return res.status(400).json({
      error: "Amount must be a valid number",
    });
  }

  if (!conversionRates[currency]) {
    return res.status(400).json({
      error: "Unsupported currency",
    });
  }

  // Save validated data
  req.numericAmount = numericAmount;

  next();
}

// Route
app.get("/convert", validateConversion, (req, res) => {
  const { currency } = req.query;

  const convertedAmount =
    req.numericAmount * conversionRates[currency];

  res.status(200).json({
    input: {
      amount: req.numericAmount,
      currency,
    },
    convertedAmount,
    unit: "RWF",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});