# Привязка домена к Hair Lab (Beget VPS)

Пример: **hairlab.ru** (сайт) + **api.hairlab.ru** (API).  
VPS: `85.198.70.246`

## Шаг 1 — DNS в панели Beget

Зайдите в [панель Beget](https://cp.beget.com) → **Домены** → ваш домен → **DNS-записи**.

Добавьте A-записи (если их ещё нет):

| Тип | Имя | Значение        | TTL  |
|-----|-----|-----------------|------|
| A   | @   | 85.198.70.246   | 300  |
| A   | www | 85.198.70.246   | 300  |
| A   | api | 85.198.70.246   | 300  |

Удалите или отключите старые A/CNAME, которые ведут на хостинг Beget (не на VPS), иначе домен не попадёт на сервер.

Проверка (через 5–30 минут):

```bash
ping hairlab.ru
ping api.hairlab.ru
```

Оба должны отвечать с IP `85.198.70.246`.

---

## Шаг 2 — nginx на VPS

```bash
ssh root@85.198.70.246

apt update
apt install -y nginx certbot python3-certbot-nginx

cd /var/www/hairlab
git pull   # если конфиги ещё не на сервере — скопируйте вручную из deploy/nginx/
```

Скопируйте конфиги (замените `hairlab.ru` на свой домен в файлах, если другой):

```bash
cp deploy/nginx/hairlab.conf /etc/nginx/sites-available/hairlab
cp deploy/nginx/hairlab-api.conf /etc/nginx/sites-available/hairlab-api

# Замените домен, если не hairlab.ru:
# sed -i 's/hairlab.ru/ваш-домен.ru/g' /etc/nginx/sites-available/hairlab*
```

Включите сайты:

```bash
ln -sf /etc/nginx/sites-available/hairlab /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/hairlab-api /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx
```

---

## Шаг 3 — SSL (HTTPS)

```bash
certbot --nginx -d hairlab.ru -d www.hairlab.ru
certbot --nginx -d api.hairlab.ru
```

На вопросы certbot: email для уведомлений, согласие с ToS, redirect HTTP→HTTPS — **да (2)**.

Проверка автообновления:

```bash
certbot renew --dry-run
```

---

## Шаг 4 — .env и пересборка Docker

```bash
cd /var/www/hairlab
nano .env
```

```env
SECRET_KEY=длинный-случайный-ключ
NEXT_PUBLIC_API_BASE_URL=https://api.hairlab.ru
CORS_ORIGINS=https://hairlab.ru,https://www.hairlab.ru
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

`NEXT_PUBLIC_API_BASE_URL` вшивается при сборке — **обязательно пересоберите**:

```bash
docker-compose down
docker-compose up -d --build
docker-compose ps
```

---

## Шаг 5 — Проверка

- https://hairlab.ru — главная
- https://hairlab.ru/master — панель мастера (код `12345`)
- https://api.hairlab.ru/docs — Swagger API

---

## Файрвол (рекомендуется)

Оставить снаружи только 80 и 443:

```bash
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable
```

Порты 3000 и 8000 снаружи больше не нужны — nginx проксирует на localhost.

---

## Частые проблемы

**Домен не открывается** — подождите распространения DNS (до 24 ч), проверьте A-записи.

**Сайт открывается, API нет** — проверьте `api` A-запись и `nginx -t`.

**CORS ошибка в браузере** — в `.env` должен быть точный `CORS_ORIGINS` с `https://`, затем `docker-compose up -d --build`.

**Старый IP в браузере** — очистите кэш или откройте в инкогнито.
