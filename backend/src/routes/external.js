const router = require('express').Router()
const auth = require('../middleware/auth')
const { getWeatherForClinic } = require('../services/weatherService')
const { sendAppointmentConfirmation } = require('../services/emailService')

/**
 * @swagger
 * /external/weather:
 *   get:
 *     summary: Погода в городе клиники (внешний API)
 *     tags: [External]
 *     responses:
 *       200:
 *         description: Данные погоды
 */
router.get('/weather', auth, async (req, res) => {
    try {
        const weather = await getWeatherForClinic()
        res.json(weather)
    } catch (e) {
        res.status(500).json({ error: 'Ошибка внешнего API' })
    }
})

/**
 * @swagger
 * /external/webhook:
 *   post:
 *     summary: Webhook для входящих событий
 *     tags: [External]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Webhook обработан
 */
router.post('/webhook', async (req, res) => {
    try {
        const { event, data } = req.body
        console.log(`🔔 Webhook получен: ${event}`, data)

        if (event === 'appointment.reminder') {
            await sendAppointmentConfirmation(data)
        }

        res.json({ received: true, event })
    } catch (e) {
        res.status(500).json({ error: 'Ошибка обработки webhook' })
    }
})

/**
 * @swagger
 * /external/test-email:
 *   post:
 *     summary: Тест отправки email
 *     tags: [External]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *               patientName:
 *                 type: string
 *               doctorName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email отправлен
 */
router.post('/test-email', auth, async (req, res) => {
    try {
        const { to, patientName, doctorName } = req.body
        await sendAppointmentConfirmation({
            to, patientName, doctorName, date: new Date()
        })
        res.json({ message: 'Email отправлен (или залогирован в консоль в demo режиме)' })
    } catch (e) {
        res.status(500).json({ error: 'Ошибка отправки' })
    }
})

module.exports = router