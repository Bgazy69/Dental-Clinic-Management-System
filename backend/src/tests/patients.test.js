const request = require('supertest')
const app = require('../app')

let token = ''
const adminEmail = `admin_${Date.now()}@dental.com`

beforeAll(async () => {
    const { PrismaClient } = require('@prisma/client')
    const bcrypt = require('bcryptjs')
    const prisma = new PrismaClient()

    const hashed = await bcrypt.hash('password123', 10)
    await prisma.user.create({
        data: {
            email: adminEmail,
            password: hashed,
            name: 'Admin Test',
            role: 'ADMIN'
        }
    })

    const res = await request(app)
        .post('/api/auth/login')
        .send({ email: adminEmail, password: 'password123' })
    token = res.body.token

    await prisma.$disconnect()
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
                name: 'Иван Иванов',
                email: `patient_${Date.now()}@test.com`,
                phone: '+77001234567',
                password: 'password123'
            })
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('id')
    })
})

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
})