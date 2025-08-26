const Usuario = require('../models/usuariosModel');
const Permissao = require('../models/permissaoModel');
const bcrypt = require('bcrypt');

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
    const { nome, email, senha, senha2, id_permissao } = req.body;
    if (senha !== senha2) {
      return res.render('cadastroUsuarios', { erro: 'Senhas não conferem.' });
    }
    const hash = await bcrypt.hash(senha, 10);
    await Usuario.create({ nome, email, senha: hash, id_permissao });
    res.redirect('/');
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.render('cadastroUsuarios', { erro: 'Erro ao cadastrar usuário.' });
  }
};

//UPDATE
exports.editarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const id = req.params.id;
    const updateData = { nome, email };
    if (senha && senha.trim() !== '') {
      const hash = await bcrypt.hash(senha, 10);
      updateData.senha = hash;
    }
   await Usuario.update(updateData, { where: { id_user: id } });
    res.redirect('/usuariosadm');
  } catch (err) {
    console.error('Erro ao editar usuário:', err);
    res.status(500).send('Erro ao editar usuário');
  }
};

exports.formEditarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    const permissao = await Permissao.findByPk(usuario.id_permissao);
    res.render('mais/adicionaUsuario', { 
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      usuario, 
      permissao,
      breadcrumb: [
        { title: 'Gerenciador ADM', path: '/adm' },
        { title: 'Gerenciador de Usuários', path: '/usuariosadm' },
        { title: 'Editar Usuário', path: `/editarUsuario/${usuario.id_user}` }
      ]
    });
  } catch (err) {
    res.render('error', { message: 'Erro ao carregar usuário.' });
    console.error('Erro ao carregar usuário:', err);
  }
};

//DELETE
exports.deletarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).send('Usuario não encontrado');
    await usuario.destroy();
    res.redirect('/usuariosadm');
  } catch (error) {
    res.status(500).send('Erro ao deletar usuario');
  }
};

//teste login
exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.render('login', { erro: 'Usuário ou senha inválidos 1' });
    }
    const senhaOk = await bcrypt.compare(senha, usuario.senha); 
    if (!senhaOk) {
      console.log(senhaOk, senha, usuario.senha);
      return res.render('login', { erro: 'Usuário ou senha inválidos 2' });
    }
    req.session.usuario = {
      id_user: usuario.id_user,
      nome: usuario.nome,
      email: usuario.email,
      id_permissao: usuario.id_permissao
    };
    res.redirect('/');
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.render('login', { erro: 'Erro ao fazer login' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};


