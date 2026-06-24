@echo off
color 0A
title Ngrok Live Tunnel
echo =======================================================
echo          STARTING NGROK PUBLIC TUNNEL
echo =======================================================
echo.
echo Your public API URL: https://violet-tactile-fructose.ngrok-free.dev
echo Pointing to local backend: http://localhost:8080
echo.
echo Make sure your Java Microservices (Docker) are running!
echo.
ngrok http --domain=violet-tactile-fructose.ngrok-free.dev 8080
pause
