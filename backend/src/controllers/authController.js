const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body
        const hashed = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { email, password: hashed, name, role }
        })
        res.json({ message: 'Пользователь создан', id: user.id })
    } catch (e) {
        res.status(400).json({ error: 'Email уже существует' })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return res.status(400).json({ error: 'Пользователь не найден' })

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return res.status(400).json({ error: 'Неверный пароль' })

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } })
    } catch (e) {
        res.status(500).json({ error: 'Ошибка сервера' })
    }
}