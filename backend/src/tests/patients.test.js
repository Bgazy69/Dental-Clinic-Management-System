const request = require('supertest')
const app = require('../app')

let token = ''

beforeAll(async () => {
    await request(app).post('/api/auth/register').send({
        email: 'admin@dental.com',
        password: 'password123',
        name: 'Admin',
        role: 'ADMIN'
    })
    const res = await request(app).post('/api/auth/login').send({
        email: 'admin@dental.com',
        password: 'password123'
    })
    token = res.body.token
})

describe('Patients API', () => {
    test('GET /api/patients — без токена возвращает 401', async () => {
        const res = await request(app).get('/api/patients')
        expect(res.statusCode).toBe(401)
    })

    test('GET /api/patients — с токеном возвращает список', async () => {
        const res = await request(app)
            .get('/api/patients')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })

    test('POST /api/patients — создаёт пациента', async () => {
        const res = await request(app)
            .post('/api/patients')
            .set('Authorization', `Bearer ${token}`)
            .send({
                firstName: 'Иван',
                lastName: 'Иванов',
                phone: '+77001234567'
            })
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('id')
    })
})