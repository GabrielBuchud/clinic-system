const express = require('express');
const router = express.Router();
const { getAddress } = require('../controllers/cepController');
router.get('/:cep', getAddress);
module.exports = router;