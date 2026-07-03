const router = require('express').Router()
const auth = require('../middleware/auth')
const role = require('../middleware/role')
const { getAll, getOne, create, update, remove } = require('../controllers/patientController')

router.get('/', auth, getAll)
router.get('/:id', auth, getOne)
router.post('/', auth, role('ADMIN', 'RECEPTIONIST'), create)
router.put('/:id', auth, role('ADMIN'), update)
router.delete('/:id', auth, role('ADMIN'), remove)

module.exports = router