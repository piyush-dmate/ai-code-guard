// Intentionally safe utilities for AI Code Guard to ignore.

function sanitizeUsername(input) {
  if (typeof input !== "string") return "";
  return input.trim().toLowerCase().replace(/[^a-z0-9_\-]/g, "");
}

function isStrongPassword(pw) {
  return typeof pw === "string" && pw.length >= 12;
}

module.exports = { sanitizeUsername, isStrongPassword };

