const express = require('express');
const router = express.Router();
const novaReservaController = require('../controllers/novaReservaController');
const Sala = require('../models/salas');

// Rota GET para exibir o formulário de nova reserva
router.get('/novareserva', async (req, res) => {
  try {
    const salas = await Sala.findAll({ raw: true });
    res.render('novaReserva', { salas });
  } catch (error) {
    res.status(500).send('Erro ao buscar salas');
  }
});

// POST continua igual
router.post('/novareserva', novaReservaController.criarReserva);

module.exports = router;