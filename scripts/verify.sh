#!/usr/bin/env bash
# Pemeriksaan mekanis tanpa model. Exit 0 = lulus, 1 = ada FAIL. Output: satu baris per pemeriksaan.
set -u
cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
fail=0
pass() { echo "PASS  $1"; }
bad()  { echo "FAIL  $1"; [ -n "${2:-}" ] && echo "$2" | head -n 5 | sed 's/^/      /'; fail=1; }

FILES=$( { git ls-files; git ls-files --others --exclude-standard; } 2>/dev/null | sort -u \
  | while IFS= read -r f; do [ -f "$f" ] && echo "$f"; done )
SRC=$(echo "$FILES" | grep -Ev '^(docs/|\.claude/|scratch/|node_modules/|vendor/)|(\.lock|-lock\.json|\.min\.(js|css)|\.md)$')

# 1. .env tidak ter-track / tidak ter-ignore
x=$(echo "$FILES" | grep -E '(^|/)\.env(\..+)?$' | grep -Ev '\.env\.example$')
[ -z "$x" ] && pass "env-tidak-ter-track" || bad "env-ter-track" "$x"

# 2. pola secret di file kode (heuristik; tidak menggantikan gitleaks)
pat="(AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|(api[_-]?key|secret|token|passwd|password)[A-Za-z_]*[[:space:]]*[:=][[:space:]]*[\"'][^\"' ]{8,}[\"'])"
x=$(echo "$SRC" | grep -Ev '\.env\.example$' | tr '\n' '\0' | xargs -0 -r grep -InEi "$pat" 2>/dev/null)
[ -z "$x" ] && pass "tanpa-pola-secret" || bad "pola-secret-ditemukan" "$x"

# 3. gitleaks (termasuk riwayat Git) jika terpasang
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks detect --no-banner -q >/dev/null 2>&1 && pass "gitleaks" || bad "gitleaks menemukan secret (rotate, bukan hanya hapus)"
else
  echo "SKIP  gitleaks belum terpasang (poin security 3-4 perlu dicek manual)"
fi

# 4. folder generik terlarang
x=$(echo "$FILES" | grep -E '(^|/)(utils|helpers|common|misc|temp)/')
[ -z "$x" ] && pass "tanpa-folder-generik" || bad "folder-generik-terlarang" "$x"

# 5. scratch/ tidak boleh ter-track
x=$(echo "$FILES" | grep -E '^scratch/' | grep -v '^scratch/README.md$')
[ -z "$x" ] && pass "scratch-tidak-ter-track" || bad "scratch-ter-track" "$x"

# 6. kode tidak mengimpor scratch/
x=$(echo "$SRC" | grep -Ev '^(Makefile|scripts/|\.gitignore$)' | tr '\n' '\0' | xargs -0 -r grep -In "scratch/" 2>/dev/null)
[ -z "$x" ] && pass "tanpa-import-scratch" || bad "import-dari-scratch" "$x"

# 7. ukuran file kode maksimal 300 baris
x=$(echo "$SRC" | grep -E '\.(php|js|jsx|ts|tsx|vue|py|rb|go|java|kt|rs|cs|swift|dart|css|scss)$' \
  | while IFS= read -r f; do n=$(wc -l < "$f"); [ "$n" -gt 300 ] && echo "$f: $n baris"; done)
[ -z "$x" ] && pass "ukuran-file" || bad "file-melebihi-300-baris" "$x"

# >>> STACK-CHECKS (diisi /init-app) >>>
if grep -q '^Mode: TEMPLATE' AGENTS.md 2>/dev/null; then
  echo "SKIP  stack-checks (Mode: TEMPLATE)"
else
  bad "stack-checks belum diisi: jalankan /init-app"   # /init-app mengganti baris ini
fi
# <<< STACK-CHECKS <<<

[ "$fail" -eq 0 ] && echo "VERIFY OK" || echo "VERIFY GAGAL"
exit "$fail"
