@echo off
set "PATH=%PATH%;C:\Users\Matthew\.tools\mingit\cmd"
cd /d "%~dp0"
echo ===================================================
echo   Pushing Friendly Feud to GitHub:
echo   https://github.com/matthewchongg/friendly-feud.git
echo ===================================================
echo.
git push -u origin main
echo.
pause
