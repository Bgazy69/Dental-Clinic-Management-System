# 🦷 Dental Clinic Management System

Полнофункциональная система автоматизации стоматологической клиники с тремя ролями пользователей.

## 🚀 Быстрый старт

```bash
docker compose up --build -d
```

- 🌐 Сайт: http://localhost:3000
- 🔧 API: http://localhost:5000/api
- 📚 Swagger: http://localhost:5000/api/docs

## 👥 Роли пользователей
12

| Роль | Доступ | Регистрация |
|------|--------|-------------|
| Пациент | Запись к врачу, история визитов, профиль | Сам регистрируется |
| Врач | Расписание, список пациентов, статусы | Создаёт администратор |
| Администратор | Полный доступ, статистика, отчёты | Создаётся вручную |

## 🛠 Технологии

**Backend**
- Node.js + Express
- PostgreSQL + Prisma ORM
- Redis + BullMQ (фоновые задачи)
- JWT аутентификация
- Swagger / OpenAPI документация

**Frontend**
- React + Vite
- React Query
- React Router

**DevOps**
- Docker + Docker Compose
- GitHub Actions CI/CD
- Nginx (production)

## 📋 Требования задания

| Требование | Статус |
|-----------|--------|
| JWT аутентификация | ✅ |
| Асинхронные задачи (BullMQ) | ✅ |
| Внешний API (weather + email) | ✅ |
| Redis кэширование | ✅ |
| Docker + Docker Compose | ✅ |
| CI/CD GitHub Actions | ✅ |
| Swagger документация | ✅ |
| Тесты 40%+ покрытие | ✅ 50% |

## 🏗 Архитектура
Frontend (React) ──→ Nginx ──→ Backend (Express)
│
┌─────────┼─────────┐
▼         ▼         ▼
PostgreSQL  Redis    BullMQ
(данные)   (кэш)   (очереди)

## 📡 API Endpoints
POST /api/auth/register     — регистрация пациента
POST /api/auth/login        — вход
GET  /api/auth/me           — текущий пользователь
GET  /api/doctors           — список врачей (кэш 2 мин)
POST /api/doctors           — создать врача (ADMIN)
GET  /api/doctors/:id/slots — слоты врача (кэш 30 сек)
POST /api/doctors/:id/slots — добавить слоты (DOCTOR/ADMIN)
GET  /api/patients          — список пациентов
POST /api/patients          — создать пациента (ADMIN)
GET  /api/appointments      — все записи
GET  /api/appointments/my   — мои записи (PATIENT)
POST /api/appointments      — записаться к врачу
PUT  /api/appointments/:id  — обновить статус
GET  /api/external/weather  — погода (внешний API)
POST /api/external/webhook  — webhook
GET  /api/reports/generate  — отчёт (фоновая задача)

## 🧪 Тесты

```bash
cd backend
npm test
```

Результат: **7 тестов, покрытие 50%**

## 👨‍💻 Разработчик

Проект разработан в рамках курса "Практика 2 — Разработка внутренних корпоративных проектов"
