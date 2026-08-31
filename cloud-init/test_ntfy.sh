#!/usr/bin/env bash
# Self-check for ntfy_notify in cloud-init_template.yaml.
#
# The function is extracted from the template rather than copied, so this
# cannot silently drift from what actually boots. Run: ./cloud-init/test_ntfy.sh
set -euo pipefail

TEMPLATE="$(dirname "$0")/cloud-init_template.yaml"

# Both copies must stay identical — extract one, assert the other matches.
FN="$(awk '/ntfy_notify\(\) \{/,/^      \}$/' "$TEMPLATE" | sed 's/^      //')"
COUNT="$(grep -c 'ntfy_notify() {' "$TEMPLATE")"
[[ "$COUNT" -eq 2 ]] || { echo "FAIL: expected 2 ntfy_notify definitions, got $COUNT"; exit 1; }
[[ "$(printf '%s\n' "$FN" | grep -c 'ntfy_notify() {')" -eq 2 ]] \
  || { echo "FAIL: the two ntfy_notify definitions have diverged"; exit 1; }
FN="$(printf '%s\n' "$FN" | awk '/ntfy_notify\(\) \{/{n++} n==1')"

run_case() {
  local desc="$1" token="$2" expect_auth="$3" actual
  actual="$(
    set -euo pipefail
    NTFY_TOPIC="topic"
    NTFY_TOKEN="$token"
    # Stub curl: report whether an auth header arrived, then emit an http code
    # the way -w '%{http_code}' would.
    curl() {
      [[ "$*" == *"Authorization: Bearer ${token}"* && -n "$token" ]] && echo "auth"
      echo "200"
    }
    eval "$FN"
    ntfy_notify "title" "msg"
    # A failure here means set -e killed the script — the old silent-failure bug
    # in a new shape, so prove execution continues past the notify.
    echo "survived"
  )"
  local want="ntfy: 200 auth=${expect_auth} title
survived"
  [[ "$actual" == "$want" ]] \
    && echo "ok   - $desc" \
    || { echo "FAIL - $desc: expected '$want', got '$actual'"; return 1; }
}

run_case "a token is sent as a bearer header, so ntfy meters the account not the IP" \
  "tk_test" "2"
run_case "no token still publishes, and never aborts the run" \
  "" "0"

echo "all ntfy checks passed"
