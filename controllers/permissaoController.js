const Permissao = require("../models/permissaoModel");

// +++ NOVO: mapa de chaves legadas -> flags da sessão
function mapKeyToSessionFlag(key) {
  const map = {
    // chaves legadas que podem estar nas rotas
    cadUser: "permissaoPermissoes",
    cadSala: "permissaoTipoSala",
    edUser: "permissaoPermissoes",
    arqUser: "permissaoPermissoes",
    arqSala: "permissaoTipoSala",
    edSalas: "permissaoTipoSala",
    // chaves atuais
    cadBlocos: "permissaoBlocos",
    cadAndares: "permissaoAndares",
    cadTipoMesa: "permissaoTipoMesa",
    cadTipoSala: "permissaoTipoSala",
    cadPermissoes: "permissaoPermissoes",
  };
  return map[key] || key;
}

// +++ NOVO: middleware exportado para uso nas rotas
exports.verificarPermissao = (chave) => (req, res, next) => {
  const u = req.session && req.session.usuario;
  const flag = mapKeyToSessionFlag(chave);
  if (!u || !u[flag]) {
    return res.status(403).render("error", { message: "Você não tem acesso a essa função" });
  }
  next();
};

// +++ NOVO: helpers para validar e para contexto nas views
// Ajuste: retornar true quando bloquear (após render), false quando permitir
async function requirePermissoes(req, res) {
  try {
    const u = req.session && req.session.usuario;
    if (!u) {
      res.status(403).render("error", { message: "Você não tem acesso a essa função", alert: true });
      return true;
    }
    const pInst = await Permissao.findByPk(u.id_permissao);
    const p = pInst && (pInst.get ? pInst.get({ plain: true }) : pInst);
    const permitido = !!(p && (p.adm || p.cadUser || p.edUser || p.arqUser));
    if (!permitido) {
      res.status(403).render("error", { message: "Você não tem acesso a essa função", alert: true });
      return true;
    }
    return false;
  } catch (e) {
    res.status(500).render("error", { message: "Erro ao verificar permissão", alert: true });
    return true;
  }
}
function permsCtx(req) {
  const u = (req.session && req.session.usuario) || {};
  return {
    podeBlocos: !!u.permissaoBlocos,
    podeAndares: !!u.permissaoAndares,
    podeTipoMesa: !!u.permissaoTipoMesa,
    podeTipoSala: !!u.permissaoTipoSala,
    podePermissoes: !!u.permissaoPermissoes,
    temAcessoAdm: !!u.temAcessoAdm,
  };
}

// CONSULTA
exports.listarPermissoes = async (req, res) => {
  // Bloqueio por permissão
  if (await requirePermissoes(req, res)) return;
  try {
    const permissoes = await Permissao.findAll({ order: [['descricao', 'ASC']] });
    // Renderiza a tela única de permissões
    res.render("adm/permissoes", {
      permissoes,
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      breadcrumb: [
        { title: "Gerenciador ADM", path: "/adm" },
        { title: "Permissões", path: "/permissoes" },
      ],
      ...permsCtx(req),
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar permissao");
  }
};

// CRIAÇÃO
exports.criarPermissao = async (req, res) => {
  // Bloqueio por permissão
  if (await requirePermissoes(req, res)) return;
  try {
    const { descricao } = req.body;
    const isAdm = !!req.body.adm; // toggle "Adm"
    const novaPermissao = {
      descricao,
      cadSala: isAdm ? 1 : (req.body.cadSala ? 1 : 0),
      cadUser: isAdm ? 1 : (req.body.cadUser ? 1 : 0),
      edUser:  isAdm ? 1 : (req.body.edUser ? 1 : 0),
      arqUser: isAdm ? 1 : (req.body.arqUser ? 1 : 0),
      arqSala: isAdm ? 1 : (req.body.arqSala ? 1 : 0),
      edSalas: isAdm ? 1 : (req.body.edSalas ? 1 : 0),
      ...(typeof Permissao.rawAttributes?.adm !== 'undefined' ? { adm: isAdm ? 1 : 0 } : {})
    };
    await Permissao.create(novaPermissao);
    return res.redirect('/permissoes'); // <- volta para a rota base do router
  } catch (error) {
    res.status(500).send('Erro ao criar permissão');
  }
};

// UPDATE
exports.atualizarPermissao = async (req, res) => {
  // Bloqueio por permissão
  if (await requirePermissoes(req, res)) return;
  try {
    const { id_permissao } = req.params;
    const isAdm = !!req.body.adm;

    await Permissao.update(
      isAdm
        ? {
            cadSala: 1,
            cadUser: 1,
            edUser: 1,
            arqUser: 1,
            arqSala: 1,
            edSalas: 1,
            ...(typeof Permissao.rawAttributes?.adm !== 'undefined' ? { adm: 1 } : {})
          }
        : {
            cadSala: req.body.cadSala ? 1 : 0,
            cadUser: req.body.cadUser ? 1 : 0,
            edUser:  req.body.edUser ? 1 : 0,
            arqUser: req.body.arqUser ? 1 : 0,
            arqSala: req.body.arqSala ? 1 : 0,
            edSalas: req.body.edSalas ? 1 : 0,
            ...(typeof Permissao.rawAttributes?.adm !== 'undefined' ? { adm: 0 } : {})
          },
      { where: { id_permissao } }
    );
    return res.redirect("/permissoes"); // <- volta para a rota base do router
  } catch (error) {
    res.render("error", { message: "Erro ao atualizar permissões", error, alert: true });
  }
};

// DELETE
exports.deletarPermissao = async (req, res) => {
  // Bloqueio por permissão
  if (await requirePermissoes(req, res)) return;
  try {
    const permissao = await Permissao.findByPk(req.params.id);
    if (!permissao) return res.status(404).send("Permissao não encontrada");
    await permissao.destroy();
    return res.redirect('/permissoes'); // <- volta para a rota base do router
  } catch (error) {
    res.status(500).send("Erro ao deletar permissao");
  }
};
