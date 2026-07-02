const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getAll = async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany({
            include: { appointments: true },
            orderBy: { name: 'asc' }
        })
        res.json(doctors)
    } catch (e) {
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}

exports.create = async (req, res) => {
    try {
        const doctor = await prisma.doctor.create({ data: req.body })
        res.json(doctor)
    } catch (e) {
        res.status(400).json({ error: 'Ошибка создания врача' })
    }
}

exports.update = async (req, res) => {
    try {
        const doctor = await prisma.doctor.update({
            where: { id: Number(req.params.id) },
            data: req.body
        })
        res.json(doctor)
    } catch (e) {
        res.status(400).json({ error: 'Ошибка обновления' })
    }
}

exports.remove = async (req, res) => {
    try {
        await prisma.doctor.delete({ where: { id: Number(req.params.id) } })
        res.json({ message: 'Врач удалён' })
    } catch (e) {
        res.status(400).json({ error: 'Ошибка удаления' })
    }
}