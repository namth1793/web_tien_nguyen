@echo off
chcp 65001 > nul
echo ========================================
echo   MANGA WEBSITE - STARTING SERVERS
echo ========================================
echo.
echo Backend : http://localhost:5030
echo Frontend: http://localhost:3030
echo.

start "Manga Backend" cmd /k "cd /d "%~dp0backend" && node server.js"
timeout /t 2 > nul
start "Manga Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo Both servers started!
echo Press any key to exit...
pause > nul
