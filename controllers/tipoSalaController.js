const TipoSala = require("../models/tipoSalaModel");

// CONSULTA
exports.listarTipoSalas = async (req, res) => {
  try {
    const tipoSalas = await TipoSala.findAll();
    res.render('adm/tipoSala', {
      tipoSalas,
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isGerenciador: true,
      breadcrumb: [
        { title: 'Gerenciador ADM', path: '/adm' },
        { title: 'Gerenciador de tipo de sala', path: '/tipoSala' }
      ]
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar tipo de Salas");
  }
};

// CRIAÇÃO
exports.criarTipoSala = async (req, res) => {
  try {
    const nome = req.body.descricao && req.body.descricao.trim();
    const breadcrumb = [
      { title: 'Gerenciador ADM', path: '/adm' },
      { title: 'Gerenciador de tipo de sala', path: '/tipoSala' },
      { title: 'Cadastrar tipo de sala', path: '' }
    ];
    if (!nome) {
      return res.render("mais/adicionaSala", {
        layout: "layout",
        erro: "Nome do tipo de sala é obrigatório!",
        showSidebar: true,
        showLogo: true,
        breadcrumb
      });
    }
    const duplicada = await TipoSala.findOne({ where: { descricao: nome } });
    if (duplicada) {
      return res.render("mais/adicionaSala", {
        layout: "layout",
        erro: `O tipo de sala '${nome}' já foi cadastrado!`,
        showSidebar: true,
        showLogo: true,
        breadcrumb
      });
    }
    await TipoSala.create({ descricao: nome });
    res.redirect("/tipoSala");
  } catch (error) {
    res.status(500).send("Erro ao criar tipo de Sala");
  }
};

// API para checagem de duplicidade de tipo de sala
exports.checkDuplicado = async (req, res) => {
  try {
    const nome = req.query.nome;
    if (!nome) return res.json({ duplicado: false });
    const tipoSala = await TipoSala.findOne({ where: { descricao: nome } });
    res.json({ duplicado: !!tipoSala });
  } catch (err) {
    res.json({ duplicado: false });
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
    res.render("mais/adicionaSala", {
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
