#!/bin/bash
# ============================================================
# Apply Recommended Branch Protection Rulesets (Configurable)
# For DesignXpress AI Template
# ============================================================

set -e

OWNER=${1:-"YOUR_ORG_OR_USERNAME"}
REPO=${2:-"YOUR_REPO_NAME"}
CONFIG_FILE=${3:-".github/rulesets/ruleset-config.json"}

if [ "$OWNER" = "YOUR_ORG_OR_USERNAME" ] || [ "$REPO" = "YOUR_REPO_NAME" ]; then
    echo "Usage: ./scripts/apply-branch-rulesets.sh <owner> <repo> [config-file]"
    exit 1
fi

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Config file not found: $CONFIG_FILE"
    exit 1
fi

echo "Loading ruleset config from $CONFIG_FILE..."

# Use jq to build the ruleset payload from config (requires jq)
if ! command -v jq &> /dev/null; then
    echo "jq is required but not installed. Please install jq to use configurable rulesets."
    exit 1
fi

CONFIG=$(cat "$CONFIG_FILE")

# Build rules array dynamically
RULES=$(jq -c '
[
  {type: "deletion"},
  {type: "non_fast_forward"},
  (if .required_approving_review_count > 0 then {
    type: "pull_request",
    parameters: {
      required_approving_review_count: .required_approving_review_count,
      dismiss_stale_reviews_on_push: .dismiss_stale_reviews_on_push,
      require_code_owner_review: .require_code_owner_review,
      require_last_push_approval: .require_last_push_approval,
      required_review_thread_resolution: .required_review_thread_resolution
    }
  } else empty end),
  (if (.required_status_checks | length) > 0 then {
    type: "required_status_checks",
    parameters: {
      required_status_checks: (.required_status_checks | map({context: ., integration_id: 15368})),
      strict_required_status_checks_policy: .strict_required_status_checks
    }
  } else empty end),
  (if .require_linear_history then {type: "required_linear_history"} else empty end),
  (if .require_signed_commits then {type: "required_signatures"} else empty end),
  (if (.required_workflows | length) > 0 then {
    type: "workflows",
    parameters: { workflows: .required_workflows }
  } else empty end)
]
' <<< "$CONFIG")

NAME=$(jq -r '.name' <<< "$CONFIG")
ENFORCEMENT=$(jq -r '.enforcement' <<< "$CONFIG")
TARGET=$(jq -r '.target_branches' <<< "$CONFIG")

PAYLOAD=$(jq -n \
  --arg name "$NAME" \
  --arg enforcement "$ENFORCEMENT" \
  --arg target "$TARGET" \
  --argjson rules "$RULES" \
  '{
    name: $name,
    target: "branch",
    enforcement: $enforcement,
    conditions: {
      ref_name: {
        include: [$target],
        exclude: []
      }
    },
    rules: $rules
  }')

echo "Applying ruleset '$NAME' to $OWNER/$REPO..."

if gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  "/repos/$OWNER/$REPO/rulesets" \
  --input - <<< "$PAYLOAD" > /dev/null 2>&1; then
    echo "✅ Ruleset created successfully!"
else
    echo "Ruleset may already exist. Trying to update..."
    RULESET_ID=$(gh api "/repos/$OWNER/$REPO/rulesets" --jq ".[] | select(.name == \"$NAME\") | .id" 2>/dev/null || echo "")

    if [ -n "$RULESET_ID" ]; then
        gh api \
          --method PUT \
          -H "Accept: application/vnd.github+json" \
          "/repos/$OWNER/$REPO/rulesets/$RULESET_ID" \
          --input - <<< "$PAYLOAD"
        echo "✅ Ruleset updated successfully!"
    else
        echo "❌ Failed to create or update ruleset."
        exit 1
    fi
fi

echo ""
echo "View it here: https://github.com/$OWNER/$REPO/settings/rules"
