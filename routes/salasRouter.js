const express = require('express');
const router = express.Router();
const salasController = require('../controllers/salasController');

router.post('/cadastrosala', salasController.criarSala);

module.exports = router;