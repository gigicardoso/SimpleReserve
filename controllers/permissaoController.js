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

// Normalizador de boolean vindos do form (hidden + checkbox podem gerar array ou "on")
function normBool(v) {
  const val = Array.isArray(v) ? v[v.length - 1] : v;
  return val === '1' || val === 'on' || val === 1 || val === true;
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
    const novaPermissao = {
      descricao,
      cadSala: normBool(req.body.cadSala),
      cadUser: normBool(req.body.cadUser),
      edUser:  normBool(req.body.edUser),
      arqUser: normBool(req.body.arqUser),
      arqSala: normBool(req.body.arqSala),
      edSalas: normBool(req.body.edSalas),
      ...(typeof Permissao.rawAttributes?.adm !== 'undefined' ? { adm: normBool(req.body.adm) } : {})
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
    const { descricao } = req.body;
    const isAdmPosted = normBool(req.body.adm);

    // Monta os dados de atualização de forma determinística
    const updateData = {
      // Sempre atualiza a descrição (trim), se vier
      ...(typeof descricao === 'string' ? { descricao: descricao.trim() } : {}),
    };

    // Salva exatamente o que veio do formulário, sem forçar tudo com base no "adm"
    Object.assign(updateData, {
      cadSala: normBool(req.body.cadSala),
      cadUser: normBool(req.body.cadUser),
      edUser: normBool(req.body.edUser),
      arqUser: normBool(req.body.arqUser),
      arqSala: normBool(req.body.arqSala),
      edSalas: normBool(req.body.edSalas),
    });
    if (typeof Permissao.rawAttributes?.adm !== 'undefined') updateData.adm = isAdmPosted;

    // Força um UPDATE no banco mesmo que valores não sejam considerados "mudados" pelo Sequelize
    const [qtde] = await Permissao.update(updateData, { where: { id_permissao } });

    // Como fallback, se nada foi atualizado (qtde==0), tentamos via instância (caso o SGBD não detecte alteração)
    if (!qtde) {
      const p = await Permissao.findByPk(id_permissao);
      if (!p) {
        return res.status(404).render('error', { message: 'Permissão não encontrada' });
      }
      p.set(updateData);
      await p.save();
    }

    return res.redirect('/permissoes');
  } catch (error) {
    res.render('error', { message: 'Erro ao atualizar permissões', error, alert: true });
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
