const router = require('express').Router()
const auth = require('../middleware/auth')
const { generateReport } = require('../controllers/reportController')

router.get('/generate', auth, generateReport)

module.exports = router