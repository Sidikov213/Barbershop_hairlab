@echo off
echo ========================================
echo   Hair Lab Backend - Installation
echo ========================================
echo.

echo Removing old virtual environment...
if exist venv rmdir /s /q venv
timeout /t 2 /nobreak > nul

echo Creating new virtual environment...
python -m venv venv

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
