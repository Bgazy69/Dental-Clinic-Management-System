const request = require('supertest')
const app = require('../app')

describe('Auth API', () => {
    test('POST /api/auth/register — создаёт пользователя', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@dental.com',
                password: 'password123',
                name: 'Test User',
                role: 'RECEPTIONIST'
            })
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('id')
    })

    test('POST /api/auth/login — возвращает токен', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@dental.com',
                password: 'password123'
            })
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('token')
    })

    test('POST /api/auth/login — неверный пароль', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@dental.com',
                password: 'wrongpassword'
            })
        expect(res.statusCode).toBe(400)
    })
})