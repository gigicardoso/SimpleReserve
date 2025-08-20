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

// Atualizar permissões de um usuário
exports.atualizarPermissao = async (req, res) => {
  try {
    const { id_permissao } = req.params;
    const {
      cadSala = 0,
      cadUser = 0,
      edUser = 0,
      arqUser = 0,
      arqSala = 0,
      edSalas = 0,
    } = req.body;

    await Permissao.update(
      {
        cadSala: cadSala ? 1 : 0,
        cadUser: cadUser ? 1 : 0,
        edUser: edUser ? 1 : 0,
        arqUser: arqUser ? 1 : 0,
        arqSala: arqSala ? 1 : 0,
        edSalas: edSalas ? 1 : 0,
      },
      { where: { id_permissao } }
    );
    res.redirect("/adm/usuariosAdm");
  } catch (error) {
    res.render("error", { message: "Erro ao atualizar permissões", error });
  }
};

//DELETE
exports.deletarPermissao = async (req, res) => {
  try {
    const permissao = await Permissao.findByPk(req.params.id);
    if (!permissao) return res.status(404).send("Permissao não encontrada");
    await permissao.destroy();
    res.send("Permissao deletada com sucesso");
  } catch (error) {
    res.status(500).send("Erro ao deletar permissao");
  }
};
