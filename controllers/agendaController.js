const Agenda = require("../models/agendaModel");
const Sala = require("../models/salasModel");
const Usuario = require("../models/usuariosModel");

//CONSULTA PARA VIEW DE RESERVAS
exports.listarReservasAdm = async (req, res) => {
  try {
    const reservas = await Agenda.findAll({
      include: [
        { model: Sala, as: "sala" },
        { model: Usuario, as: "usuario" },
      ],
    });
    // Formata os dados para a view
    const reservasFormatadas = reservas.map(r => ({
      nomeUsuario: r.usuario ? r.usuario.nome : '',
      nomeSala: r.sala ? r.sala.nome : '',
      dataReserva: r.data,
      horaInicio: r.hora_inicio ? r.hora_inicio.slice(0,5) : '',
      horaFim: r.hora_final ? r.hora_final.slice(0,5) : ''
    }));
    res.render('adm/reservas', {
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isGerenciador: true,
      breadcrumb: [
        { title: 'Gerenciador ADM', path: '/adm' },
        { title: 'Reservas', path: '/reservasadm' }
      ],
      reservas: reservasFormatadas
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar reservas");
  }
};

//CRIAÇÃO
exports.criarAgenda = async (req, res) => {
  try {
    const novaAgenda = await Agenda.create(req.body);
    res.status(201).json(novaAgenda);
  } catch (error) {
    res.status(500).send("Erro ao criar agenda");
  }
};

//UPDATE
exports.atualizarAgenda = async (req, res) => {
  try {
    const agenda = await Agenda.findByPk(req.params.id);
    if (!agenda) return res.status(404).send("Agenda não encontrada");
    await agenda.update(req.body);
    res.json(agenda);
  } catch (error) {
    res.status(500).send("Erro ao atualizar agenda");
  }
};

//DELETE
exports.deletarAgenda = async (req, res) => {
  try {
    const agenda = await Agenda.findByPk(req.params.id);
    if (!agenda) return res.status(404).send("Agenda não encontrada");
    await agenda.destroy();
    res.send("Agenda deletada com sucesso");
  } catch (error) {
    res.status(500).send("Erro ao deletar agenda");
  }
};
