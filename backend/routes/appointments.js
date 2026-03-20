const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { create, getAll, delete: deleteApp } = require('../controllers/appointmentController');

router.post('/', auth, create);
router.get('/', auth, getAll);
router.delete('/:id', auth, deleteApp);
router.put('/:id', auth, require('../controllers/appointmentController').update);


module.exports = router;