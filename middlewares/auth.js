const Permissao = require('../models/permissaoModel');

// Substitui a exportação anônima por uma função nomeada para poder anexar propriedades
async function auth(req, res, next) {
  // Funcionalidade "mantenha-me conectado" removida: não restaura sessão por cookie
  if (!req.session.usuario) {
    return res.redirect('/');
  }

  // Guarda de permissões para SALAS (genérica, cobre diferentes rotas)
  try {
    const path = (req.baseUrl || '') + (req.path || '');
    const method = (req.method || 'GET').toUpperCase();

    // Aplica apenas para URLs de Salas (ajuste se seu prefixo for outro)
    if (path.includes('/salas')) {
      // Carrega permissões atuais do usuário
      const pInst = await Permissao.findByPk(req.session.usuario.id_permissao);
      const p = pInst && (pInst.get ? pInst.get({ plain: true }) : pInst);
      const isAdm = !!(p && p.adm);

      // Detecta ação pela rota/método de forma mais precisa
      const isDeleteAction = path.includes('/excluir/') || path.includes('/delete/') || path.includes('/deletar/');
      
      const isEditAction = (path.includes('/editar/') || path.includes('/update/')) && !path.includes('/cadastro');
      
      const isCreateAction = path.includes('/cadastro') || (method === 'POST' && path.includes('/cadastrosala'));
      
      const isListOrView = path.includes('/gerenciar') || path.includes('/detalhes/');

      // Validações por ação
      if (!p) {
        return res.status(403).render('error', { message: 'Você não tem acesso a essa função' });
      }
      
      // Não bloqueia listagem/visualização
      if (isListOrView) {
        return next();
      }
      
      if (isDeleteAction && !isAdm && !p.arqSala) {
        return res.status(403).render('error', { message: 'Você não tem acesso a essa função' });
      }
      if (isEditAction && !isAdm && !p.edSalas) {
        return res.status(403).render('error', { message: 'Você não tem acesso a essa função' });
      }
      if (isCreateAction && !isAdm && !p.cadSala) {
        return res.status(403).render('error', { message: 'Você não tem acesso a essa função' });
      }
    }
  } catch (e) {
    console.error('Erro na verificação de permissões de Sala:', e);
    return res.status(500).render('error', { message: 'Erro ao verificar permissão' });
  }

  next();
}

// Exporta a função principal
module.exports = auth;

// Reexporta o verificarPermissao como propriedade do módulo (funciona com destructuring)
module.exports.verificarPermissao = (permissaoCampo) => {
  return async (req, res, next) => {
    try {
      const usuario = req.session.usuario;
      if (!usuario) {
        return res.redirect('/login');
      }
      const permissao = await Permissao.findByPk(usuario.id_permissao);
      if (!permissao) {
        return res.render('error', { message: 'Você não tem acesso a esta funcionalidade.', layout: 'layout', showSidebar: true, showLogo: true });
      }

      // Admin tem acesso total
      if (permissao.adm) {
        return next();
      }

      if (!permissao[permissaoCampo]) {
        return res.render('error', {
          message: 'Você não tem acesso a esta funcionalidade.',
          layout: 'layout',
          showSidebar: true,
          showLogo: true,
        });
      }
      next();
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      res.status(500).send('Erro interno ao verificar permissão.');
    }
  };
};

// Ajusta a verificação do Gerenciador ADM para checar apenas campos relevantes
module.exports.verificarGerenciadorAdm = async (req, res, next) => {
  try {
    const usuario = req.session.usuario;
    if (!usuario) {
      return res.redirect('/login');
    }

    let temAcessoAdm = req.session.usuario && req.session.usuario.temAcessoAdm;
    if (temAcessoAdm === undefined) {
      const permissao = await Permissao.findByPk(usuario.id_permissao);
      if (permissao) {
        const p = permissao.get ? permissao.get({ plain: true }) : permissao;
        // Admin sempre tem acesso
        temAcessoAdm = !!(p.adm || p.cadSala || p.edSalas || p.arqSala || p.cadUser || p.edUser || p.arqUser);
      }
    }

    if (!temAcessoAdm) {
      return res.render('error', {
        message: 'Você não tem acesso ao Gerenciador ADM.',
        layout: 'layout',
        showSidebar: false,
        showLogo: true,
      });
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar acesso ao Gerenciador ADM:', error);
    res.status(500).send('Erro interno ao verificar acesso.');
  }
};