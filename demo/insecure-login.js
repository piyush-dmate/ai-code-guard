// Super insecure demo code for AI Code Guard test.
// DO NOT USE IN PRODUCTION.

const express = require("express");
const app = express();

// Hard-coded API key and password (bad)
const INTERNAL_API_KEY = "sk_test_hard_coded_key_123";
const ADMIN_PASSWORD = "admin123";

// Very weak / fake authentication
app.get("/login", (req, res) => {
  const { user, password } = req.query;

  // Logs raw user input (bad)
  console.log("Login attempt:", user, password);

  if (password === ADMIN_PASSWORD) {
    // Sends sensitive data back in a cookie (bad)
    res.cookie("session", INTERNAL_API_KEY, { httpOnly: false });
    return res.send("Logged in as admin");
  }

  return res.send("Invalid credentials");
});

// No TLS / security headers / rate limiting
app.listen(8080, () => {
  console.log("Insecure demo server listening on 8080");
});
