#!/usr/bin/env bash
# Builds a JSON map of {package: client_id} from each app's shopify.app.toml
# and stores it in the SHOPIFY_CLIENT_IDS GitHub Actions secret.
#
# Usage: ./setup-github-secrets.sh
# Requires: gh CLI authenticated against AdNabu-Team/shopify-apps with admin:repo_hook scope.

set -euo pipefail

PACKAGES=(
    "dev-test-app-kanna-fb-feed"
    "dev-test-app-kanna-fb-pixel"
    "dev-test-app-kanna-gcp"
    "dev-test-app-kanna-grp"
    "dev-test-app-kanna-gsf"
    "dev-test-app-kanna-rm"
    "dev-test-app-kanna-sitemap"
    "dev-test-app-kanna-tik-tok"
    "khyathi-sitemap"
)

extract_client_id() {
    local toml="$1"
    grep -m1 -E '^\s*client_id\s*=' "$toml" | awk -F'=' '{print $2}' | tr -d ' "'
}

json="{}"
for pkg in "${PACKAGES[@]}"; do
    toml="${pkg}/shopify.app.toml"
    if [ ! -f "$toml" ]; then
        echo "Missing $toml" >&2
        exit 1
    fi
    cid=$(extract_client_id "$toml")
    if [ -z "$cid" ]; then
        echo "client_id not found in $toml" >&2
        exit 1
    fi
    json=$(echo "$json" | jq --arg p "$pkg" --arg c "$cid" '. + {($p): $c}')
done

echo "Setting SHOPIFY_CLIENT_IDS with ${#PACKAGES[@]} entries..."
gh secret set SHOPIFY_CLIENT_IDS --body "$json"
# echo "$json" | jq
echo "Done."
