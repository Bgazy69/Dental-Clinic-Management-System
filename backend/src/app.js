const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger')

const authRoutes = require('./routes/auth')
const patientRoutes = require('./routes/patients')
const doctorRoutes = require('./routes/doctors')
const appointmentRoutes = require('./routes/appointments')
const reportRoutes = require('./routes/reports')

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
})
app.use(limiter)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/reports', reportRoutes)

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Dental Clinic API running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = app