const TipoSala = require("../models/tipoSalaModel");

// CONSULTA
exports.listarTipoSalas = async (req, res) => {
  try {
    const tipoSalas = await TipoSala.findAll();
    res.render("adm/tipoSala", {
      tipoSalas,
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isGerenciarTipoSalas: true,
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar tipo de Salas");
  }
};

// CRIAÇÃO
exports.criarTipoSala = async (req, res) => {
  try {
    await TipoSala.create(req.body);
    res.redirect("/tipoSala");
  } catch (error) {
    res.status(500).send("Erro ao criar tipo de Sala");
  }
};

//UPDATE
exports.atualizarTipoSala = async (req, res) => {
  try {
    const tipoSala = await TipoSala.findByPk(req.params.id);
    if (!tipoSala) return res.status(404).send("Tipo de Sala não encontrada");
    await tipoSala.update(req.body);
    res.redirect("/tipoSala");
  } catch (error) {
    res.status(500).send("Erro ao atualizar tipo de Sala");
  }
};

exports.formEditarTipoSala = async (req, res) => {
  try {
    const tipoSala = await TipoSala.findByPk(req.params.id);
    if (!tipoSala) return res.status(404).send("Tipo de Sala não encontrada");
    res.render("adm/editarTipoSala", {
      tipoSala,
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isEditarTipoSala: true,
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar tipo de Sala");
  }
}

//DELETE
exports.deletarTipoSala = async (req, res) => {
  try {
    const tipoSala = await TipoSala.findByPk(req.params.id);
    if (!tipoSala) return res.status(404).send("Tipo de Sala não encontrada");
    await tipoSala.destroy();
    res.redirect("/tipoSala");
  } catch (error) {
    res.status(500).send("Erro ao deletar tipo de Sala");
  }
};
