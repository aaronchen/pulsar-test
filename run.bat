@echo off

cd %~dp0

echo ### Install NPM Packages
call npm install >nul 2>&1

echo ### Install Playwright (Chormium)
call npx playwright install chromium >nul 2>&1

echo ### Install Playwright Dependencies (Chormium)
call npx playwright install-deps chromium >nul 2>&1

echo ### Enable CI
set CI=true

echo ### Start Playwright Test
npx playwright test tests\general\pilot.spec.ts >nul 2>&1

echo ### End