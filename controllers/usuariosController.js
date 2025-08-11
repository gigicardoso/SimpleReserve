const Usuario = require('../models/usuariosModel');

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.render('adm/usuariosAdm', {
      usuarios,
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isGerenciador: true,
      breadcrumb: [
        { title: 'Gerenciador ADM', path: '/adm' },
        { title: 'Gerenciador de Usuários', path: '/usuariosadm' }
      ]
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send('Erro ao buscar usuários');
  }
};

// Criar usuário
exports.criarUsuario = async (req, res) => {
  try {
    if (req.body.senha !== req.body.senha2) {
      return res.render('mais/adicionaUsuario', {
        layout: 'layout',
        showSidebar: true,
        showLogo: true,
        breadcrumb: [
          { title: 'Gerenciador ADM', path: '/adm' },
          { title: 'Gerenciador de Usuários', path: '/usuariosadm' },
          { title: 'Cadastrar Novo Usuário', path: '/mais/adicionaUsuario' }
        ],
        senhaDiferente: true,
        nome: req.body.nome,
        email: req.body.email
      });
    }
    await Usuario.create({
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      id_permissao: 1
    });
    res.redirect('/usuariosAdm');
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).send('Erro ao criar usuário');
  }
};

//UPDATE
exports.editarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const id = req.params.id;
    await Usuario.update(
      { nome, email, senha },
      { where: { id_user: id } }
    );
    res.redirect('/usuariosAdm');
  } catch (err) {
    res.status(500).send('Erro ao editar usuário');
  }
};

exports.formEditarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.render("mais/adicionaUsuario", {
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      usuario,
      breadcrumb: [
        { title: 'Gerenciador ADM', path: '/adm' },
        { title: 'Gerenciador de Usuários', path: '/usuariosadm' },
        { title: 'Editar Usuário', path: `/editarUsuario/${usuario.id_user}` }
      ]
    });
  } catch (err) {
    res.status(500).send('Erro ao buscar usuário');
  }
};

//DELETE
exports.deletarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).send('Usuario não encontrada');
    await usuario.destroy();
    res.redirect('/usuariosadm');
  } catch (error) {
    res.status(500).send('Erro ao deletar usuario');
  }
};

