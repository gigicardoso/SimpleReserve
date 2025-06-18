const Bloco = require("../models/blocosModel");

// CONSULTA
exports.listarBlocos = async (req, res) => {
  try {
    const blocos = await Bloco.findAll();
    res.render("blocos", { blocos });
  } catch (error) {
    res.status(500).send("Erro ao buscar blocos");
  }
};

// CRIAÇÃO
exports.criarBloco = async (req, res) => {
  try {
    await Bloco.create(req.body);
    res.redirect("/blocos");
  } catch (error) {
    res.status(500).send("Erro ao criar bloco");
  }
};

//UPDATE
exports.atualizarBloco = async (req, res) => {
  try {
    const bloco = await Bloco.findByPk(req.params.id);
    if (!bloco) return res.status(404).send('Bloco não encontrada');
    await bloco.update(req.body);
    res.json(bloco);
  } catch (error) {
    res.status(500).send('Erro ao atualizar bloco');
  }
};

//DELETE
exports.deletarBloco = async (req, res) => {
  try {
    const bloco = await Bloco.findByPk(req.params.id);
    if (!bloco) return res.status(404).send('Bloco não encontrada');
    await bloco.destroy();
    res.send('Bloco deletada com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao deletar bloco');
  }
};
