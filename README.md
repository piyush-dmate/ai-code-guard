**AI Code Guard**
Lightweight AI-Powered Security Reviews for GitHub Pull Requests

AI Code Guard is a simple, developer-friendly GitHub Action that automatically reviews pull requests for common security issues.
It analyzes only the PR diff and posts a clear, actionable security comment — just like a senior application security engineer.

No setup. No heavy scanners. No noise.

**🚀 Features**

🔐 Security-focused AI code review

No style comments. No nitpicks. Only real security findings.

🧠 Detects common vulnerability patterns

Hard-coded secrets

Insecure authentication / authorization

SQL injection-style patterns

XSS-prone cookie usage

Open redirect behavior

Sensitive data logging

Missing input validation

Unsafe error handling

Insecure headers / missing TLS

Basic API misuse patterns

And more…


**📦 Installation**

In your repository, create the file:

.github/workflows/ai-code-guard.yml


Add the following:

name: AI Code Guard

on:
  pull_request:

jobs:
  review:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Run AI Code Guard
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npm run review-pr


Add your repository secrets in GitHub:

OPENAI_API_KEY → from OpenAI dashboard

GITHUB_TOKEN → already provided by GitHub (no action needed)


🔧 Usage

Once the workflow is installed:

Every PR triggers an automated security review

Only the changed lines are analyzed

The bot posts a single clean comment with:

Title

Risks

File-specific findings

Fix suggestions

Nothing blocks merges unless you configure branch protection.

🛡 Example Output
🔐 AI Code Guard Security Review

1. Hard-coded Secrets
File: config.js
Risk: API key exposed in git history.
Fix: Move to environment variables or a secret manager.

2. Insecure Logging
File: login.js
Risk: Printing user passwords into logs.
Fix: Remove password field or mask it.

🧩 How It Works

GitHub Action extracts PR diffs

Sends changes (safely truncated) to the AI model

AI analyzes code for real-world security issues

A structured comment is posted to the PR

No infrastructure or backend needed

🎯 Why Use AI Code Guard?

Developer-first approach

No false positives from large scanners

No need for dedicated AppSec engineers

Extremely fast feedback

Real, contextual fix suggestions

Works with any language or framework

🤝 Contributing

Issues and pull requests are welcome!
Feel free to:

Suggest new vulnerability checks

Improve prompt logic

Add language-specific security patterns

📄 License

MIT License. Free to use and modify.
