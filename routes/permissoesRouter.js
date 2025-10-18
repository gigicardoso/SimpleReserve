const express = require('express');
const router = express.Router();
const permissoesController = require('../controllers/permissaoController');
const { verificarPermissao } = require('../middlewares/auth');
const auth = require('../middlewares/auth');

// Tela de cadastro (opcional, aponta para a mesma view)
router.get('/adicionapermissao', auth, (req, res) => {
  if (!req.session.usuario.isAdm) {
    return res.render('error', { message: 'Você não tem permissão para acessar Permissões.', layout: 'layout', showSidebar: true, showLogo: true });
  }
  res.render('mais/adicionapermissao', {
    layout: 'layout',
    showSidebar: true,
    showLogo: true,
    breadcrumb: [
      { title: 'Gerenciador ADM', path: '/adm' },
      { title: 'Permissões', path: '/permissoes' },
      { title: 'Cadastrar Permissão', path: '/permissoes/adicionapermissao' }
    ]
  });
});

// ATENÇÃO: como o router é montado em '/permissoes', aqui usamos apenas '/'
router.get('/', auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render('error', { message: 'Você não tem permissão para acessar Permissões.', layout: 'layout', showSidebar: true, showLogo: true });
  }
  next();
}, permissoesController.listarPermissoes);
router.post('/', auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render('error', { message: 'Você não tem permissão para acessar Permissões.', layout: 'layout', showSidebar: true, showLogo: true });
  }
  next();
}, permissoesController.criarPermissao);

// Editar permissão (formulário)
router.get('/editarPermissao/:id_permissao', auth, async (req, res) => {
  if (!req.session.usuario.isAdm) {
    return res.render('error', { message: 'Você não tem permissão para editar permissões.', layout: 'layout', showSidebar: true, showLogo: true });
  }
  const Permissao = require('../models/permissaoModel');
  const permissao = await Permissao.findByPk(req.params.id_permissao);
  if (!permissao) {
    return res.render('error', { message: 'Permissão não encontrada.', layout: 'layout', showSidebar: true, showLogo: true });
  }
  res.render('mais/adicionapermissao', {
    permissao,
    layout: 'layout',
    showSidebar: true,
    showLogo: true,
    breadcrumb: [
      { title: 'Gerenciador ADM', path: '/adm' },
      { title: 'Permissões', path: '/permissoes' },
      { title: 'Editar Permissão', path: `/permissoes/editarPermissao/${permissao.id_permissao}` }
    ]
  });
});

// Atualizar permissão (POST)
router.post('/editarPermissao/:id_permissao', auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render('error', { message: 'Você não tem permissão para editar permissões.', layout: 'layout', showSidebar: true, showLogo: true });
  }
  next();
}, permissoesController.atualizarPermissao);

// Excluir permissão
router.get('/excluirPermissao/:id', auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render('error', { message: 'Você não tem permissão para excluir permissões.', layout: 'layout', showSidebar: true, showLogo: true });
  }
  next();
}, permissoesController.deletarPermissao);

module.exports = router;
