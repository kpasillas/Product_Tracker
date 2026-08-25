#!/usr/bin/env bash
# Self-check for the setup probe in run_product_tracker.yml.
#
# The probe is extracted from the workflow rather than copied, so this cannot
# silently drift from what actually runs on the VM.
# Run: ./.github/workflows/test_setup_probe.sh
set -euo pipefail

WORKFLOW="$(dirname "$0")/run_product_tracker.yml"

# Everything between "probe='" and the closing "fi'".
PROBE="$(sed -n "/^ *probe='$/,/^ *fi'$/p" "$WORKFLOW" \
  | sed "1s/.*probe='//; \$s/fi'/fi/")"
[[ -n "$PROBE" ]] || { echo "FAIL: could not extract probe from $WORKFLOW"; exit 1; }

run_case() {
  local desc="$1" failed="$2" marker="$3" expected="$4" actual
  actual="$(
    set -euo pipefail
    # stub systemd + the marker check the VM would answer
    systemctl() { [[ "$failed" == "yes" ]]; }
    test() { [[ "$marker" == "yes" ]]; }
    eval "$PROBE"
  )"
  [[ "$actual" == "$expected" ]] \
    && echo "ok   - $desc" \
    || { echo "FAIL - $desc: expected '$expected', got '$actual'"; return 1; }
}

#                                            is-failed  marker  expect
run_case "crashed setup reports FAILED"           yes      no    FAILED
run_case "finished setup reports DONE"            no       yes   DONE
run_case "still-running setup reports WAIT"       no       no    WAIT
# A crash after the marker exists must still fail rather than pass silently.
run_case "failure wins over a stale marker"       yes      yes   FAILED

echo "all setup probe checks passed"
