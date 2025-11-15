const core = require("@actions/core");
const github = require("@actions/github");

// Call OpenAI to review the diff
async function getAiReview(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a senior application security engineer reviewing code in a pull request. " +
            "Focus ONLY on security risks, insecure patterns, and missing safeguards. Be concise and practical."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${text}`);
  }

  const data = await response.json();
  const message = data.choices?.[0]?.message?.content;
  return message || "AI did not return any analysis.";
}

async function run() {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      core.setFailed("GITHUB_TOKEN is not set");
      return;
    }

    const octokit = github.getOctokit(token);
    const context = github.context;
    const pr = context.payload.pull_request;

    if (!pr) {
      console.log("Not a pull request event, exiting.");
      return;
    }

    const { owner, repo } = context.repo;
    const pull_number = pr.number;

    console.log(`AI Code Guard running on PR #${pull_number}`);

    // 1. Get files changed in this PR
    const files = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number,
      per_page: 100
    });

    if (!files.data || files.data.length === 0) {
      console.log("No files in this PR.");
      return;
    }

    // 2. Build a diff text for AI
    let diffText = "";
    for (const file of files.data) {
      if (!file.patch) continue;

      diffText += `\nFile: ${file.filename}\n`;
      diffText += "```diff\n";
      diffText += file.patch;
      diffText += "\n```\n";
    }

    if (!diffText) {
      console.log("No text diffs (maybe only binaries).");
      return;
    }

    const MAX_CHARS = 12000;
    if (diffText.length > MAX_CHARS) {
      diffText =
        diffText.slice(0, MAX_CHARS) +
        "\n\n[Diff truncated for length in AI review]\n";
    }

    const prompt =
      "Review the following code changes for SECURITY issues only.\n" +
      "- Provide a short title\n" +
      "- Explain why it is risky\n" +
      "- Suggest how to fix it\n\n" +
      "If there are no major issues, say that explicitly.\n\n" +
      "Here are the diffs:\n" +
      diffText;

    const aiAnalysis = await getAiReview(prompt);

    const commentBody =
      "🔐 **AI Code Guard Security Review**\n\n" +
      aiAnalysis +
      "\n\n---\n" +
      "_This is an AI-generated review. Verify findings before making changes._";

    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body: commentBody
    });

    console.log("AI Code Guard comment posted successfully.");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
