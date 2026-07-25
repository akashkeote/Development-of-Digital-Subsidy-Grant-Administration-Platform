@echo off
cd /d "%~dp0"
echo --- remote -v ---
git remote -v
echo --- branch -vv ---
git branch -vv
echo --- show-ref ---
git show-ref
echo --- branch -r ---
git branch -r
echo --- ls-remote origin ---
git ls-remote origin
echo --- ls-tree main (local) ---
git ls-tree -r main --name-only
