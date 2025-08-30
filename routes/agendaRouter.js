const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');
const Sala = require('../models/salasModel');
const auth = require("../middlewares/auth");

// Exibir formulário de nova reserva
router.get('/', async (req, res) => {
  try {
    const salas = await Sala.findAll();
    res.render('novaReserva', {
      salas,
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isNovaReserva: true
    });
  } catch (error) {
    res.status(500).send('Erro ao buscar salas');
  }
});

// Criar nova reserva
router.post('/nova', agendaController.criarReserva);
router.get("/reservasadm", auth, agendaController.listarReservasAdm);
router.post('/verificar-disponibilidade', agendaController.verificarDisponibilidade);

module.exports = router;