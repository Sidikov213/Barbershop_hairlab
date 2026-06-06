# Hair Lab — система онлайн-бронирования барбершопа

Fullstack-проект для барбершопа: клиентский сайт, авторизация, онлайн-запись, проверка доступности времени и административная часть.

Проект сделан как pet/portfolio-проект, чтобы показать связку **Next.js + FastAPI**, работу с REST API, базой данных, авторизацией и разделением frontend/backend.

---

## Стек

### Frontend
- Next.js
- React
- TypeScript
- CSS Modules
- Context API
- Адаптивная вёрстка

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT авторизация
- SQLite
- Uvicorn

---

## Что реализовано

### Для клиента
- просмотр сайта барбершопа;
- авторизация по номеру телефона и коду;
- онлайн-бронирование услуги;
- проверка свободного времени;
- просмотр своих записей;
- отмена бронирования;
- адаптивный интерфейс для телефона и компьютера.

### Для администратора
- просмотр всех бронирований;
- управление пользователями;
- управление проектами/портфолио;
- разделение пользователей по ролям.

### Backend-логика
- REST API;
- JWT-токены;
- проверка занятости времени;
- валидация входных данных;
- работа с базой через ORM;
- автоматическая документация API через Swagger.

---

## Быстрый запуск

### 1. Клонировать проект

```bash
git clone https://github.com/Sidikov213/Barbershop_hairlab.git
cd Barbershop_hairlab
```

### 2. Запустить backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
# source venv/bin/activate

pip install -r requirements.txt
python init_db.py
python main.py
```

Backend будет доступен по адресу:

```text
http://localhost:8000
```

Swagger UI:

```text
http://localhost:8000/docs
```

### 3. Запустить frontend

В новом терминале из корня проекта:

```bash
npm install
npm run dev
```

Frontend будет доступен по адресу:

```text
http://localhost:3000
```

---

## Переменные окружения

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Backend `.env`

```env
DATABASE_URL=sqlite:///./hairlab.db
SECRET_KEY=change-this-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## Структура проекта

```text
Barbershop_hairlab/
├── backend/                 # FastAPI backend
│   ├── main.py              # Точка входа API
│   ├── models.py            # SQLAlchemy модели
│   ├── schemas.py           # Pydantic схемы
│   ├── database.py          # Подключение к БД
│   ├── auth.py              # JWT и авторизация
│   ├── config.py            # Конфигурация
│   ├── init_db.py           # Инициализация БД
│   └── requirements.txt
│
├── src/                     # Next.js frontend
│   ├── app/                 # Страницы приложения
│   ├── components/          # UI-компоненты
│   ├── contexts/            # React Context
│   ├── lib/                 # API-клиент и утилиты
│   └── styles/              # Стили
│
├── public/                  # Статические файлы
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## Основные API endpoints

### Авторизация

| Метод | URL | Описание |
|---|---|---|
| `POST` | `/api/auth/login` | Вход по телефону и коду |
| `GET` | `/api/auth/me` | Данные текущего пользователя |
| `PUT` | `/api/auth/me` | Обновление профиля |

### Бронирования

| Метод | URL | Описание |
|---|---|---|
| `POST` | `/api/bookings` | Создать бронирование |
| `GET` | `/api/bookings/my` | Получить свои бронирования |
| `GET` | `/api/bookings/{id}` | Получить бронирование по ID |
| `DELETE` | `/api/bookings/{id}` | Отменить бронирование |
| `POST` | `/api/bookings/check-availability` | Проверить свободное время |

### Админ-панель

| Метод | URL | Описание |
|---|---|---|
| `GET` | `/api/admin/bookings` | Все бронирования |
| `GET` | `/api/admin/users` | Пользователи |
| `GET` | `/api/admin/projects` | Проекты/портфолио |

---

## Тестовые данные

После запуска `python init_db.py` создаётся локальная SQLite-база с тестовыми данными.

Для входа в демо-режиме используется код:

```text
1111
```

---

## Что можно улучшить дальше

- заменить SQLite на PostgreSQL для production;
- добавить Alembic-миграции;
- добавить полноценные unit/integration tests;
- добавить Docker Compose для frontend + backend;
- вынести CORS и секреты в `.env.example`;
- добавить CI через GitHub Actions;
- улучшить обработку ошибок и логирование.

---

## Автор

Sidikov Sodirkhon  
GitHub: [@Sidikov213](https://github.com/Sidikov213)

Проект создан для практики fullstack-разработки и демонстрации навыков в портфолио.
