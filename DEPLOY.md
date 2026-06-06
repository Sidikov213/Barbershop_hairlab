# Деплой Hair Lab через Docker

## Локальный запуск

```bash
cp .env.example .env
docker compose up -d --build
```

- Сайт: http://localhost:3000
- API: http://localhost:8000
- Swagger: http://localhost:8000/docs

Остановка:

```bash
docker compose down
```

## Тестовые данные в БД

```bash
docker compose exec backend python init_db.py
```

На вопрос об очистке ответьте `y` или `n`.

## Деплой на Beget VPS

```bash
ssh root@ВАШ_IP
apt update && apt install -y git docker.io docker-compose
systemctl enable --now docker

mkdir -p /var/www
cd /var/www
git clone https://github.com/Sidikov213/Barbershop_hairlab.git hairlab
cd hairlab
cp .env.example .env
```

Отредактируйте `.env`:

```env
SECRET_KEY=длинный-случайный-ключ
NEXT_PUBLIC_API_BASE_URL=https://api.ваш-домен.ru
CORS_ORIGINS=https://ваш-домен.ru,https://www.ваш-домен.ru
```

Запуск (на Ubuntu из apt — команда с дефисом):

```bash
docker-compose up -d --build
docker-compose exec backend python init_db.py
```

Если установлен Docker Compose v2 (`docker compose` без дефиса), используйте его вместо `docker-compose`.

Настройте nginx + certbot для `ваш-домен.ru` → `:3000` и `api.ваш-домен.ru` → `:8000`.

## Полезные команды

```bash
docker-compose logs -f
docker-compose ps
docker-compose restart
docker-compose up -d --build
```
