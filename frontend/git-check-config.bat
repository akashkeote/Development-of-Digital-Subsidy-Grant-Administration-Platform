@echo off
cd /d "%~dp0"
echo name:
git config user.name || echo NO_NAME
echo email:
git config user.email || echo NO_EMAIL
