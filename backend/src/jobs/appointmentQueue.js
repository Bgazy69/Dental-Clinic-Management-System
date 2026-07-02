const { Queue, Worker } = require('bullmq')

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379
}

const appointmentQueue = new Queue('appointments', { connection })

const worker = new Worker('appointments', async (job) => {
    if (job.name === 'send-reminder') {
        const { patientName, doctorName, date } = job.data
        console.log(`📧 Напоминание отправлено: ${patientName} — приём у ${doctorName} в ${new Date(date).toLocaleString('ru')}`)
    }
}, { connection })

worker.on('completed', (job) => console.log(`✅ Job ${job.id} выполнен`))
worker.on('failed', (job, err) => console.log(`❌ Job ${job.id} ошибка: ${err.message}`))

module.exports = { appointmentQueue }