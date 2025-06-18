const Permissao = require("../models/permissaoModel");

// CONSULTA
exports.listarPermissaos = async (req, res) => {
  try {
    const permissao = await Permissao.findAll();
    res.render("permissao", { permissao });
  } catch (error) {
    res.status(500).send("Erro ao buscar permissao");
  }
};

// CRIAÇÃO
exports.criarPermissao = async (req, res) => {
  try {
    await Permissao.create(req.body);
    res.redirect("/permissao");
  } catch (error) {
    res.status(500).send("Erro ao criar permissao");
  }
};

//UPDATE
exports.atualizarPermissao = async (req, res) => {
  try {
    const permissao = await Permissao.findByPk(req.params.id);
    if (!permissao) return res.status(404).send('Permissao não encontrada');
    await permissao.update(req.body);
    res.json(permissao);
  } catch (error) {
    res.status(500).send('Erro ao atualizar permissao');
  }
};

//DELETE
exports.deletarPermissao = async (req, res) => {
  try {
    const permissao = await Permissao.findByPk(req.params.id);
    if (!permissao) return res.status(404).send('Permissao não encontrada');
    await permissao.destroy();
    res.send('Permissao deletada com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao deletar permissao');
  }
};
