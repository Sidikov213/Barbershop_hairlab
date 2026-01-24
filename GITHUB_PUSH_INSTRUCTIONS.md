# Инструкция по загрузке проекта на GitHub

## Шаг 1: Установка Git (если еще не установлен)

1. Скачайте Git с официального сайта: https://git-scm.com/download/win
2. Запустите установщик и следуйте инструкциям
3. После установки перезапустите PowerShell/Terminal

## Шаг 2: Проверка установки Git

Откройте PowerShell и выполните:
```powershell
git --version
```

Если Git установлен, вы увидите версию.

## Шаг 3: Настройка Git (первый раз)

Настройте ваше имя и email (замените на свои данные):
```powershell
git config --global user.name "Ваше Имя"
git config --global user.email "your.email@example.com"
```

## Шаг 4: Инициализация репозитория

Выполните в папке проекта:
```powershell
cd C:\Users\Sodirhon\Desktop\diplom
git init
```

## Шаг 5: Добавление файлов

Добавьте все файлы проекта:
```powershell
git add .
```

## Шаг 6: Первый коммит

Создайте первый коммит:
```powershell
git commit -m "Initial commit"
```

## Шаг 7: Создание репозитория на GitHub

1. Зайдите на https://github.com
2. Нажмите кнопку "+" в правом верхнем углу
3. Выберите "New repository"
4. Введите название репозитория (например: "diplom")
5. НЕ добавляйте README, .gitignore или license (они уже есть)
6. Нажмите "Create repository"

## Шаг 8: Подключение к GitHub

Скопируйте URL вашего репозитория (например: https://github.com/ваш-username/diplom.git)

Выполните команды (замените URL на свой):
```powershell
git remote add origin https://github.com/ваш-username/diplom.git
git branch -M main
git push -u origin main
```

Если GitHub запросит авторизацию, используйте Personal Access Token (см. ниже).

## Шаг 9: Авторизация в GitHub

GitHub больше не принимает пароли. Используйте Personal Access Token:

1. Зайдите на https://github.com/settings/tokens
2. Нажмите "Generate new token (classic)"
3. Выберите права доступа: `repo` (все права)
4. Скопируйте токен (он показывается только один раз!)
5. При выполнении `git push` используйте токен вместо пароля:
   - Username: ваш username на GitHub
   - Password: вставьте токен

## Альтернативный способ через GitHub Desktop

Если хотите использовать графический интерфейс:
1. Скачайте GitHub Desktop: https://desktop.github.com/
2. Установите и авторизуйтесь
3. File → Add Local Repository → выберите папку проекта
4. Publish repository

## Полезные команды

- Проверить статус: `git status`
- Посмотреть изменения: `git diff`
- Посмотреть историю: `git log`
- Добавить изменения: `git add .`
- Создать коммит: `git commit -m "Описание изменений"`
- Загрузить на GitHub: `git push`
- Скачать изменения: `git pull`
