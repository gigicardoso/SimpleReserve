const Usuario = require("../models/usuariosModel");
const Permissao = require("../models/permissaoModel");
const bcrypt = require("bcrypt");

// Helper para contexto de permissões nas views
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

// Helper para checar permissão de ação sobre usuários
async function requireUserPerm(req, res, campoNecessario) {
  try {
    const p = await Permissao.findByPk(req.session.usuario.id_permissao);
    const perm = p && (p.get ? p.get({ plain: true }) : p);
    const isAdm = !!(perm && perm.adm);
    const ok = !!(perm && perm[campoNecessario]);
    if (!perm || (!isAdm && !ok)) {
      res.status(403).render("error", { message: "Você não tem acesso a essa função", alert: true });
      return true; // bloqueado
    }
    return false; // permitido
  } catch (e) {
    console.error("Erro ao verificar permissão de usuário:", e);
    res.status(500).render("error", { message: "Erro ao verificar permissão", alert: true });
    return true;
  }
}

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  const u = req.session && req.session.usuario;
  if (!u) {
    return res.status(403).render("error", { message: "Você não tem acesso a essa função", alert: true });
  }
  // Exige permissão de gerenciamento de usuários (adm OU cadUser/edUser/arqUser)
  const pInst = await Permissao.findByPk(u.id_permissao);
  const p = pInst && (pInst.get ? pInst.get({ plain: true }) : pInst);
  const permitido = !!(p && (p.adm || p.cadUser || p.edUser || p.arqUser));
  if (!permitido) {
    return res.status(403).render("error", { message: "Você não tem acesso a essa função", alert: true });
  }

  try {
    const usuarios = await Usuario.findAll();
    res.render("adm/usuariosAdm", {
      usuarios,
      podeCadastrarUsuario: !!(p && (p.adm || p.cadUser)),
      podeEditarUsuario: !!(p && (p.adm || p.edUser)),
      podeExcluirUsuario: !!(p && (p.adm || p.arqUser)),
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isGerenciador: true,
      breadcrumb: [
        { title: "Gerenciador ADM", path: "/adm" },
        { title: "Gerenciador de Usuários", path: "/usuariosadm" },
      ],
      ...permsCtx(req),
    });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).send("Erro ao buscar usuários");
  }
};

// Criar usuário
exports.criarUsuario = async (req, res) => {
  // Identifica se é fluxo ADM (usuário logado) ou público (sem sessão)
  const isAdminFlow = !!(req.session && req.session.usuario);
  // Fluxo ADM: somente se houver usuário logado exigimos permissão
  if (isAdminFlow) {
    if (await requireUserPerm(req, res, 'cadUser')) return;
  }
  try {
    const { nome, email, senha, senha2 } = req.body;
    let { id_permissao } = req.body;
    // Se o cadastro vier da tela pública (sem id_permissao), use uma permissão padrão
    if (!id_permissao) {
      // Procura por uma permissão "Usuário" zerada; se não existir, cria uma nova
      const PermissaoModel = require('../models/permissaoModel');
      let padrao = await PermissaoModel.findOne({ where: { descricao: 'Usuário' } });
      if (!padrao) {
        // Cria uma nova permissão "Usuário" com todas as flags zeradas
        padrao = await PermissaoModel.create({
          descricao: 'Usuário',
          adm: false,
          cadUser: false,
          edUser: false,
          arqUser: false,
          cadSala: false,
          edSalas: false,
          arqSala: false
        });
      }
      id_permissao = padrao.id_permissao;
    }
    if (senha !== senha2) {
      if (isAdminFlow) {
        const permissoes = await Permissao.findAll({ order: [['descricao', 'ASC']] });
        return res.render('mais/adicionaUsuario', {
          layout: 'layout',
          showSidebar: true,
          showLogo: true,
          permissoes,
          erro: 'Senhas não conferem.',
          valores: { nome, email, id_permissao }
        });
      } else {
        return res.render('cadastroUsuarios', {
          erro: 'Senhas não conferem.',
          valores: { nome, email },
          layout: 'layout',
          showSidebar: false,
          showLogo: false
        });
      }
    }
    const hash = await bcrypt.hash(senha, 10);
    await Usuario.create({ nome, email, senha: hash, id_permissao });
    // Sucesso: ADM volta para lista de usuários; público vai para login
    return res.redirect(isAdminFlow ? '/usuariosadm' : '/');
  } catch (error) {
    const { nome, email, id_permissao } = req.body || {};
    if (isAdminFlow) {
      const permissoes = await Permissao.findAll({ order: [['descricao', 'ASC']] });
      return res.render('mais/adicionaUsuario', {
        layout: 'layout',
        showSidebar: true,
        showLogo: true,
        permissoes,
        erro: 'Erro ao cadastrar usuário.',
        valores: { nome, email, id_permissao }
      });
    } else {
      return res.render('cadastroUsuarios', {
        erro: 'Erro ao cadastrar usuário.',
        valores: { nome, email },
        layout: 'layout',
        showSidebar: false,
        showLogo: false
      });
    }
  }
};

//UPDATE
exports.editarUsuario = async (req, res) => {
  // exige permissão para editar usuário
  if (await requireUserPerm(req, res, 'edUser')) return;
  try {
    const { nome, email, senha, id_permissao } = req.body;
    const id = req.params.id;
    const updateData = { nome, email, id_permissao };
    if (senha && senha.trim() !== "") {
      const hash = await bcrypt.hash(senha, 10);
      updateData.senha = hash;
    }
    await Usuario.update(updateData, { where: { id_user: id } });
    res.redirect("/usuariosadm");
  } catch (err) {
    console.error("Erro ao editar usuário:", err);
    res.status(500).send("Erro ao editar usuário");
  }
};

exports.formEditarUsuario = async (req, res) => {
  // exige permissão para editar usuário
  if (await requireUserPerm(req, res, 'edUser')) return;
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    const permissao = await Permissao.findByPk(usuario.id_permissao);
    const permissoes = await Permissao.findAll({ order: [['descricao', 'ASC']] });
    res.render("mais/adicionaUsuario", {
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isEdicaoUsuario: true,
      usuarioForm: usuario,
      permissao,
      permissoes, // popular <select> com descricao
      breadcrumb: [
        { title: "Gerenciador ADM", path: "/adm" },
        { title: "Gerenciador de Usuários", path: "/usuariosadm" },
        { title: "Editar Usuário", path: `/editarUsuario/${usuario.id_user}` },
      ],
      ...permsCtx(req),
    });
  } catch (err) {
    res.render("error", { message: "Erro ao carregar usuário." });
    console.error("Erro ao carregar usuário:", err);
  }
};

//DELETE
exports.deletarUsuario = async (req, res) => {
  // exige permissão para arquivar/excluir usuário
  if (await requireUserPerm(req, res, 'arqUser')) return;
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).send("Usuario não encontrado");
    await usuario.destroy();
    res.redirect("/usuariosadm");
  } catch (error) {
    res.status(500).send("Erro ao deletar usuario");
  }
};

//login
exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.render("login", { erro: "Usuário inválido" });
    }

    const senhaOk = await bcrypt.compare(senha, usuario.senha);
    if (!senhaOk) {
      return res.render("login", { erro: "Senha inválida" });
    }

    const permissao = await Permissao.findByPk(usuario.id_permissao);
    req.session.usuario = {
      id_user: usuario.id_user,
      nome: usuario.nome,
      email: usuario.email,
      id_permissao: usuario.id_permissao,
    };

    // Deriva "admin" e flags de sessão a partir dos campos de permissão
    const p = permissao && (permissao.get ? permissao.get({ plain: true }) : permissao);
    const isAdm = !!(p && p.adm);
    req.session.usuario.isAdm = isAdm;

    if (isAdm) {
      req.session.usuario.permissaoBlocos = true;
      req.session.usuario.permissaoAndares = true;
      req.session.usuario.permissaoTipoMesa = true;
      req.session.usuario.permissaoTipoSala = true;
      req.session.usuario.permissaoPermissoes = true;
    } else {
      // Acesso a Tipo de Sala (gestão de salas) quando tiver qualquer permissão relacionada a salas
      req.session.usuario.permissaoTipoSala = !!(p && (p.cadSala || p.edSalas || p.arqSala));
      // Acesso à gestão de permissões/usuários quando tiver qualquer permissão relacionada a usuários
      req.session.usuario.permissaoPermissoes = !!(p && (p.cadUser || p.edUser || p.arqUser));
      // Demais áreas (blocos/andares/tipo mesa) restritas para não-admin
      req.session.usuario.permissaoBlocos = false;
      req.session.usuario.permissaoAndares = false;
      req.session.usuario.permissaoTipoMesa = false;
    }

    // Tem acesso ao Gerenciador ADM se possuir qualquer permissão relevante ou for admin
    // Inclui ReservaAdm para permitir acesso de quem só pode ver reservas
    req.session.usuario.temAcessoAdm = !!(p && (
      p.adm ||
      p.cadSala || p.edSalas || p.arqSala ||
      p.cadUser || p.edUser || p.arqUser ||
      p.ReservaAdm
    ));

    res.redirect("/home");
  } catch (error) {
    res.render("login", { erro: "Erro ao fazer login" });
  }
};

exports.logout = async (req, res) => {
  // Remove apenas a sessão; função "mantenha-me conectado" desativada
  req.session.destroy(() => {
    res.redirect("/");
  });
};

// Formulário de cadastro de usuário (GET)
exports.formCadastroUsuario = async (req, res) => {
  try {
    const permissoes = await Permissao.findAll({ order: [['descricao', 'ASC']] });
    res.render("cadastroUsuarios", {
      permissoes,
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      breadcrumb: [
        { title: "Gerenciador ADM", path: "/adm" },
        { title: "Gerenciador de Usuários", path: "/usuariosadm" },
        { title: "Cadastrar Usuário", path: "/cadastroUsuarios" }
      ],
      ...permsCtx(req),
    });
  } catch (error) {
    res.render("error", { message: "Erro ao carregar permissões." });
  }
};


