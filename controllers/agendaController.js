const Agenda = require("../models/agendaModel");
const Sala = require("../models/salasModel");
const Usuario = require("../models/usuariosModel");

//CONSULTA
exports.listarAgendas = async (req, res) => {
  try {
    const agendas = await Agenda.findAll({
      include: [
        { model: Sala, as: "sala" },
        { model: Usuario, as: "usuario" },
      ],
    });
    res.json(agendas);
  } catch (error) {
    res.status(500).send("Erro ao buscar agendas");
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
