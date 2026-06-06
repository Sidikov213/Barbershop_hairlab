@echo off
chcp 65001 >nul
echo ========================================
echo Настройка Git и создание коммита
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Настройка имени пользователя...
git config user.name "Sidikov"
if errorlevel 1 (
    echo [ОШИБКА] Не удалось настроить имя
    pause
    exit /b 1
)
echo [OK] Имя настроено: Sidikov

echo.
echo [2/3] Настройка email...
git config user.email "sidikov@example.com"
if errorlevel 1 (
    echo [ОШИБКА] Не удалось настроить email
    pause
    exit /b 1
)
echo [OK] Email настроен: sidikov@example.com
echo.
echo [ПРИМЕЧАНИЕ] Вы можете изменить email позже командой:
echo   git config user.email "ваш-email@example.com"
echo.

echo [3/3] Создание коммита...
git commit -m "Initial commit"
if errorlevel 1 (
    echo [ОШИБКА] Не удалось создать коммит
    echo.
    echo Проверьте статус: git status
    pause
    exit /b 1
)
echo [OK] Коммит создан успешно!

echo.
echo ========================================
echo Готово! Репозиторий настроен.
echo ========================================
echo.
echo Следующие шаги для загрузки на GitHub:
echo.
echo 1. Создайте репозиторий на GitHub:
echo    https://github.com/new
echo.
echo 2. Выполните команды (замените URL на свой):
echo    git remote add origin https://github.com/ваш-username/название-репозитория.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo Или используйте GitHub Desktop для загрузки.
echo.
pause
