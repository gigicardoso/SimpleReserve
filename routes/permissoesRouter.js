const express = require('express');
const router = express.Router();

// Rota para tela de cadastro de permissão
router.get('/adicionapermissao', (req, res) => {
  res.render('mais/adicionapermissao', {
    layout: 'layout',
    showSidebar: true,
    showLogo: true,
    breadcrumb: [
      { title: 'Gerenciador ADM', path: '/adm' },
      { title: 'Permissões', path: '/permissoes' },
      { title: 'Cadastrar Permissão', path: '/mais/adicionapermissao' }
    ]
  });
});

module.exports = router;
