@echo off
title ShopFlow Frontend Orchestrator
echo =====================================================================
echo                  Starting ShopFlow Frontend
echo =====================================================================

echo Building and starting Frontend...
cd frontend
call npm.cmd run build
cd dist
python -m http.server 5173 --bind 0.0.0.0
