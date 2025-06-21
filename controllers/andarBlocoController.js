const Bloco = require("../models/blocosModel");
const Andar = require("../models/andarBlocoModel");



exports.formCadastroAndar = async (req, res) => {
  const blocos = await Bloco.findAll();
  res.render("adm/andar", {
    blocos,
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
  });
};


//Exibe os andares de um bloco específico
exports.getAndaresPorBloco = async (req, res) => {
  const { id_bloco } = req.params;
  const Andar = require("../models/andarBlocoModel");
  const andares = await Andar.findAll({ where: { id_bloco } });
  res.json(andares);
};

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
    await Andar.create({
      descricao: req.body.descricao,
      id_bloco: req.body.id_bloco,
    });
    res.redirect("/andar");
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
