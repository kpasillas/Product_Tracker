#!/usr/bin/env bash
# Self-check for the self-destruct ID resolution in cloud-init_template.yaml.
#
# The shipped expression is extracted from the template rather than copied, so
# this cannot silently drift from what actually boots. Run: ./cloud-init/test_teardown.sh
set -euo pipefail

TEMPLATE="$(dirname "$0")/cloud-init_template.yaml"

SNIPPET="$(grep -E '^[[:space:]]+(METADATA_TOKEN|LINODE_ID)=' "$TEMPLATE" | sed 's/^[[:space:]]*//')"
[[ "$(printf '%s\n' "$SNIPPET" | wc -l)" -eq 2 ]] || {
  echo "FAIL: expected 2 lines of ID resolution, got: $SNIPPET"; exit 1; }

run_case() {
  local desc="$1" metadata="$2" expected="$3" actual
  actual="$(
    set -euo pipefail
    get_metadata_token() { echo "tok"; }
    # empty payload simulates curl -f failing on a non-2xx response
    get_instance_metadata() { [[ -n "$metadata" ]] && printf '%s' "$metadata"; }
    eval "$SNIPPET"
    printf '%s' "$LINODE_ID"
  )"
  [[ "$actual" == "$expected" ]] \
    && echo "ok   - $desc" \
    || { echo "FAIL - $desc: expected '$expected', got '$actual'"; return 1; }
}

run_case "real metadata yields this instance's numeric id" \
  '{"id":81234567,"label":"product-tracker-42","region":"us-lax"}' '81234567'
run_case "metadata unreachable yields empty, so it alerts instead of deleting" \
  '' ''
run_case "missing id yields empty, not the string 'null'" \
  '{"label":"product-tracker-42"}' ''

echo "all teardown checks passed"
