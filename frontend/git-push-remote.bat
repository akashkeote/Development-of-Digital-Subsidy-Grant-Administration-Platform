@echo off
cd /d "%~dp0"
git remote remove origin 2>nul || echo
git remote add origin https://github.com/AVHnandini/govsubsidy.git

REM Set local git identity (provided by user)
git config user.name "nandini"
git config user.email "nandiniajay193@gmail.com"

git rev-parse --verify HEAD >nul 2>&1 || (
	git add -A
	git commit -m "Initial commit"
)

git branch -M main
git push -u origin main
