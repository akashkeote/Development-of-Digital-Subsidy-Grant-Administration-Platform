@echo off
cd /d "%~dp0"
echo --- remote -v ---
git remote -v
echo --- branches ---
git branch -vv
echo --- ls-remote ---
git ls-remote https://github.com/AVHnandini/govsubsidy.git
