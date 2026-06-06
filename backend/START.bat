@echo off
echo ========================================
echo   Hair Lab Backend - Starting...
echo ========================================
echo.

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Initializing database...
python init_db.py

echo.
echo ========================================
echo   Starting API Server...
echo ========================================
echo.
echo Backend API: http://localhost:8000
echo API Docs:    http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python main.py
