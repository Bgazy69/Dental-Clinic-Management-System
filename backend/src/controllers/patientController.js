const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getAll = async (req, res) => {
    try {
        const { search } = req.query
        const patients = await prisma.patient.findMany({
            where: search ? {
                user: {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { phone: { contains: search } },
                        { email: { contains: search, mode: 'insensitive' } }
                    ]
                }
            } : undefined,
            include: {
                user: { select: { name: true, email: true, phone: true } },
                appointments: true
            },
            orderBy: { createdAt: 'desc' }
        })
        res.json(patients)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}

exports.getOne = async (req, res) => {
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                user: { select: { name: true, email: true, phone: true } },
                appointments: {
                    include: {
                        doctor: { include: { user: { select: { name: true } } } },
                        timeSlot: true
                    }
                },
                medicalRecords: true
            }
        })
        if (!patient) return res.status(404).json({ error: 'Пациент не найден' })
        res.json(patient)
    } catch (e) {
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}

exports.create = async (req, res) => {
    try {
        const { name, email, phone, password, dateOfBirth, address } = req.body
        const bcrypt = require('bcryptjs')
        const hashed = await bcrypt.hash(password || 'password123', 10)

        const user = await prisma.user.create({
            data: {
                name, email, phone,
                password: hashed,
                role: 'PATIENT',
                patientProfile: {
                    create: { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null, address }
                }
            },
            include: { patientProfile: true }
        })
        res.json(user.patientProfile)
    } catch (e) {
        console.error(e)
        res.status(400).json({ error: 'Email уже существует или ошибка данных' })
    }
}

exports.update = async (req, res) => {
    try {
        const { dateOfBirth, address } = req.body
        const patient = await prisma.patient.update({
            where: { id: Number(req.params.id) },
            data: { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined, address }
        })
        res.json(patient)
    } catch (e) {
        res.status(400).json({ error: 'Ошибка обновления' })
    }
}

exports.remove = async (req, res) => {
    try {
        const patient = await prisma.patient.findUnique({ where: { id: Number(req.params.id) } })
        if (!patient) return res.status(404).json({ error: 'Пациент не найден' })
        await prisma.user.delete({ where: { id: patient.userId } })
        res.json({ message: 'Пациент удалён' })
    } catch (e) {
        res.status(400).json({ error: 'Ошибка удаления' })
    }
}