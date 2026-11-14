/**
 * deploy-pages.js — Deploy dist/ to gh-pages branch via GitHub Git Data API.
 * No workflow scope needed. Reads token from gh CLI.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const OWNER = "0xshalah";
const REPO = "chiasma-hybrid-ai";
const BRANCH = "gh-pages";
const DIST = path.join(__dirname, "packages/web-sandbox/dist");

const token = execSync("gh auth token", { encoding: "utf8" }).trim();
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "Content-Type": "application/json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "chiasma-deploy",
};

async function api(method, endpoint, body) {
  const res = await fetch(`https://api.github.com${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${endpoint}: ${text.slice(0, 200)}`);
  return JSON.parse(text);
}

function collectFiles(dir, base = "") {
  const result = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if (fs.statSync(full).isDirectory()) {
      result.push(...collectFiles(full, rel));
    } else {
      result.push({ rel, full });
    }
  }
  return result;
}

async function main() {
  const files = collectFiles(DIST);
  // Always add .nojekyll
  files.push({ rel: ".nojekyll", full: null });

  console.log(`Deploying ${files.length} files...`);

  // 1. Create blobs
  const blobs = [];
  for (const file of files) {
    let content, encoding;
    if (file.full === null) {
      content = "";
      encoding = "utf-8";
    } else {
      const buf = fs.readFileSync(file.full);
      content = buf.toString("base64");
      encoding = "base64";
    }
    process.stdout.write(`  blob: ${file.rel} ... `);
    const blob = await api("POST", `/repos/${OWNER}/${REPO}/git/blobs`, {
      content,
      encoding,
    });
    blobs.push({ path: file.rel, mode: "100644", type: "blob", sha: blob.sha });
    console.log("ok");
  }

  // 2. Create tree
  console.log("Creating tree...");
  const tree = await api("POST", `/repos/${OWNER}/${REPO}/git/trees`, {
    tree: blobs,
    base_tree: null, // fresh tree, no parent
  });

  // 3. Get parent commit (tip of gh-pages or main)
  let parentSha;
  try {
    const ref = await api("GET", `/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`);
    parentSha = ref.object.sha;
    console.log("Parent commit (gh-pages):", parentSha.slice(0, 8));
  } catch {
    // gh-pages doesn't exist, use main
    const ref = await api("GET", `/repos/${OWNER}/${REPO}/git/ref/heads/main`);
    parentSha = ref.object.sha;
    console.log("Parent commit (main):", parentSha.slice(0, 8));
  }

  // 4. Create commit
  console.log("Creating commit...");
  const commit = await api("POST", `/repos/${OWNER}/${REPO}/git/commits`, {
    message: "deploy: Awwwards upgrade — Three.js WebGL hero, SplitText, Lenis, magnetic CTA, custom cursor",
    tree: tree.sha,
    parents: [parentSha],
  });
  console.log("Commit:", commit.sha.slice(0, 8));

  // 5. Update or create branch ref
  try {
    await api("PATCH", `/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, {
      sha: commit.sha,
      force: true,
    });
    console.log("Updated gh-pages branch.");
  } catch {
    await api("POST", `/repos/${OWNER}/${REPO}/git/refs`, {
      ref: `refs/heads/${BRANCH}`,
      sha: commit.sha,
    });
    console.log("Created gh-pages branch.");
  }

  console.log("\nDone! GitHub Pages will rebuild in ~60s.");
  console.log("URL: https://0xshalah.github.io/chiasma-hybrid-ai/");
}

main().catch((e) => { console.error(e.message); process.exit(1); });
