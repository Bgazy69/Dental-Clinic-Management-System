const { Queue, Worker } = require('bullmq')

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379
}

const reportQueue = new Queue('reports', { connection })

const worker = new Worker('reports', async (job) => {
    if (job.name === 'generate-pdf') {
        const { stats, requestedBy, generatedAt } = job.data
        console.log(`📊 PDF отчёт сгенерирован для ${requestedBy} в ${new Date(generatedAt).toLocaleString('ru')}`)
        console.log('Статистика:', stats)
    }
}, { connection })

worker.on('completed', (job) => console.log(`✅ Report job ${job.id} выполнен`))
worker.on('failed', (job, err) => console.log(`❌ Report job ${job.id} ошибка: ${err.message}`))

module.exports = { reportQueue }