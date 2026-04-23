#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# run-tier.sh — runs a tier of Heaptrace compliance skills,
# aggregates findings, and writes GitHub Actions outputs.
#
# Env vars (set by the composite action):
#   ANTHROPIC_API_KEY   — required
#   TIER                — tier number(s), e.g. "1" or "1,2"
#   SKILLS              — comma-separated skill names
#   ENVIRONMENT         — PR | staging | production
#   SEVERITY_CONFIG     — path to severity-matrix.json
#   HISTORY_DAYS        — git history depth for deep scans
#   INPUTS_DIR          — optional prior-tier reports dir
#
# Outputs (via $GITHUB_OUTPUT):
#   max-severity        — highest severity found
#   findings-count      — total findings across all skills
#   report-path         — markdown report path
#   blocked             — true if severity crosses threshold
# ─────────────────────────────────────────────────────────────
set -euo pipefail

REPORT_DIR="/tmp/security-tier-${TIER//,/_}-$(date +%s)"
REPORT_MD="${REPORT_DIR}/report.md"
FINDINGS_JSON="${REPORT_DIR}/findings.json"
mkdir -p "$REPORT_DIR"

echo "# Security Report — Tier ${TIER}" > "$REPORT_MD"
echo "" >> "$REPORT_MD"
echo "**Environment:** ${ENVIRONMENT}  " >> "$REPORT_MD"
echo "**Commit:** ${GITHUB_SHA:-unknown}  " >> "$REPORT_MD"
echo "**Date:** $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$REPORT_MD"
echo "" >> "$REPORT_MD"

TOTAL_FINDINGS=0
MAX_SEVERITY="NONE"
SEVERITY_ORDER="NONE INFO LOW MEDIUM HIGH CRITICAL"

# Convert severity name to numeric position for comparison
sev_rank() {
  local s=$1
  echo "$SEVERITY_ORDER" | tr ' ' '\n' | grep -n "^${s}$" | cut -d: -f1 | head -1
}

# Take the max of two severity names
sev_max() {
  local a=$1 b=$2
  ra=$(sev_rank "$a"); rb=$(sev_rank "$b")
  if [ "${ra:-0}" -ge "${rb:-0}" ]; then echo "$a"; else echo "$b"; fi
}

# ── Run each skill in sequence; each one is a Claude Code invocation ──
IFS=',' read -ra SKILL_ARRAY <<< "$SKILLS"
for SKILL in "${SKILL_ARRAY[@]}"; do
  SKILL="${SKILL// /}"  # trim
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "▶  Running skill: $SKILL"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  SKILL_OUT="${REPORT_DIR}/${SKILL}.json"
  SKILL_MD="${REPORT_DIR}/${SKILL}.md"

  # Invoke Claude Code with the skill. The skill file lives in the
  # Heaptrace Skills repo; the CLI resolves it by name if installed
  # locally, or you can pass the full path.
  PROMPT="Run the /${SKILL} skill against this repository.

Output format:
- Markdown summary at the top
- A JSON block at the end, fenced with \`\`\`json-findings
- The JSON must be an object: { \"findings\": [ { \"severity\": \"CRITICAL|HIGH|MEDIUM|LOW|INFO\", \"title\": \"...\", \"file\": \"...\", \"line\": N } ] }"

  if [ -n "${INPUTS_DIR:-}" ] && [ -d "${INPUTS_DIR}" ]; then
    PROMPT="${PROMPT}

Prior tier reports are available in ${INPUTS_DIR} — read them and aggregate."
  fi

  # Run with a per-skill timeout
  if ! timeout 600 claude -p "$PROMPT" --output-format text > "$SKILL_MD" 2>&1; then
    echo "⚠️  Skill ${SKILL} failed or timed out"
    echo "## ${SKILL} — ❌ FAILED" >> "$REPORT_MD"
    continue
  fi

  # Extract the JSON findings block
  awk '/```json-findings/{f=1;next}/```/{f=0}f' "$SKILL_MD" > "$SKILL_OUT" || echo '{"findings":[]}' > "$SKILL_OUT"
  [ ! -s "$SKILL_OUT" ] && echo '{"findings":[]}' > "$SKILL_OUT"

  # Count findings & find max severity
  if command -v jq > /dev/null 2>&1; then
    COUNT=$(jq '.findings | length' "$SKILL_OUT" 2>/dev/null || echo 0)
    SKILL_MAX=$(jq -r '[.findings[].severity] | max // "NONE"' "$SKILL_OUT" 2>/dev/null || echo "NONE")
  else
    COUNT=0
    SKILL_MAX="NONE"
  fi

  TOTAL_FINDINGS=$((TOTAL_FINDINGS + COUNT))
  MAX_SEVERITY=$(sev_max "$MAX_SEVERITY" "$SKILL_MAX")

  # Append to the unified report
  echo "" >> "$REPORT_MD"
  echo "## ${SKILL} — ${SKILL_MAX} (${COUNT} findings)" >> "$REPORT_MD"
  echo "" >> "$REPORT_MD"
  cat "$SKILL_MD" >> "$REPORT_MD"
done

# ── Apply severity threshold from severity-matrix.json ──
BLOCKED="false"
if [ -f "$SEVERITY_CONFIG" ] && command -v jq > /dev/null 2>&1; then
  POLICY=$(jq -r ".environments.${ENVIRONMENT}.${MAX_SEVERITY} // \"info\"" "$SEVERITY_CONFIG")
  [ "$POLICY" = "block" ] && BLOCKED="true"
fi

# ── Combine all findings into single JSON ──
if command -v jq > /dev/null 2>&1; then
  jq -s '{tier: "'"${TIER}"'", environment: "'"${ENVIRONMENT}"'", max_severity: "'"${MAX_SEVERITY}"'", total: '"${TOTAL_FINDINGS}"', blocked: '"${BLOCKED}"', skills: [.[] | .findings] | add // []}' \
    "${REPORT_DIR}"/*.json > "$FINDINGS_JSON" 2>/dev/null || echo '{}' > "$FINDINGS_JSON"
fi

# ── Emit GitHub Actions outputs ──
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Tier ${TIER} complete"
echo "  Max severity: ${MAX_SEVERITY}"
echo "  Total findings: ${TOTAL_FINDINGS}"
echo "  Blocked: ${BLOCKED}"
echo "  Report: ${REPORT_MD}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

{
  echo "max-severity=${MAX_SEVERITY}"
  echo "findings-count=${TOTAL_FINDINGS}"
  echo "report-path=${REPORT_MD}"
  echo "blocked=${BLOCKED}"
} >> "${GITHUB_OUTPUT:-/dev/null}"
