#!/usr/bin/env bash
# Dump everything reviewers said on a PR.
#
# Text mode (default): human-readable PR header + discussion + reviews + inline comments.
# JSON mode (--json):  structured JSON with reviewThread IDs (for the fix-pr-comments skill).
#
# Usage:
#   .claude/scripts/pr-comments.sh                  # current branch, text
#   .claude/scripts/pr-comments.sh 1234             # PR 1234, text
#   .claude/scripts/pr-comments.sh some-branch      # PR for branch, text
#   .claude/scripts/pr-comments.sh --json           # current branch, JSON
#   .claude/scripts/pr-comments.sh --json 1234      # PR 1234, JSON

set -euo pipefail

PR_REF=""
JSON_MODE=0

for arg in "$@"; do
  case "$arg" in
    --json) JSON_MODE=1 ;;
    *) PR_REF="$arg" ;;
  esac
done

if [ -n "$PR_REF" ]; then
  PR_JSON=$(gh pr view "$PR_REF" --json number,title,state,url,headRefName,baseRefName,body,author)
else
  PR_JSON=$(gh pr view --json number,title,state,url,headRefName,baseRefName,body,author)
fi

PR_NUM=$(printf '%s' "$PR_JSON" | jq -r '.number')
REPO=$(gh repo view --json nameWithOwner -q '.nameWithOwner')
OWNER="${REPO%%/*}"
NAME="${REPO##*/}"

if [ "$JSON_MODE" -eq 1 ]; then
  gh api graphql -F owner="$OWNER" -F repo="$NAME" -F number="$PR_NUM" -f query='
    query($owner: String!, $repo: String!, $number: Int!) {
      repository(owner: $owner, name: $repo) {
        nameWithOwner
        pullRequest(number: $number) {
          number
          title
          state
          url
          reviewThreads(first: 100) {
            nodes {
              id
              isResolved
              isOutdated
              comments(first: 20) {
                nodes {
                  databaseId
                  author { login }
                  body
                  path
                  line
                  originalLine
                  diffHunk
                  createdAt
                }
              }
            }
          }
          comments(first: 100) {
            nodes {
              databaseId
              author { login }
              body
              createdAt
            }
          }
        }
      }
    }'
  exit 0
fi

echo "=== PR #${PR_NUM} (${REPO}) ==="
printf '%s' "$PR_JSON" | jq -r '
  "Title:  \(.title)
State:  \(.state)
Author: \(.author.login)
Branch: \(.headRefName) -> \(.baseRefName)
URL:    \(.url)

--- Body ---
\(.body // "(no body)")"
'

echo
echo "=== Discussion comments ==="
DISC=$(gh api "repos/${REPO}/issues/${PR_NUM}/comments" --paginate \
  --jq '.[] | "[\(.created_at)] \(.user.login):\n\(.body)\n---"')
echo "${DISC:-(none)}"

echo
echo "=== Reviews ==="
REVS=$(gh api "repos/${REPO}/pulls/${PR_NUM}/reviews" --paginate \
  --jq '.[] | "[\(.submitted_at // "pending")] \(.user.login) — \(.state):\n\(.body // "(no body)")\n---"')
echo "${REVS:-(none)}"

echo
echo "=== Inline code comments ==="
INLINE=$(gh api "repos/${REPO}/pulls/${PR_NUM}/comments" --paginate \
  --jq '.[] | "[\(.created_at)] \(.user.login) on \(.path):\(.line // .original_line // "?") @\(.commit_id[0:7]):\n\(.body)\n---"')
echo "${INLINE:-(none)}"
