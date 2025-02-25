const https = require("https");
const fs = require("fs");
const express = require("express");

const app = express();

// Load Order Service certificate
const options = {
  cert: fs.readFileSync("/etc/order-service/tls.crt"),
  key: fs.readFileSync("/etc/order-service/tls.key"),
  ca: fs.readFileSync("/etc/ca/ca.crt"), // Trust the Payment Service's cert
};

app.get('/', (req, res) => {
    res.send(`
      <h1>Hello from this NodeJS app!</h1>
      <h1>This is Application 1</h1>
      <p>Try sending a request to /order and see what happens</p>
    `);
});

app.get("/order", (req, res) => {
  const requestOptions = {
    hostname: "payment-service.prod.svc.cluster.local",
    port: 443,
    path: "/pay",
    method: "GET",
    cert: options.cert,
    key: options.key,
    ca: options.ca,
    rejectUnauthorized: true,
  };

  const request = https.request(requestOptions, (response) => {
    let data = "";
    response.on("data", (chunk) => (data += chunk));
    response.on("end", () => res.send(`Payment Response: ${data}`));
  });

  request.on("error", (error) => res.status(500).send(`Error: ${error.message}`));
  request.end();
});

app.listen(3000);