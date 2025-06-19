const Sala = require("../models/salasModel");
const Andar = require("../models/andarBlocoModel");
const Mesa = require("../models/tipoMesaModel");
const SalaTipo = require("../models/tipoSalaModel");

// CONSULTA
exports.listarSalas = async (req, res) => {
  try {
    const salas = await Sala.findAll({
      include: [
        { model: Andar, as: "andarSala" },
        { model: Mesa, as: "mesaSala" },
        { model: SalaTipo, as: "tipoSala" },
      ],
    });
    res.render("gerenciarSalas", {
      salas,
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isGerenciarSalas: true,
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar salas");
  }
};


// CRIAÇÃO
exports.criarSala = async (req, res) => {
  try {
    await Sala.create(req.body);
    res.redirect("/gerenciarsalas");
  } catch (error) {
    res.status(500).send("Erro ao criar sala");
  }
};

//UPDATE
exports.atualizarSala = async (req, res) => {
  try {
    const sala = await Sala.findByPk(req.params.id);
    if (!sala) return res.status(404).send("Sala não encontrada");
    await sala.update(req.body);
    res.json(sala);
  } catch (error) {
    res.status(500).send("Erro ao atualizar sala");
  }
};

//DELETE
exports.deletarSala = async (req, res) => {
  try {
    const sala = await Sala.findByPk(req.params.id);
    if (!sala) return res.status(404).send("Sala não encontrada");
    await sala.destroy();
    res.send("Sala deletada com sucesso");
  } catch (error) {
    res.status(500).send("Erro ao deletar sala");
  }
};
