const Mesa = require("../models/tipoMesaModel");

// CONSULTA
exports.listarMesas = async (req, res) => {
  try {
    const mesas = await Mesa.findAll();
    res.render('adm/tipoMesa', {
      mesas,
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isGerenciador: true,
      breadcrumb: [
        { title: 'Gerenciador ADM', path: '/adm' },
        { title: 'Gerenciador de tipo de mesa', path: '/tipoMesa' }
      ]
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar mesa");
  }
};

// CRIAÇÃO
exports.criarMesa = async (req, res) => {
  try {
    const nome = req.body.descricao && req.body.descricao.trim();
    const breadcrumb = [
      { title: 'Gerenciador ADM', path: '/adm' },
      { title: 'Gerenciador de tipo de mesa', path: '/tipoMesa' },
      { title: 'Cadastrar tipo de mesa', path: '' }
    ];
    if (!nome) {
      return res.render("mais/adicionaMesa", {
        layout: "layout",
        erro: "Nome da mesa é obrigatório!",
        showSidebar: true,
        showLogo: true,
        breadcrumb
      });
    }
    const duplicada = await Mesa.findOne({ where: { descricao: nome } });
    if (duplicada) {
      return res.render("mais/adicionaMesa", {
        layout: "layout",
        erro: `O tipo de mesa '${nome}' já foi cadastrado!`,
        showSidebar: true,
        showLogo: true,
        breadcrumb
      });
    }
    await Mesa.create({ descricao: nome });
    res.redirect("/tipoMesa");
  } catch (error) {
    res.status(500).send("Erro ao criar mesa");
  }
};

//UPDATE
exports.atualizarMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);
    if (!mesa) return res.status(404).send("Mesa não encontrada");
    await mesa.update(req.body);
    res.redirect("/tipoMesa");
  } catch (error) {
    res.status(500).send("Erro ao atualizar mesa");
  }
};

exports.formEditarMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);
    if (!mesa) return res.status(404).send("Mesa não encontrada");
    res.render("mais/adicionaMesa", {
      mesa,
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isEditarMesa: true,
      breadcrumb: [
        { title: 'Gerenciador ADM', path: '/adm' },
        { title: 'Gerenciador de tipo de mesa', path: '/tipoMesa' },
        { title: 'Editar tipo de mesa', path: '' }
      ]
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar mesa para edição");
  }
};

//DELETE
exports.deletarMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);
    if (!mesa) return res.status(404).send("Mesa não encontrada");
    
    // Verifica se há salas usando este tipo de mesa
    const Sala = require("../models/salasModel");
    const salasUsando = await Sala.count({ where: { id_mesa: req.params.id } });
    
    // Se force=true, deleta mesmo com dependências
    if (req.query.force !== 'true' && salasUsando > 0) {
      const mesas = await Mesa.findAll();
      return res.render('adm/tipoMesa', {
        mesas,
        layout: 'layout',
        showSidebar: true,
        showLogo: true,
        isGerenciador: true,
        breadcrumb: [
          { title: 'Gerenciador ADM', path: '/adm' },
          { title: 'Gerenciador de tipo de mesa', path: '/tipoMesa' }
        ],
        alertaExclusao: {
          tipo: 'tipo de mesa',
          nome: mesa.descricao,
          id: mesa.id_mesa,
          salas: salasUsando
        }
      });
    }
    
    await mesa.destroy();
    res.redirect("/tipoMesa");
  } catch (error) {
    console.error("Erro ao deletar mesa:", error);
    res.status(500).send("Erro ao deletar mesa");
  }
};
