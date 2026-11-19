#!/usr/bin/env bash
# Gera um .zip do projeto pronto para abrir no VS Code.
# Uso: bash scripts/pack.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

OUT="public/linkedin-profile-clone.zip"
mkdir -p public
rm -f "$OUT"

zip -r -q "$OUT" . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x ".git/*" \
  -x ".env" \
  -x "*.log" \
  -x "public/*.zip" \
  -x "tsconfig.tsbuildinfo" \
  -x ".DS_Store"

echo "Pacote criado: $ROOT/$OUT"
du -h "$OUT" | awk '{print "Tamanho: " $1}'
