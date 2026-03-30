# Robin Food — Скачивание с сервера

## Подключение

```bash
ssh root@85.239.47.69
```

Пароль — в личном кабинете [Timeweb Cloud](https://timeweb.cloud).

---

## Скачать фронтенд (сборка)

```bash
rsync -avz root@85.239.47.69:/var/www/robin-food/ ./dist/
```

---

## Скачать конфиги Docker / Nginx

```bash
# Docker Compose и .env
rsync -avz root@85.239.47.69:/opt/robin-food/docker/ ./docker/

# Nginx конфиг
rsync -avz root@85.239.47.69:/opt/robin-food/nginx/ ./nginx/
```

---

## Скачать дамп базы данных

```bash
# Создать дамп на сервере
ssh root@85.239.47.69 \
  "docker exec robin-food-db pg_dump -U postgres robin_food > /tmp/robin_food_backup.sql"

# Скачать дамп
scp root@85.239.47.69:/tmp/robin_food_backup.sql ./robin_food_backup.sql
```

---

## Открыть Supabase Studio локально (через туннель)

```bash
ssh -L 4000:127.0.0.1:4000 root@85.239.47.69
```

Затем открыть в браузере: [http://localhost:4000](http://localhost:4000)

---

## Посмотреть логи сервисов

```bash
# Все сервисы
ssh root@85.239.47.69 "cd /opt/robin-food/docker/robin-food && docker compose logs --tail=100"

# Конкретный сервис (auth / db / rest / storage / kong)
ssh root@85.239.47.69 "cd /opt/robin-food/docker/robin-food && docker compose logs --tail=100 auth"
```
