const { PrismaClient } = require('@prisma/client')
const { appointmentQueue } = require('../jobs/appointmentQueue')
const prisma = new PrismaClient()

exports.getAll = async (req, res) => {
    try {
        const { date } = req.query
        const appointments = await prisma.appointment.findMany({
            where: date ? {
                date: {
                    gte: new Date(date),
                    lt: new Date(new Date(date).getTime() + 86400000)
                }
            } : undefined,
            include: { patient: true, doctor: true },
            orderBy: { date: 'asc' }
        })
        res.json(appointments)
    } catch (e) {
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}

exports.create = async (req, res) => {
    try {
        const appointment = await prisma.appointment.create({
            data: { ...req.body, userId: req.user.id },
            include: { patient: true, doctor: true }
        })

        await appointmentQueue.add('send-reminder', {
            appointmentId: appointment.id,
            patientName: appointment.patient.firstName,
            doctorName: appointment.doctor.name,
            date: appointment.date
        }, {
            delay: 5000
        })

        res.json(appointment)
    } catch (e) {
        res.status(400).json({ error: 'Ошибка создания записи' })
    }
}

exports.update = async (req, res) => {
    try {
        const appointment = await prisma.appointment.update({
            where: { id: Number(req.params.id) },
            data: req.body
        })
        res.json(appointment)
    } catch (e) {
        res.status(400).json({ error: 'Ошибка обновления' })
    }
}

exports.remove = async (req, res) => {
    try {
        await prisma.appointment.delete({ where: { id: Number(req.params.id) } })
        res.json({ message: 'Запись удалена' })
    } catch (e) {
        res.status(400).json({ error: 'Ошибка удаления' })
    }
}