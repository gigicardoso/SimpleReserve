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
    const nome = req.body.descricao && req.body.descricao.trim();
    const breadcrumb = [
      { title: 'Gerenciador ADM', path: '/adm' },
      { title: 'Gerenciador de blocos', path: '/bloco' },
      { title: 'Cadastrar Bloco', path: '/adicionabloco' }
    ];
    if (!nome) {
      return res.render("mais/adicionabloco", {
        layout: "layout",
        erro: "Nome do bloco é obrigatório!",
        showSidebar: true,
        showLogo: true,
        breadcrumb
      });
    }
    const duplicado = await Bloco.findOne({ where: { descricao: nome } });
    if (duplicado) {
      return res.render("mais/adicionabloco", {
        layout: "layout",
        erro: `O bloco '${nome}' já foi cadastrado!`,
        showSidebar: true,
        showLogo: true,
        breadcrumb
      });
    }
    await Bloco.create({ descricao: nome });
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
    res.render("mais/adicionabloco", {
      bloco,
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isGerenciarBlocos: true,
      breadcrumb: [
        { title: 'Gerenciador ADM', path: '/adm' },
        { title: 'Gerenciador de blocos', path: '/bloco' },
        { title: 'Editar Bloco', path: '' }
      ]
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

// API para checagem de duplicidade de bloco
exports.checkDuplicado = async (req, res) => {
  try {
    const nome = req.query.nome;
    if (!nome) return res.json({ duplicado: false });
    const bloco = await Bloco.findOne({ where: { descricao: nome } });
    res.json({ duplicado: !!bloco });
  } catch (err) {
    res.json({ duplicado: false });
  }
};
