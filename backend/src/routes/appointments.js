const router = require('express').Router()
const auth = require('../middleware/auth')
const { getAll, create, updateStatus, myAppointments } = require('../controllers/appointmentController')

/**
 * @swagger
 * /appointments/my:
 *   get:
 *     summary: Мои записи (для пациента)
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Список записей текущего пациента
 */
router.get('/my', auth, myAppointments)

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Все записи (фильтр по doctorId, patientId, date)
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Список записей
 */
router.get('/', auth, getAll)

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Записаться к врачу (для пациента)
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctorId, timeSlotId]
 *             properties:
 *               doctorId:
 *                 type: integer
 *               timeSlotId:
 *                 type: integer
 *               complaint:
 *                 type: string
 *                 example: Болит зуб
 *     responses:
 *       200:
 *         description: Запись создана
 *       400:
 *         description: Слот недоступен
 */
router.post('/', auth, create)

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Обновить статус записи
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [SCHEDULED, COMPLETED, CANCELLED]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Статус обновлён
 */
router.put('/:id', auth, updateStatus)

module.exports = router