const Mesa = require("../models/tipoMesaModel");

// CONSULTA
exports.listarMesas = async (req, res) => {
  try {
    const mesa = await Mesa.findAll();
    res.render("adm/tipoMesa", { mesa, layout: "layout", showSidebar: true, showLogo: true, isGerenciarMesas: true });
  } catch (error) {
    res.status(500).send("Erro ao buscar mesa");
  }
};

// CRIAÇÃO
exports.criarMesa = async (req, res) => {
  try {
    await Mesa.create(req.body);
    res.redirect("/tipoMesa");
  } catch (error) {
    res.status(500).send("Erro ao criar mesa");
  }
};

//UPDATE
exports.atualizarMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);
    if (!mesa) return res.status(404).send('Mesa não encontrada');
    await mesa.update(req.body);
    res.json(mesa);
  } catch (error) {
    res.status(500).send('Erro ao atualizar mesa');
  }
};

//DELETE
exports.deletarMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);
    if (!mesa) return res.status(404).send('Mesa não encontrada');
    await mesa.destroy();
    res.send('Mesa deletada com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao deletar mesa');
  }
};
