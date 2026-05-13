const http = require("http");

const PORT = 2000;

const conversionRates = {
  usd: 1500,
  eur: 1700,
  cny: 2000,
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && parsedUrl.pathname === "/convert") {
    const amount = parsedUrl.searchParams.get("amount");
    const currency = parsedUrl.searchParams.get("currency");

    // Validation
    if (!amount) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "Missing amount parameter" })
      );
    }

    if (!currency) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "Missing currency parameter" })
      );
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "Amount must be a valid number" })
      );
    }

    if (!conversionRates[currency]) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "Unsupported currency" })
      );
    }

    const convertedAmount =
      numericAmount * conversionRates[currency];

    const response = {
      input: {
        amount: numericAmount,
        currency,
      },
      convertedAmount,
      unit: "RWF",
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(response));
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route not found" }));
});

server.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
});