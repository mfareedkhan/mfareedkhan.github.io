#!/usr/bin/env bash
# Smoke-test the actual academic portfolio instead of the al-folio starter's
# demo-only blog fixtures, which are not part of this site.
set -euo pipefail
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT
bundle exec jekyll build -d "$tmp_dir/site" >/dev/null
site="$tmp_dir/site"
for page in index.html research/index.html publications/index.html projects/index.html cv/index.html contact/index.html; do
  if [ ! -f "$site/$page" ]; then
    echo "Missing required academic page: $page" >&2
    exit 1
  fi
done

grep -q "Research Highlights" "$site/index.html"
grep -q "CXRG-SVLM" "$site/research/index.html"
grep -q "Published" "$site/publications/index.html"
grep -q "s41598-026-77203-3" "$site/publications/index.html"
grep -q "Scientific Reports" "$site/publications/index.html"
grep -q "PLOS ONE" "$site/publications/index.html"
grep -q "Curriculum Vitae" "$site/cv/index.html"
grep -q "mfareedkhan012@gmail.com" "$site/contact/index.html"
grep -q "academic.css" "$site/index.html"
if grep -q "0.97%" "$site/research/index.html"; then
  echo "Deprecated parameter percentage remains in rendered research page" >&2
  exit 1
fi
python3 test/check_academic_links.py "$site"
echo "Academic portfolio smoke checks passed"
