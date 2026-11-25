#!/usr/bin/env bash
input=$(cat)
# cegah loop: jika sudah diminta memeriksa ulang, izinkan berhenti
[ "$(echo "$input" | jq -r '.stop_hook_active')" = "true" ] && exit 0
# tanpa perubahan file, tidak perlu pemeriksaan
[ -z "$(git status --porcelain 2>/dev/null)" ] && exit 0

out=$(bash scripts/verify.sh 2>&1); code=$?
if [ "$code" -ne 0 ]; then
  { echo "verify.sh GAGAL. Perbaiki lalu ulangi:"; echo "$out" | grep -A5 '^FAIL'; } >&2
  exit 2
fi

# perubahan kecil dan tidak sensitif: cukup lolos verify
lines=$(git diff HEAD --numstat 2>/dev/null | awk '{s+=$1+$2} END{print s+0}')
sensitive=$(git status --porcelain | grep -Ei '(auth|login|session|password|upload|migration|policy|permission|middleware|payment|\.env|security)')
if [ "$lines" -le 20 ] && [ -z "$sensitive" ]; then exit 0; fi

echo "verify.sh lulus. Lakukan PASS 2 (butir Definition of Done non-mekanis) lalu laporkan sesuai AGENTS.md." >&2
exit 2
