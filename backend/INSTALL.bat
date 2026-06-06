@echo off
echo ========================================
echo   Hair Lab Backend - Installation
echo ========================================
echo.

echo Stopping backend on port 8000 if running...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do taskkill /F /PID %%p >nul 2>&1
timeout /t 2 /nobreak > nul

echo Removing old virtual environment...
if exist venv rmdir /s /q venv
if exist venv (
    echo ERROR: Could not delete venv. Close all terminals with activated venv and stop python main.py
    pause
    exit /b 1
)

echo Creating new virtual environment (Python 3.13)...
py -3.13 -m venv venv
if errorlevel 1 (
    echo Python 3.13 not found. Install Python 3.11-3.13 from python.org
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Upgrading pip...
python -m pip install --upgrade pip

echo Installing dependencies (Python 3.13 compatible)...
pip install fastapi==0.115.0
pip install uvicorn==0.32.0
pip install sqlalchemy==2.0.36
pip install pydantic==2.10.3
pip install python-multipart==0.0.12
pip install python-dotenv==1.0.1
pip install requests==2.32.3

echo.
echo Trying to install crypto libraries...
pip install pycryptodome==3.21.0
pip install python-jose==3.3.0
pip install passlib==1.7.4

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: python init_db.py
echo 2. Run: python main.py
echo.
pause
