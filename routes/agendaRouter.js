const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');
const Sala = require('../models/salasModel');
const auth = require("../middlewares/auth");

// API para buscar reservas para o calendário
router.get('/api/eventos', async (req, res) => {
  try {
    const Agenda = require('../models/agendaModel');
    const reservas = await Agenda.findAll({
      include: [{ model: Sala, as: 'sala' }]
    });
    // Formatar para o formato do FullCalendar
    const eventos = reservas.map(r => ({
      id: r.id_agenda,
      title: r.nome_evento || 'Reserva',
      start: r.data + 'T' + r.hora_inicio,
      end: r.data + 'T' + r.hora_final,
      backgroundColor: '#84925b',
      borderColor: '#84925b',
      extendedProps: {
        sala: r.sala ? r.sala.nome_salas : '',
        descricao: r.descricao
      }
    }));
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar eventos' });
  }
});

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

//Exclusão de Reserva
router.delete('/:id', auth, agendaController.deletarReserva);
router.get('/excluir/:id', auth, agendaController.deletarReserva);

// Edição de Reserva
router.get('/editar/:id', auth, agendaController.formEditarReserva);
router.post('/editar/:id', auth, agendaController.editarReserva);

// Criar nova reserva
router.post('/nova', agendaController.criarReserva);
router.get("/reservasadm", auth, agendaController.listarReservasAdm);
router.post('/verificar-disponibilidade', agendaController.verificarDisponibilidade);


module.exports = router;