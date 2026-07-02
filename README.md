# 🦷 Dental Clinic Management System

Система автоматизации процессов стоматологической клиники.

## Технологии

- **Backend**: Node.js, Express, Prisma ORM
- **Frontend**: React, Vite, React Query
- **Database**: PostgreSQL
- **Cache / Queue**: Redis, BullMQ
- **DevOps**: Docker, Docker Compose, GitHub Actions

## Запуск проекта

### Одной командой:

```bash
docker compose up --build -d
```

- Фронтенд: http://localhost:3000
- Бэкенд API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## Функционал

- JWT аутентификация
- Управление пациентами
- Управление врачами
- Запись на приём
- Фоновые задачи (напоминания, отчёты)
- CI/CD через GitHub Actions

## Архитектура

```
Frontend (React) → Backend (Express) → PostgreSQL
                                     → Redis (кэш + очереди)
                                     → BullMQ (фоновые задачи)
```