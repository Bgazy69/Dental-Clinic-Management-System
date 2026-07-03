const router = require('express').Router()
const auth = require('../middleware/auth')
const role = require('../middleware/role')
const { getAll, getOne, create, remove, getSlots, createSlots } = require('../controllers/doctorController')

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Список всех врачей
 *     tags: [Doctors]
 *     security: []
 *     responses:
 *       200:
 *         description: Массив врачей
 */
router.get('/', getAll)

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Получить врача по ID
 *     tags: [Doctors]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Данные врача со слотами
 *       404:
 *         description: Врач не найден
 */
router.get('/:id', getOne)

/**
 * @swagger
 * /doctors/{id}/slots:
 *   get:
 *     summary: Получить доступные слоты врача
 *     tags: [Doctors]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-07-10"
 *     responses:
 *       200:
 *         description: Список слотов
 */
router.get('/:id/slots', getSlots)

/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: Создать врача (только ADMIN)
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, specialty]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Алия Сейткали
 *               email:
 *                 type: string
 *                 example: doctor@clinic.com
 *               password:
 *                 type: string
 *                 example: doctor123
 *               phone:
 *                 type: string
 *                 example: "+77001234567"
 *               specialty:
 *                 type: string
 *                 example: Терапевт
 *               bio:
 *                 type: string
 *                 example: Опытный врач с 10 летним стажем
 *     responses:
 *       200:
 *         description: Врач создан
 *       403:
 *         description: Нет доступа
 */
router.post('/', auth, role('ADMIN'), create)

/**
 * @swagger
 * /doctors/{id}/slots:
 *   post:
 *     summary: Добавить слоты расписания
 *     tags: [Doctors]
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
 *               slots:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["2026-07-10T08:00:00.000Z", "2026-07-10T09:00:00.000Z"]
 *     responses:
 *       200:
 *         description: Слоты добавлены
 */
router.post('/:id/slots', auth, role('DOCTOR', 'ADMIN'), createSlots)

/**
 * @swagger
 * /doctors/{id}:
 *   delete:
 *     summary: Удалить врача (только ADMIN)
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Врач удалён
 *       403:
 *         description: Нет доступа
 */
router.delete('/:id', auth, role('ADMIN'), remove)

module.exports = router