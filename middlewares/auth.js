const Permissao = require('../models/permissaoModel');

// Substitui a exportação anônima por uma função nomeada para poder anexar propriedades
async function auth(req, res, next) {
  if (!req.session.usuario && req.cookies.rememberMe) {
    console.log('Tentando restaurar sessão pelo cookie...');
    const Usuario = require("../models/usuariosModel");
    const usuario = await Usuario.findOne({ where: { token_login: req.cookies.rememberMe } });
    if (usuario) {
      req.session.usuario = {
        id_user: usuario.id_user,
        nome: usuario.nome,
        email: usuario.email,
        id_permissao: usuario.id_permissao,
      };

      // Carrega a permissão e popula as flags na sessão
      const permissao = await Permissao.findByPk(usuario.id_permissao);
      if (permissao) {
        const p = permissao.get ? permissao.get({ plain: true }) : permissao;

        // Deriva "admin" e flags de sessão a partir dos campos de sala/usuário
        const isAdm = !!p.adm || !!(p.cadSala && p.cadUser && p.edUser && p.arqUser && p.arqSala && p.edSalas);
        req.session.usuario.isAdm = isAdm;

        if (isAdm) {
          req.session.usuario.permissaoBlocos = true;
          req.session.usuario.permissaoAndares = true;
          req.session.usuario.permissaoTipoMesa = true;
          req.session.usuario.permissaoTipoSala = true;
          req.session.usuario.permissaoPermissoes = true;
        } else {
          req.session.usuario.permissaoTipoSala = !!(p.cadSala || p.edSalas || p.arqSala);
          req.session.usuario.permissaoPermissoes = !!(p.cadUser || p.edUser || p.arqUser);
          req.session.usuario.permissaoBlocos = false;
          req.session.usuario.permissaoAndares = false;
          req.session.usuario.permissaoTipoMesa = false;
        }

        req.session.usuario.temAcessoAdm = !!(
          req.session.usuario.permissaoBlocos ||
          req.session.usuario.permissaoAndares ||
          req.session.usuario.permissaoTipoMesa ||
          req.session.usuario.permissaoTipoSala ||
          req.session.usuario.permissaoPermissoes
        );
      }
      console.log('Sessão restaurada:', req.session.usuario);
    } else {
      console.log('Token inválido no cookie!');
    }
  }
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

      // Detecta ação pela rota/método
      const isDeleteAction =
        method === 'DELETE' ||
        /excluir|delete|deletar|arquivar|remover/i.test(path);

      const isEditAction =
        method === 'PUT' || method === 'PATCH' ||
        /editar|update/i.test(path);

      const isCreateAction =
        method === 'POST' &&
        !isDeleteAction && !isEditAction;

      // Validações por ação
      if (!p) {
        return res.status(403).render('error', { message: 'Você não tem acesso a essa função' });
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