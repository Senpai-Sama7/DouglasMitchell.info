#!/usr/bin/env bash
set -euo pipefail

# Deploy the static GitHub Pages variant (gh-pages/index.html) to the gh-pages branch.
# Requirements:
#   - git remote "origin" pointing to GitHub repo with Pages enabled.
#   - gh-pages branch (will be created if missing).
#   - working tree clean.

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "✖ Commit or stash your changes before running this script." >&2
  exit 1
fi

echo "▶ Removing old gh-pages worktree (if any)..."
rm -rf .git/worktrees/gh-pages-deploy 2>/dev/null || true

BRANCH="gh-pages"
WORKTREE_DIR=".gh-pages-deploy"

if ! git show-ref --verify --quiet refs/heads/${BRANCH} && ! git ls-remote --exit-code origin ${BRANCH} >/dev/null 2>&1; then
  echo "▶ Creating orphan ${BRANCH} branch"
  git worktree add -B ${BRANCH} ${WORKTREE_DIR}
  (cd ${WORKTREE_DIR} && rm -rf ./* .gitignore)
else
  echo "▶ Checking out existing ${BRANCH} branch"
  git worktree add ${WORKTREE_DIR} ${BRANCH}
fi

echo "▶ Syncing gh-pages/ -> ${WORKTREE_DIR}"
rsync -av --delete gh-pages/ ${WORKTREE_DIR}/

pushd ${WORKTREE_DIR} >/dev/null
  echo "▶ Committing updates"
  git add .
  if git diff --cached --quiet; then
    echo "No changes to commit."
  else
    git commit -m "Deploy GitHub Pages variant"
    echo "▶ Pushing to origin/${BRANCH}"
    git push origin ${BRANCH}
  fi
popd >/dev/null

# Cleanup
rm -rf ${WORKTREE_DIR}
rm -rf .git/worktrees/gh-pages-deploy 2>/dev/null || true

echo "✔ GitHub Pages deployment complete. Enable GitHub Pages for branch '${BRANCH}' if not already done."
