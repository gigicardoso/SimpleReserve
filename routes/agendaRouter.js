const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');
const Sala = require('../models/salasModel');
const auth = require("../middlewares/auth");
const { verificarGerenciadorAdm, verificarPermissao } = require("../middlewares/auth");

// API para buscar reservas para o calendário (somente do usuário logado)
router.get('/api/eventos', auth, async (req, res) => {
  try {
    const u = req.session && req.session.usuario;
    if (!u) {
      return res.status(401).json({ erro: 'Não autenticado' });
    }
    const Agenda = require('../models/agendaModel');
    const reservas = await Agenda.findAll({
      where: { id_user: u.id_user },
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
router.get("/reservasadm", auth, verificarGerenciadorAdm, verificarPermissao('ReservaAdm'), agendaController.listarReservasAdm);
router.post('/verificar-disponibilidade', agendaController.verificarDisponibilidade);


module.exports = router;