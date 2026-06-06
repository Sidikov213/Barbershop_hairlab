# Решение проблем с установкой

## Проблема: metadata-generation-failed

Эта ошибка возникает из-за пакетов, требующих компилятор C++.

## Решение 1: Автоматическая установка

Запустите скрипт:
```bash
INSTALL.bat
```

Этот скрипт:
1. Удалит старое виртуальное окружение
2. Создаст новое
3. Установит зависимости по одной

## Решение 2: Ручная установка (если Решение 1 не помогло)

### Шаг 1: Удалите старое окружение
```bash
rmdir /s /q venv
```

### Шаг 2: Создайте новое окружение
```bash
python -m venv venv
venv\Scripts\activate
```

### Шаг 3: Обновите pip
```bash
python -m pip install --upgrade pip
```

### Шаг 4: Установите основные пакеты
```bash
pip install fastapi uvicorn sqlalchemy pydantic python-multipart python-dotenv requests
```

### Шаг 5: Попробуйте установить криптографию (опционально)
```bash
pip install pycryptodome python-jose passlib
```

Если эта команда не работает - это нормально, переходите к Шагу 6.

### Шаг 6: Используйте упрощенную версию (если Шаг 5 не сработал)

Если `python-jose` не установился, переименуйте файлы:

```bash
# В папке backend:
move auth.py auth_jwt.py
move auth_simple.py auth.py
```

Это использует упрощенную систему токенов вместо JWT.

## Решение 3: Установка Microsoft Visual C++

Если хотите использовать полную версию с JWT:

1. Скачайте и установите: [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. При установке выберите "Desktop development with C++"
3. Перезапустите компьютер
4. Попробуйте снова: `pip install -r requirements.txt`

## Проверка установки

После успешной установки проверьте:

```bash
python -c "import fastapi; print('FastAPI OK')"
python -c "import sqlalchemy; print('SQLAlchemy OK')"
```

Если обе команды выводят "OK" - можно запускать:

```bash
python init_db.py
python main.py
```

## Минимальные требования

Для работы достаточно установить:
- fastapi
- uvicorn
- sqlalchemy
- pydantic
- python-multipart
- python-dotenv
- requests

Криптографические библиотеки (python-jose, passlib) нужны только для JWT токенов.
Если они не установлены - используйте auth_simple.py (см. Шаг 6).
