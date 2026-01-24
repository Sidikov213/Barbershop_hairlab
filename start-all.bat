@echo off
echo ========================================
echo   Hair Lab - Starting Full Stack App
echo ========================================
echo.

echo [1/2] Starting Backend (FastAPI)...
start "Hair Lab Backend" cmd /k "cd backend && python main.py"
timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend (Next.js)...
start "Hair Lab Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Servers are starting...
echo ========================================
echo.
echo Backend will be at:  http://localhost:8000
echo Frontend will be at: http://localhost:3000
echo API Docs at:         http://localhost:8000/docs
echo.
echo Press any key to exit (servers will continue running)
pause > nul
