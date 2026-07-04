const { Queue, Worker } = require('bullmq')
const { sendAppointmentConfirmation } = require('../services/emailService')

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379
}

const appointmentQueue = new Queue('appointments', { connection })

const worker = new Worker('appointments', async (job) => {
    if (job.name === 'send-reminder') {
        const { patientName, doctorName, date, patientEmail } = job.data
        console.log(`📧 Обработка напоминания для ${patientName}`)

        if (patientEmail) {
            await sendAppointmentConfirmation({
                to: patientEmail,
                patientName,
                doctorName,
                date
            })
        } else {
            console.log(`📧 Demo: напоминание ${patientName} — приём у ${doctorName} в ${new Date(date).toLocaleString('ru')}`)
        }
    }
}, { connection })

worker.on('completed', (job) => console.log(`✅ Job ${job.id} выполнен`))
worker.on('failed', (job, err) => console.log(`❌ Job ${job.id} ошибка: ${err.message}`))

module.exports = { appointmentQueue }