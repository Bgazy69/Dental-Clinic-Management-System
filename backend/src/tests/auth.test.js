const request = require('supertest')
const app = require('../app')

const testEmail = `test_${Date.now()}@dental.com`

describe('Auth API', () => {
    test('POST /api/auth/register — создаёт пользователя', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: testEmail,
                password: 'password123',
                name: 'Test User'
            })
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('token')
    })

    test('POST /api/auth/login — возвращает токен', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testEmail, password: 'password123' })
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('token')
    })

    test('POST /api/auth/login — неверный пароль', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testEmail, password: 'wrongpassword' })
        expect(res.statusCode).toBe(400)
    })

    afterAll(async () => {
        await new Promise(resolve => setTimeout(resolve, 500))
    })
})