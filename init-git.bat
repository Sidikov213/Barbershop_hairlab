@echo off
echo ========================================
echo Инициализация Git репозитория
echo ========================================
echo.

REM Проверка установки Git
git --version >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Git не установлен!
    echo.
    echo Пожалуйста, установите Git с https://git-scm.com/download/win
    echo После установки перезапустите этот скрипт.
    pause
    exit /b 1
)

echo [OK] Git установлен
echo.

REM Проверка, не инициализирован ли уже репозиторий
if exist .git (
    echo [INFO] Репозиторий уже инициализирован
) else (
    echo [1/5] Инициализация репозитория...
    git init
    if errorlevel 1 (
        echo [ОШИБКА] Не удалось инициализировать репозиторий
        pause
        exit /b 1
    )
    echo [OK] Репозиторий инициализирован
)

echo.
echo [2/5] Добавление файлов...
git add .
if errorlevel 1 (
    echo [ОШИБКА] Не удалось добавить файлы
    pause
    exit /b 1
)
echo [OK] Файлы добавлены

echo.
echo [3/5] Создание первого коммита...
git commit -m "Initial commit"
if errorlevel 1 (
    echo [ПРЕДУПРЕЖДЕНИЕ] Коммит не создан. Возможно, нет изменений для коммита.
    echo Или Git не настроен (имя и email).
    echo.
    echo Настройте Git командой:
    echo   git config --global user.name "Ваше Имя"
    echo   git config --global user.email "your.email@example.com"
    pause
    exit /b 1
)
echo [OK] Коммит создан

echo.
echo [4/5] Переименование ветки в main...
git branch -M main
echo [OK] Ветка переименована

echo.
echo ========================================
echo [5/5] Готово! Репозиторий инициализирован.
echo ========================================
echo.
echo Следующие шаги:
echo 1. Создайте репозиторий на GitHub (https://github.com/new)
echo 2. Выполните команды:
echo    git remote add origin https://github.com/ваш-username/название-репозитория.git
echo    git push -u origin main
echo.
echo Или используйте GitHub Desktop для загрузки.
echo.
pause
