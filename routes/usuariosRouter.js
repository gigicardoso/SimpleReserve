const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { verificarPermissao } = require('../middlewares/auth');

// Tela de cadastro (opcional, aponta para a mesma view)
router.get('/cadastroUsuarios', verificarPermissao('cadUser'), async (req, res) => {
  const permissoes = await require('../models/permissaoModel').findAll({ order: [['descricao', 'ASC']] });
  res.render('mais/adicionaUsuario', {
    layout: 'layout',
    showSidebar: true,
    showLogo: true,
    permissoes,
    // NÃO passa objeto 'usuario', indicando que é cadastro (não edição)
    breadcrumb: [
      { title: 'Gerenciador ADM', path: '/adm' },
      { title: 'Usuários', path: '/usuariosadm' },
      { title: 'Cadastrar Usuário', path: '/usuariosadm/cadastroUsuarios' }
    ]
  });
});

// ATENÇÃO: como o router é montado em '/usuariosadm', aqui usamos apenas '/'
router.get('/', verificarPermissao('cadUser'), usuariosController.listarUsuarios);
router.post('/', verificarPermissao('cadUser'), usuariosController.criarUsuario);

module.exports = router;