@echo off
setlocal
echo ========================================================
echo        Launching Kisan Mandi Connect - Web App          
echo ========================================================

cd /d "%~dp0\web"

REM Launch default browser with index.html
start "" "index.html"

echo Web app launched in your default web browser!
echo Location: %cd%\index.html
pause
