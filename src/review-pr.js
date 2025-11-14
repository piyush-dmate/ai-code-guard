const core = require("@actions/core");
const github = require("@actions/github");

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
      console.log("This is not a pull request event. Exiting.");
      return;
    }

    const { owner, repo } = context.repo;
    const pull_number = pr.number;

    console.log(`AI Code Guard running on PR #${pull_number}`);

    const commentBody =
      "🔒 AI Code Guard test comment\n\n" +
      "This is a dummy comment to confirm the GitHub Action is wired correctly.";

    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body: commentBody
    });

    console.log("Comment posted successfully.");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

