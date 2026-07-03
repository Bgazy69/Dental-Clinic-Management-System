const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getAll = async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany({
            include: { user: { select: { name: true, email: true, phone: true } } },
            orderBy: { user: { name: 'asc' } }
        })
        res.json(doctors)
    } catch (e) {
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}

exports.getOne = async (req, res) => {
    try {
        const doctor = await prisma.doctor.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                user: { select: { name: true, email: true, phone: true } },
                timeSlots: { where: { available: true }, orderBy: { date: 'asc' } }
            }
        })
        if (!doctor) return res.status(404).json({ error: 'Врач не найден' })
        res.json(doctor)
    } catch (e) {
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}

// Только админ создаёт доктора
exports.create = async (req, res) => {
    try {
        const { name, email, password, phone, specialty, bio } = req.body
        const hashed = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name, email, password: hashed, phone,
                role: 'DOCTOR',
                doctorProfile: { create: { specialty, bio } }
            },
            include: { doctorProfile: true }
        })

        res.json({
            id: user.doctorProfile.id,
            userId: user.id,
            name: user.name,
            email: user.email,
            specialty: user.doctorProfile.specialty
        })
    } catch (e) {
        console.error(e)
        res.status(400).json({ error: 'Email уже существует' })
    }
}

exports.remove = async (req, res) => {
    try {
        const doctor = await prisma.doctor.findUnique({ where: { id: Number(req.params.id) } })
        if (!doctor) return res.status(404).json({ error: 'Врач не найден' })
        await prisma.user.delete({ where: { id: doctor.userId } })
        res.json({ message: 'Врач удалён' })
    } catch (e) {
        res.status(400).json({ error: 'Ошибка удаления' })
    }
}

// Получить слоты доктора
exports.getSlots = async (req, res) => {
    try {
        const { date } = req.query
        const where = { doctorId: Number(req.params.id), available: true }
        if (date) {
            const d = new Date(date)
            const next = new Date(d)
            next.setDate(next.getDate() + 1)
            where.date = { gte: d, lt: next }
        }
        const slots = await prisma.timeSlot.findMany({ where, orderBy: { date: 'asc' } })
        res.json(slots)
    } catch (e) {
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}

// Создать слоты (только доктор/админ)
exports.createSlots = async (req, res) => {
    try {
        const { slots } = req.body // массив дат
        const doctorId = Number(req.params.id)
        const created = await prisma.timeSlot.createMany({
            data: slots.map(date => ({ doctorId, date: new Date(date) }))
        })
        res.json({ created: created.count })
    } catch (e) {
        res.status(400).json({ error: 'Ошибка создания слотов' })
    }
}