const { PrismaClient } = require('@prisma/client')
const { reportQueue } = require('../jobs/reportQueue')
const prisma = new PrismaClient()

exports.generateReport = async (req, res) => {
    try {
        const stats = await prisma.appointment.groupBy({
            by: ['status'],
            _count: { status: true }
        })

        const job = await reportQueue.add('generate-pdf', {
            stats,
            requestedBy: req.user.email,
            generatedAt: new Date()
        })

        res.json({
            message: 'Отчёт генерируется в фоне',
            jobId: job.id,
            stats
        })
    } catch (e) {
        res.status(500).json({ error: 'Ошибка генерации отчёта' })
    }
}