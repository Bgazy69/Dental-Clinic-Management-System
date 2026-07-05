const { PrismaClient } = require('@prisma/client')
const { appointmentQueue } = require('../jobs/appointmentQueue')
const prisma = new PrismaClient()

exports.getAll = async (req, res) => {
    try {
        const { doctorId, patientId, date } = req.query
        const where = {}
        if (doctorId) where.doctorId = Number(doctorId)
        if (patientId) where.patientId = Number(patientId)
        if (date) {
            const d = new Date(date)
            // Берём весь день с запасом ±1 день чтобы покрыть любой часовой пояс
            const from = new Date(d)
            from.setDate(from.getDate() - 1)
            const to = new Date(d)
            to.setDate(to.getDate() + 2)
            where.timeSlot = { date: { gte: from, lt: to } }
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                patient: { include: { user: { select: { name: true, phone: true, email: true } } } },
                doctor: { include: { user: { select: { name: true } } } },
                timeSlot: true
            },
            orderBy: { timeSlot: { date: 'asc' } }
        })
        res.json(appointments)
    } catch (e) {
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}

exports.create = async (req, res) => {
    try {
        const { doctorId, timeSlotId, complaint } = req.body

        const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } })
        if (!patient) return res.status(400).json({ error: 'Профиль пациента не найден' })

        const slot = await prisma.timeSlot.findUnique({ where: { id: Number(timeSlotId) } })
        if (!slot || !slot.available) return res.status(400).json({ error: 'Слот недоступен' })

        const appointment = await prisma.appointment.create({
            data: {
                patientId: patient.id,
                doctorId: Number(doctorId),
                userId: req.user.id,
                timeSlotId: Number(timeSlotId),
                complaint
            },
            include: {
                patient: { include: { user: { select: { name: true, email: true } } } },
                doctor: { include: { user: { select: { name: true } } } },
                timeSlot: true
            }
        })

        await prisma.timeSlot.update({
            where: { id: Number(timeSlotId) },
            data: { available: false }
        })

        await appointmentQueue.add('send-reminder', {
            patientName: appointment.patient.user.name,
            patientEmail: appointment.patient.user.email,
            doctorName: appointment.doctor.user.name,
            date: appointment.timeSlot.date
        }, { delay: 3000 })

        res.json(appointment)
    } catch (e) {
        console.error(e)
        res.status(400).json({ error: 'Ошибка создания записи' })
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const { status, notes } = req.body
        const appointment = await prisma.appointment.update({
            where: { id: Number(req.params.id) },
            data: { status, notes }
        })
        if (status === 'CANCELLED') {
            await prisma.timeSlot.update({
                where: { id: appointment.timeSlotId },
                data: { available: true }
            })
        }
        res.json(appointment)
    } catch (e) {
        res.status(400).json({ error: 'Ошибка обновления' })
    }
}

exports.myAppointments = async (req, res) => {
    try {
        const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } })
        if (!patient) return res.status(404).json({ error: 'Профиль не найден' })

        const appointments = await prisma.appointment.findMany({
            where: { patientId: patient.id },
            include: {
                doctor: { include: { user: { select: { name: true } } } },
                timeSlot: true
            },
            orderBy: { timeSlot: { date: 'desc' } }
        })
        res.json(appointments)
    } catch (e) {
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}