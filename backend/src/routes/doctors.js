const router = require('express').Router()
const auth = require('../middleware/auth')
const role = require('../middleware/role')
const { cache } = require('../middleware/cache')
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
router.get('/', cache(120), getAll)

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
 *         description: Данные врача
 */
router.get('/:id', cache(120), getOne)

/**
 * @swagger
 * /doctors/{id}/slots:
 *   get:
 *     summary: Доступные слоты врача
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
 *     responses:
 *       200:
 *         description: Список слотов
 */
router.get('/:id/slots', cache(30), getSlots)

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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               specialty:
 *                 type: string
 *     responses:
 *       200:
 *         description: Врач создан
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
 */
router.delete('/:id', auth, role('ADMIN'), remove)

module.exports = router