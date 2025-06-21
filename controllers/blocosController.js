const Bloco = require("../models/blocosModel");

// CONSULTA
exports.listarBlocos = async (req, res) => {
  try {
    const blocos = await Bloco.findAll();
    res.render("adm/bloco", {
      blocos,
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isGerenciarBlocos: true,
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar blocos");
  }
};

//

// CRIAÇÃO
exports.criarBloco = async (req, res) => {
  try {
    await Bloco.create(req.body);
    res.redirect("/bloco");
  } catch (error) {
    res.status(500).send("Erro ao criar bloco");
  }
};

//UPDATE
exports.atualizarBloco = async (req, res) => {
  try {
    const bloco = await Bloco.findByPk(req.params.id);
    if (!bloco) return res.status(404).send("Bloco não encontrado");
    await bloco.update(req.body);
    res.redirect("/bloco");
  } catch (error) {
    res.status(500).send("Erro ao atualizar bloco");
  }
};
exports.formEditarBloco = async (req, res) => {
  try {
    const bloco = await Bloco.findByPk(req.params.id);
    if (!bloco) return res.status(404).send("Bloco não encontrado");
    res.render("adm/editarBloco", {
      bloco,
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isGerenciarBlocos: true,
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar bloco para edição");
  }
};

//DELETE
exports.deletarBloco = async (req, res) => {
  try {
    const bloco = await Bloco.findByPk(req.params.id);
    if (!bloco) return res.status(404).send("Bloco não encontrado");
    await bloco.destroy();
    res.redirect("/bloco");
  } catch (error) {
    res.status(500).send("Erro ao deletar bloco");
  }
};
