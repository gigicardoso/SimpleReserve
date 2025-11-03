const TipoSala = require("../models/tipoSalaModel");
const Permissao = require("../models/permissaoModel");

// Helpers
async function getPerm(req) {
  const u = req.session && req.session.usuario;
  if (!u) return null;
  const p = await Permissao.findByPk(u.id_permissao);
  return p ? (p.get ? p.get({ plain: true }) : p) : null;
}

// Retorna true se bloqueou, false se permitido
async function requireSalaPerm(req, res, campo) {
  try {
    const p = await getPerm(req);
    const isAdm = !!(p && p.adm);
    const ok = !!(p && (campo ? p[campo] : (p.cadSala || p.edSalas || p.arqSala)));
    if (!p || (!isAdm && !ok)) {
      res.status(403).render("error", { message: "Você não tem acesso a essa função", alert: true });
      return true; // bloqueado
    }
    return false; // permitido
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

// CONSULTA (qualquer permissão de sala: cadSala OR edSalas OR arqSala, ou adm)
exports.listarTipoSalas = async (req, res) => {
  if (await requireSalaPerm(req, res, null)) return;
  try {
    const tipoSalas = await TipoSala.findAll();
    res.render('adm/tipoSala', {
      tipoSalas,
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isGerenciador: true,
      breadcrumb: [
        { title: 'Gerenciador ADM', path: '/adm' },
        { title: 'Gerenciador de tipo de sala', path: '/tipoSala' }
      ],
      ...permsCtx(req),
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar tipo de Salas");
  }
};

// CRIAÇÃO (exige cadSala)
exports.criarTipoSala = async (req, res) => {
  if (await requireSalaPerm(req, res, 'cadSala')) return;
  try {
    const nome = req.body.descricao && req.body.descricao.trim();
    const breadcrumb = [
      { title: 'Gerenciador ADM', path: '/adm' },
      { title: 'Gerenciador de tipo de sala', path: '/tipoSala' },
      { title: 'Cadastrar tipo de sala', path: '' }
    ];
    if (!nome) {
      return res.render("mais/adicionaSala", {
        layout: "layout",
        erro: "Nome do tipo de sala é obrigatório!",
        showSidebar: true,
        showLogo: true,
        breadcrumb,
        ...permsCtx(req),
      });
    }
    const duplicada = await TipoSala.findOne({ where: { descricao: nome } });
    if (duplicada) {
      return res.render("mais/adicionaSala", {
        layout: "layout",
        erro: `O tipo de sala '${nome}' já foi cadastrado!`,
        showSidebar: true,
        showLogo: true,
        breadcrumb,
        ...permsCtx(req),
      });
    }
    await TipoSala.create({ descricao: nome });
    res.redirect("/tipoSala");
  } catch (error) {
    res.status(500).send("Erro ao criar tipo de Sala");
  }
};

// API para checagem de duplicidade de tipo de sala (exige cadSala)
exports.checkDuplicado = async (req, res) => {
  if (await requireSalaPerm(req, res, 'cadSala')) return;
  try {
    const nome = req.query.nome;
    if (!nome) return res.json({ duplicado: false });
    const tipoSala = await TipoSala.findOne({ where: { descricao: nome } });
    res.json({ duplicado: !!tipoSala });
  } catch (err) {
    res.json({ duplicado: false });
  }
};

//UPDATE (exige edSalas)
exports.atualizarTipoSala = async (req, res) => {
  if (await requireSalaPerm(req, res, 'edSalas')) return;
  try {
    const tipoSala = await TipoSala.findByPk(req.params.id);
    if (!tipoSala) return res.status(404).send("Tipo de Sala não encontrada");
    await tipoSala.update(req.body);
    res.redirect("/tipoSala");
  } catch (error) {
    res.status(500).send("Erro ao atualizar tipo de Sala");
  }
};

// Form de edição (exige edSalas)
exports.formEditarTipoSala = async (req, res) => {
  if (await requireSalaPerm(req, res, 'edSalas')) return;
  try {
    const tipoSala = await TipoSala.findByPk(req.params.id);
    if (!tipoSala) return res.status(404).send("Tipo de Sala não encontrada");
    res.render("mais/adicionaSala", {
      tipoSala,
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isEditarTipoSala: true,
      ...permsCtx(req),
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar tipo de Sala");
  }
}

//DELETE (exige arqSala)
exports.deletarTipoSala = async (req, res) => {
  if (await requireSalaPerm(req, res, 'arqSala')) return;
  try {
    const tipoSala = await TipoSala.findByPk(req.params.id);
    if (!tipoSala) return res.status(404).send("Tipo de Sala não encontrada");
    
    // Verifica se há salas usando este tipo de sala
    const Sala = require("../models/salasModel");
    const salasUsando = await Sala.count({ where: { id_tipo: req.params.id } });
    
    // Se force=true, deleta mesmo com dependências
    if (req.query.force !== 'true' && salasUsando > 0) {
      const tipoSalas = await TipoSala.findAll();
      return res.render('adm/tipoSala', {
        tipoSalas,
        layout: 'layout',
        showSidebar: true,
        showLogo: true,
        isGerenciador: true,
        breadcrumb: [
          { title: 'Gerenciador ADM', path: '/adm' },
          { title: 'Gerenciador de tipo de sala', path: '/tipoSala' }
        ],
        ...permsCtx(req),
        alertaExclusao: {
          tipo: 'tipo de sala',
          nome: tipoSala.descricao,
          id: tipoSala.id_tipo,
          salas: salasUsando
        }
      });
    }
    
    await tipoSala.destroy();
    res.redirect("/tipoSala");
  } catch (error) {
    console.error("Erro ao deletar tipo de Sala:", error);
    res.status(500).send("Erro ao deletar tipo de Sala");
  }
};
