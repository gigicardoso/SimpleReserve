const Sala = require("../models/salasModel");
const AndarBloco = require("../models/andarBlocoModel");
const Mesa = require("../models/tipoMesaModel");
const SalaTipo = require("../models/tipoSalaModel");
const Bloco = require("../models/blocosModel");

// CONSULTA
exports.listarSalas = async (req, res) => {
  try {
    const salas = await Sala.findAll({
      include: [
        { model: AndarBloco, as: "andarSala",
          include: [
            { model: Bloco, as: "blocoAndar" }
          ]
         },
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
    console.log(error);
    res.status(500).send("Erro ao buscar salas");
  }
};


// CRIAÇÃO
exports.criarSala = async (req, res) => {
  try {
    await Sala.create(req.body);
    res.redirect("/salas/gerenciarsalas");
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

// Exibir formulário de cadastro de sala
exports.formCadastroSala = async (req, res) => {
  try {
    const tiposSala = await SalaTipo.findAll();
    const tiposMesa = await Mesa.findAll();
    const blocos = await Bloco.findAll();
    let andares = [];
    if (blocos.length > 0) {
      const AndarBloco = require("../models/andarBlocoModel");
      andares = await AndarBloco.findAll({ where: { id_bloco: blocos[0].id_bloco } });
    }
    res.render("cadastroSala", {
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isCadastroSala: true,
      tiposSala,
      tiposMesa,
      blocos,
      andares
    });
  } catch (error) {
    res.status(500).send("Erro ao carregar formulário de cadastro de sala");
  }
};
