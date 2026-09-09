#!/usr/bin/env bash
# Baut die Seite und veroeffentlicht sie auf dem gh-pages-Branch von "origin".
#
# origin ist bewusst siato-website-v2. Das alte Repo siato-website liegt als
# Remote "frozen" daneben und darf nicht mehr beliefert werden: seine Live-URL
# haengt in der Naturspur-Praesentation.
set -euo pipefail

ZIEL="$(git remote get-url --push origin)"
case "$ZIEL" in
  *siato-website-v2*) ;;
  *) echo "Abbruch: origin zeigt nicht auf siato-website-v2, sondern auf $ZIEL"; exit 1 ;;
esac

npm run build

rm -rf .deploy
git worktree remove --force .deploy 2>/dev/null || true
git worktree add --detach .deploy
cd .deploy
git checkout --orphan gh-pages-tmp
git rm -rq --cached . 2>/dev/null || true
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R ../dist/. .
git add -A
git commit -qm "Updates"
git push -f origin HEAD:gh-pages
cd ..
git worktree remove --force .deploy

echo "Live in ein bis zwei Minuten: https://simongantner-netizen.github.io/siato-website-v2/"
