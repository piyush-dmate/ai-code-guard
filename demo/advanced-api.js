// Intentionally insecure API for AI Code Guard advanced test.
// DO NOT USE IN PRODUCTION.

const express = require("express");
const app = express();
app.use(express.json());

// Fake in-memory "DB"
const users = [
  { id: 1, username: "alice", role: "user" },
  { id: 2, username: "bob", role: "admin" }
];

// 1. SQL injection-style string concatenation (simulated)
app.get("/user", (req, res) => {
  const username = req.query.username;

  // Insecure: building query string directly from user input.
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  console.log("Executing query:", query);

  const user = users.find(u => u.username === username);
  res.json(user || {});
});

// 2. Insecure redirect based on user input
app.get("/redirect", (req, res) => {
  const next = req.query.next || "https://example.com";

  // Insecure: open redirect with no validation.
  res.redirect(next);
});

// 3. Missing auth check on admin-only action
app.post("/admin/delete-user", (req, res) => {
  const { id } = req.body;

  // Insecure: no authentication / authorization – anyone can call this.
  const index = users.findIndex(u => u.id === Number(id));
  if (index !== -1) {
    users.splice(index, 1);
    return res.json({ status: "deleted" });
  }

  return res.status(404).json({ error: "not found" });
});

// 4. Benign logging that should NOT be flagged
app.get("/health", (req, res) => {
  console.log("Health check OK");
  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("Advanced insecure API listening on 3000");
});
