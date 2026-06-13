@echo off
title ShopFlow Public Shareable Link
echo =====================================================================
echo                Starting ShopFlow Public Shareable Link
echo =====================================================================

:: Ensure any old proxy server on port 5173 is terminated
echo Stopping any existing servers on port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo 1. Rebuilding frontend assets...
cd /d "%~dp0\frontend"
call npm.cmd run build
cd /d "%~dp0"

echo.
echo 2. Launching Proxy Server (Port 5173) in the background...
start /B node proxy-server.js

echo.
echo 3. Starting Secure SSH Tunnel...
echo =====================================================================
echo Your public shareable URL will appear below.
echo Press Ctrl+C or close this window to stop sharing.
echo =====================================================================
echo.
ssh -o StrictHostKeyChecking=no -R 80:127.0.0.1:5173 nokey@localhost.run
