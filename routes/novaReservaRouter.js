const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');
const Sala = require('../models/salas');
const Localizacao = require('../models/localizacao');

// Rota GET para exibir o formulário de nova reserva
router.get('/', async (req, res) => {
  try {
    const salas = await Sala.findAll({
      include: [{ model: Localizacao, as: 'localizacaoSala' }],
      raw: true,
      nest: true
    });

    // Ajuste para garantir que cod e numero existem
    const salasFormatadas = salas.map(sala => ({
      cod: sala.cod,
      numero: sala.localizacaoSala ? sala.localizacaoSala.numero : ''
    }));

    console.log('Salas:', salasFormatadas); // Veja no terminal se está vindo preenchido

    res.render('novaReserva', {
      salas: salasFormatadas,
      layout: 'layout', // garanta que está usando o layout correto
      showSidebar: true,
      showLogo: true,
      isNovaReserva: true
    });
  } catch (error) {
    res.status(500).send('Erro ao buscar salas');
  }
});

// POST continua igual
router.post('/', agendaController.criar);

module.exports = router;