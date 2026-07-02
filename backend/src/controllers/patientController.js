const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getAll = async (req, res) => {
    try {
        const { search } = req.query
        const patients = await prisma.patient.findMany({
            where: search ? {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search } }
                ]
            } : undefined,
            include: { appointments: true },
            orderBy: { createdAt: 'desc' }
        })
        res.json(patients)
    } catch (e) {
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}

exports.getOne = async (req, res) => {
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: Number(req.params.id) },
            include: { appointments: { include: { doctor: true } }, medicalRecords: true }
        })
        if (!patient) return res.status(404).json({ error: 'Пациент не найден' })
        res.json(patient)
    } catch (e) {
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}

exports.create = async (req, res) => {
    try {
        const patient = await prisma.patient.create({ data: req.body })
        res.json(patient)
    } catch (e) {
        res.status(400).json({ error: 'Ошибка создания пациента' })
    }
}

exports.update = async (req, res) => {
    try {
        const patient = await prisma.patient.update({
            where: { id: Number(req.params.id) },
            data: req.body
        })
        res.json(patient)
    } catch (e) {
        res.status(400).json({ error: 'Ошибка обновления' })
    }
}

exports.remove = async (req, res) => {
    try {
        await prisma.patient.delete({ where: { id: Number(req.params.id) } })
        res.json({ message: 'Пациент удалён' })
    } catch (e) {
        res.status(400).json({ error: 'Ошибка удаления' })
    }
}