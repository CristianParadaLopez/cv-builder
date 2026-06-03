#!/usr/bin/env bash
set -o errexit

echo "==> Instalando dependencias..."
npm install

echo "==> Compilando TypeScript..."
npx tsc --noEmitOnError false

echo "==> Instalando Playwright..."
npx playwright install chromium

echo "==> Verificando dist/..."
ls -la dist/