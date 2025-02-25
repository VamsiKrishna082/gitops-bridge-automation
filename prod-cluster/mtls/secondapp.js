const https = require("https");
const fs = require("fs");
const express = require("express");

const app = express();

// Load Payment Service certificate
const options = {
  cert: fs.readFileSync("/etc/payment-service/tls.crt"),
  key: fs.readFileSync("/etc/payment-service/tls.key"),
  ca: fs.readFileSync("/etc/ca/ca.crt"), // Trust the Order Service's cert
  requestCert: true, // Require client cert
  rejectUnauthorized: true, // Reject unauthenticated clients
};

app.get("/pay", (req, res) => {
  if (!req.socket.authorized) {
    return res.status(401).send("Unauthorized");
  }
  res.send("Payment Processed!");
});

// Start HTTPS Server
https.createServer(options, app).listen(4000, () => {
  console.log("Payment Service running on port 4000");
});
