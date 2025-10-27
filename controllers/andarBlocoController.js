const Bloco = require("../models/blocosModel");
const Andar = require("../models/andarBlocoModel");
const Permissao = require("../models/permissaoModel");

// Helpers
async function getPerm(req) {
  const u = req.session && req.session.usuario;
  if (!u) return null;
  const p = await Permissao.findByPk(u.id_permissao);
  return p ? (p.get ? p.get({ plain: true }) : p) : null;
}

// Checagem granular por ação
async function requireAndarPerm(req, res, campo) {
  try {
    const p = await getPerm(req);
    const isAdm = !!(p && p.adm);
    const ok = !!(p && (campo ? p[campo] : (p.cadAndares || p.edAndares || p.arqAndares)));
    if (!p || (!isAdm && !ok)) {
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

exports.formCadastroAndar = async (req, res) => {
  if (await requireAndarPerm(req, res, null)) return;
  const blocos = await Bloco.findAll();
  res.render("adm/andar", {
    blocos,
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
    ...permsCtx(req),
  });
};

//Exibe os andares de um bloco específico
exports.getAndaresPorBloco = async (req, res) => {
  if (await requireAndarPerm(req, res, null)) return;
  const { id_bloco } = req.params;
  const Andar = require("../models/andarBlocoModel");
  const andares = await Andar.findAll({ where: { id_bloco } });
  res.json(andares);
};

//CONSULTA
exports.listarAndar = async (req, res) => {
  if (await requireAndarPerm(req, res, null)) return;
  try {
    const andar = await Andar.findAll({
      include: [
        {
          model: Bloco,
          as: "blocoAndar",
        },
      ],
    });
    const blocos = await Bloco.findAll();

    res.render("adm/andar", {
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isGerenciador: true,
      andares: andar,
      blocos,
      ...permsCtx(req),
    });
  } catch (error) {
    console.error("Erro ao buscar andares:", error);
    res.status(500).send("Erro ao buscar andares");
  }
};

// CRIAÇÃO
exports.criarAndar = async (req, res) => {
  if (await requireAndarPerm(req, res, 'cadAndares')) return;
  try {
    const nome = req.body.descricao && req.body.descricao.trim();
    const id_bloco = req.body.id_bloco;
    const breadcrumb = [
      { title: 'Gerenciador ADM', path: '/adm' },
      { title: 'Gerenciador de Andares', path: '/andares' },
      { title: 'Cadastrar Andar', path: '' }
    ];
    if (!nome || !id_bloco) {
      return res.render("mais/adicionaAndar", {
        layout: "layout",
        erro: "Nome do andar e bloco são obrigatórios!",
        showSidebar: true,
        showLogo: true,
        breadcrumb,
        ...permsCtx(req),
      });
    }
    const duplicado = await Andar.findOne({
      where: { descricao: nome, id_bloco },
    });
    if (duplicado) {
      return res.render("mais/adicionaAndar", {
        layout: "layout",
        erro: `O andar '${nome}' já foi cadastrado para este bloco!`,
        showSidebar: true,
        showLogo: true,
        breadcrumb,
        ...permsCtx(req),
      });
    }
    await Andar.create({ descricao: nome, id_bloco });
    res.redirect("/andares");
  } catch (error) {
    res.status(500).send("Erro ao criar andar");
  }
};

// UPDATE
exports.atualizarAndar = async (req, res) => {
  if (await requireAndarPerm(req, res, 'edAndares')) return;
  try {
    const andar = await Andar.findByPk(req.params.id);
    if (!andar) return res.status(404).send("Andar não encontrado");
    await andar.update(req.body);
    res.redirect("/andares");
  } catch (error) {
    res.status(500).send("Erro ao atualizar andar");
  }
};

// DELETE
exports.deletarAndar = async (req, res) => {
  if (await requireAndarPerm(req, res, 'arqAndares')) return;
  try {
    const andar = await Andar.findByPk(req.params.id);
    if (!andar) return res.status(404).send("Andar não encontrado");
    await andar.destroy();
    res.redirect("/andares");
  } catch (error) {
    res.status(500).send("Erro ao deletar andar");
  }
};

// EDIÇÃO
exports.formEditarAndar = async (req, res) => {
  if (await requireAndarPerm(req, res, 'edAndares')) return;
  try {
    const andar = await Andar.findByPk(req.params.id, {
      include: [{ model: Bloco, as: "blocoAndar" }],
    });
    if (!andar) return res.status(404).send("Andar não encontrado");

    const blocos = await Bloco.findAll();
    res.render("mais/adicionaAndar", {
      andar,
      blocos,
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isGerenciador: true,
      ...permsCtx(req),
    });
  } catch (error) {
    console.error("Erro ao buscar andar:", error);
    res.status(500).send("Erro ao buscar andar");
  }
};
