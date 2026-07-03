const router = require('express').Router()
const { register, login, me } = require('../controllers/authController')
const auth = require('../middleware/auth')

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация пациента
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Иван Иванов
 *               email:
 *                 type: string
 *                 example: ivan@email.com
 *               password:
 *                 type: string
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: "+77001234567"
 *     responses:
 *       200:
 *         description: Успешная регистрация, возвращает токен
 *       400:
 *         description: Email уже существует
 */
router.post('/register', register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@clinic.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Возвращает JWT токен и данные пользователя
 *       400:
 *         description: Неверный email или пароль
 */
router.post('/login', login)

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Получить текущего пользователя
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Данные текущего пользователя
 *       401:
 *         description: Не авторизован
 */
router.get('/me', auth, me)

module.exports = router