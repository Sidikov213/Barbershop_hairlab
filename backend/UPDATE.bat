@echo off
echo ========================================
echo   Updating dependencies for Python 3.13
echo ========================================
echo.

call venv\Scripts\activate.bat

echo Upgrading pip...
python -m pip install --upgrade pip

echo.
echo Updating SQLAlchemy (fixing Python 3.13 compatibility)...
pip install --upgrade sqlalchemy==2.0.36

echo.
echo Updating other packages...
pip install --upgrade fastapi==0.115.0
pip install --upgrade uvicorn==0.32.0
pip install --upgrade pydantic==2.10.3
pip install --upgrade python-multipart==0.0.12
pip install --upgrade python-dotenv==1.0.1
pip install --upgrade requests==2.32.3

echo.
echo ========================================
echo   Update Complete!
echo ========================================
echo.
echo Now run: START.bat
echo.
pause
