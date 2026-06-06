# Hair Lab Backend API

Backend API на FastAPI для системы бронирования барбершопа Hair Lab.

## Возможности

- ✅ Авторизация по номеру телефона и коду (код: 1111)
- ✅ JWT токены для безопасности
- ✅ Создание и управление бронированиями
- ✅ Проверка доступности времени
- ✅ SQLite база данных
- ✅ Автоматическое создание пользователей при первом входе
- ✅ Защита от двойного бронирования одного времени

## Установка

### 1. Установите Python 3.8+

Убедитесь, что у вас установлен Python версии 3.8 или выше.

### 2. Создайте виртуальное окружение (рекомендуется)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Установите зависимости

```bash
pip install -r requirements.txt
```

## Запуск

### Запуск сервера разработки

```bash
python main.py
```

Или используя uvicorn напрямую:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API будет доступен по адресу: `http://localhost:8000`

### Документация API

После запуска сервера документация доступна по адресам:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Авторизация

#### POST `/api/auth/login`
Вход пользователя по номеру телефона и коду.

**Request:**
```json
{
  "phone": "+79991234567",
  "code": "1111"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### GET `/api/auth/me`
Получение информации о текущем пользователе (требуется авторизация).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "id": 1,
  "phone": "+79991234567",
  "name": "Иван",
  "created_at": "2024-01-20T12:00:00",
  "is_active": true
}
```

#### PUT `/api/auth/me`
Обновление информации о пользователе (требуется авторизация).

**Request:**
```json
{
  "phone": "+79991234567",
  "name": "Иван Иванов"
}
```

### Бронирования

#### POST `/api/bookings`
Создание нового бронирования (требуется авторизация).

**Request:**
```json
{
  "service": "Мужская стрижка",
  "date": "2026-01-21",
  "time": "12:00",
  "comment": "Дополнительная информация"
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "service": "Мужская стрижка",
  "date": "2026-01-21",
  "time": "12:00",
  "comment": "Дополнительная информация",
  "status": "confirmed",
  "created_at": "2024-01-20T12:00:00"
}
```

#### GET `/api/bookings/my`
Получение всех бронирований текущего пользователя (требуется авторизация).

#### GET `/api/bookings/{booking_id}`
Получение информации о конкретном бронировании (требуется авторизация).

#### DELETE `/api/bookings/{booking_id}`
Отмена бронирования (требуется авторизация).

#### POST `/api/bookings/check-availability`
Проверка доступности временного слота.

**Request:**
```json
{
  "date": "2026-01-21",
  "time": "12:00"
}
```

**Response:**
```json
{
  "available": false,
  "message": "Время 12:00 на дату 2026-01-21 уже занято"
}
```

### Администрирование

#### GET `/api/admin/bookings`
Получение всех бронирований (для администратора).

## База данных

Проект использует SQLite. База данных автоматически создаётся при первом запуске в файле `hairlab.db`.

### Структура таблиц

**users:**
- id (Integer, Primary Key)
- phone (String, Unique)
- name (String, Nullable)
- created_at (DateTime)
- is_active (Boolean)

**bookings:**
- id (Integer, Primary Key)
- user_id (Integer, Foreign Key -> users.id)
- service (String)
- date (String, YYYY-MM-DD)
- time (String, HH:MM)
- comment (String, Nullable)
- created_at (DateTime)
- status (String: confirmed/cancelled/completed)

## Безопасность

- JWT токены для авторизации
- Код верификации: `1111` (одинаковый для всех пользователей)
- Токены действительны 30 минут
- CORS настроен для localhost:3000 и localhost:3001

## Настройка

Создайте файл `.env` в папке backend:

```
DATABASE_URL=sqlite:///./hairlab.db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Технологии

- **FastAPI** - современный веб-фреймворк
- **SQLAlchemy** - ORM для работы с БД
- **Pydantic** - валидация данных
- **python-jose** - JWT токены
- **SQLite** - база данных
- **Uvicorn** - ASGI сервер
