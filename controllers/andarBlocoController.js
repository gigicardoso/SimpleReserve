const Bloco = require("../models/blocosModel");
const Andar = require("../models/andarBlocoModel");

//CONSULTA
exports.listarAndar = async (req, res) => {
  try {
    const andar = await Andar.findAll({
      include: [
        {
          model: Bloco,
          as: "andarBloco",
        },
      ],
    });
    res.json(andar);
  } catch (error) {
    res.status(500).send("Erro ao buscar andares");
  }
};


// CRIAÇÃO
exports.criarAndar = async (req, res) => {
  try {
    const novoAndar = await Andar.create(req.body);
    res.status(201).json(novoAndar);
  } catch (error) {
    res.status(500).send("Erro ao criar andar");
  }
};


//UPDATE
exports.atualizarAndar = async (req, res) => {
  try {
    const andar = await Andar.findByPk(req.params.id);
    if (!andar) return res.status(404).send("Andar não encontrado");
    await andar.update(req.body);
    res.json(andar);
  } catch (error) {
    res.status(500).send("Erro ao atualizar andar");
  }
};


//DELETE
exports.deletarAndar = async (req, res) => {
  try {
    const andar = await Andar.findByPk(req.params.id);
    if (!andar) return res.status(404).send("Andar não encontrado");
    await andar.destroy();
    res.send("Andar deletado com sucesso");
  } catch (error) {
    res.status(500).send("Erro ao deletar andar");
  }
};
