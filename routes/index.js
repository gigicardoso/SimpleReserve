var express = require("express");
var router = express.Router();
// Rota para tela de pesquisa de salas
const Sala = require("../models/salasModel");
const AndarBloco = require("../models/andarBlocoModel");
const Bloco = require("../models/blocosModel");
const { sendMail, isConfigured } = require('../config/mailer');
const crypto = require('crypto');
router.get("/pesquisar", async (req, res) => {
  // Busca blocos e andares cadastrados
  const blocos = await Bloco.findAll();
  const andares = await AndarBloco.findAll();
  res.render("pesquisar", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isPesquisar: true,
    blocos: blocos.map(b => b.descricao),
    andares: andares.map(a => a.descricao)
  });
});
const path = require("path");
const db = require("../db/db");
const tipoSalaController = require("../controllers/tipoSalaController");
const tipoMesaController = require("../controllers/tipoMesaController");
const agendaController = require("../controllers/agendaController");

const blocosController = require("../controllers/blocosController");
const andarBlocoController = require("../controllers/andarBlocoController");
const usuariosController = require("../controllers/usuariosController");
const auth = require("../middlewares/auth");
const { verificarPermissao } = require("../middlewares/auth");
const { verificarGerenciadorAdm } = require("../middlewares/auth");

// Rota para histórico de reservas do usuário logado
router.get("/historico", auth, agendaController.listarHistoricoUsuario);

// Rota protegida para tela de reservas (visível para todos com acesso ao Gerenciador ADM)
router.get("/reservasadm", auth, verificarGerenciadorAdm, (req, res) => {
  res.render("adm/reservas", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
    breadcrumb: [
      { title: "Gerenciador ADM", path: "/adm" },
      { title: "Reservas", path: "/reservasadm" },
    ],
  });
});


// Rota para tela dedicada de cadastro de usuário (em /mais/adicionaUsuario)
router.get("/mais/adicionaUsuario", verificarPermissao('cadUser'), async (req, res) => {
  const permissoes = await require("../models/permissaoModel").findAll({ order: [["descricao", "ASC"]] });
  res.render("mais/adicionaUsuario", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    permissoes,
    // NÃO passa objeto 'usuario', indicando que é cadastro (não edição)
    breadcrumb: [
      { title: 'Gerenciador ADM', path: '/adm' },
      { title: 'Gerenciador de Usuários', path: '/usuariosadm' },
      { title: 'Cadastrar Novo Usuário', path: '/mais/adicionaUsuario' }
    ]
  });
});

// Rota para Home 
router.get("/home", auth, agendaController.listarReservasUsuario);

// Para login
router.get("/", (req, res) => {
  res.render(path.join(__dirname, "..", "views", "login.hbs"), {
    layout: "layout",
    showSidebar: false,
    showLogo: false,
  });
});

// API para checagem de duplicidade de tipo de sala
router.get("/api/tipoSala/check", tipoSalaController.checkDuplicado);

//teste login
router.post("/login", usuariosController.login);

router.get("/logout", usuariosController.logout);

// Rota para cadastro de usuário
router.get("/cadastrousuario", async (req, res) => {
  const permissoes = await require("../models/permissaoModel").findAll({ order: [["descricao", "ASC"]] });
  res.render("cadastroUsuarios", {
    layout: "layout",
    showSidebar: false, 
    showLogo: false,    
    isCadastroUsuario: true,
    permissoes
  });
});

router.post("/cadastrousuario", usuariosController.criarUsuario);

router.get("/adm", auth, verificarGerenciadorAdm, async (req, res) => {
  // Carrega as permissões atuais do usuário do banco
  const Permissao = require('../models/permissaoModel');
  const pInst = await Permissao.findByPk(req.session.usuario.id_permissao);
  const p = pInst ? (pInst.get ? pInst.get({ plain: true }) : pInst) : {};
  
  const isAdm = !!p.adm;
  const podeUsuarios = isAdm || !!(p.cadUser || p.edUser || p.arqUser);
  const podeSalas = isAdm || !!(p.cadSala || p.edSalas || p.arqSala);
  
  res.render("adm/gerenciadorAdm", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
    breadcrumb: [
      { title: 'Gerenciador ADM', path: '/adm' }
    ],
    // Flags para controlar visibilidade dos cards
    isAdm: isAdm,
    podeUsuarios: podeUsuarios,
    podeSalas: podeSalas,
    podeReservas: true, // Reservas liberadas para todos com acesso ao ADM
    usuario: req.session.usuario
  });
});

// Listagem de tipos de mesa
router.get("/tipoMesa", auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para acessar Tipo de Mesa.", layout: "layout", showSidebar: true, showLogo: true });
  }
  next();
}, tipoMesaController.listarMesas);

// Exclusão de tipo de mesa
router.get("/excluirMesa/:id", auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para excluir Tipo de Mesa.", layout: "layout", showSidebar: true, showLogo: true });
  }
  next();
}, tipoMesaController.deletarMesa);

// Edição de tipo de mesa
router.get("/editarMesa/:id", auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para editar Tipo de Mesa.", layout: "layout", showSidebar: true, showLogo: true });
  }
  next();
}, tipoMesaController.formEditarMesa);
router.post("/editarMesa/:id", auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para editar Tipo de Mesa.", layout: "layout", showSidebar: true, showLogo: true });
  }
  next();
}, tipoMesaController.atualizarMesa);

// Listagem de tipos de sala
router.get("/tipoSala", auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para acessar Tipo de Sala.", layout: "layout", showSidebar: true, showLogo: true });
  }
  next();
}, tipoSalaController.listarTipoSalas);

// Exclusão de tipo de sala
router.get("/excluirTipoSala/:id", auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para excluir Tipo de Sala.", layout: "layout", showSidebar: true, showLogo: true });
  }
  next();
}, tipoSalaController.deletarTipoSala);

// Edição de tipo de sala
router.get("/editarTipoSala/:id", auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para editar Tipo de Sala.", layout: "layout", showSidebar: true, showLogo: true });
  }
  next();
}, tipoSalaController.formEditarTipoSala);
router.post("/editarTipoSala/:id", auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para editar Tipo de Sala.", layout: "layout", showSidebar: true, showLogo: true });
  }
  next();
}, tipoSalaController.atualizarTipoSala);

//Listagem de blocos
router.get("/bloco", auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para acessar Blocos.", layout: "layout", showSidebar: true, showLogo: true });
  }
  next();
}, blocosController.listarBlocos);
// Gerenciador de blocos
router.get("/bloco", auth, (req, res) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para acessar Gerenciador de Blocos.", layout: "layout", showSidebar: true, showLogo: true });
  }
  res.render("adm/bloco", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    breadcrumb: [
      { title: "Gerenciador ADM", path: "/adm" },
      { title: "Gerenciador de blocos", path: "/bloco" },
    ],
  });
});

//Exclusão de bloco (somente ADM)
router.get("/excluirBloco/:id", auth, (req, res, next) => {
  if (!req.session.usuario || !req.session.usuario.isAdm) {
    return res.render('error', { message: 'Você não tem permissão para excluir Blocos.', layout: 'layout', showSidebar: true, showLogo: true });
  }
  next();
}, blocosController.deletarBloco);

//Edição de bloco (somente ADM)
router.get("/editarBloco/:id", auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para editar Blocos.", layout: "layout", showSidebar: true, showLogo: true });
  }
  next();
}, blocosController.formEditarBloco);
router.post("/editarBloco/:id", auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para editar Blocos.", layout: "layout", showSidebar: true, showLogo: true });
  }
  next();
}, blocosController.atualizarBloco);

//Listagem de andares
router.get("/andares", auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para acessar Andares.", layout: "layout", showSidebar: true, showLogo: true });
  }
  next();
}, andarBlocoController.listarAndar);
// Gerenciador de andares
router.get("/andares", auth, (req, res) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para acessar Gerenciador de Andares.", layout: "layout", showSidebar: true, showLogo: true });
  }
  res.render("adm/andar", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    breadcrumb: [
      { title: "Gerenciador ADM", path: "/adm" },
      { title: "Gerenciador de andares", path: "/andares" },
    ],
  });
});

//Exclusão de andar (somente ADM)
router.get("/excluirAndar/:id", auth, (req, res, next) => {
  if (!req.session.usuario || !req.session.usuario.isAdm) {
    return res.render('error', { message: 'Você não tem permissão para excluir Andares.', layout: 'layout', showSidebar: true, showLogo: true });
  }
  next();
}, andarBlocoController.deletarAndar);

//Edição de andar (somente ADM)
router.get("/editarAndar/:id", auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para editar Andares.", layout: "layout", showSidebar: true, showLogo: true });
  }
  next();
}, andarBlocoController.formEditarAndar);
router.post("/editarAndar/:id", auth, (req, res, next) => {
  if (!req.session.usuario.isAdm) {
    return res.render("error", { message: "Você não tem permissão para editar Andares.", layout: "layout", showSidebar: true, showLogo: true });
  }
  next();
}, andarBlocoController.atualizarAndar);

// Listar andares por bloco
router.get("/andares/:id_bloco", andarBlocoController.getAndaresPorBloco);

//Cadastro de andar
router.get("/andar", andarBlocoController.formCadastroAndar);
router.post("/andar", andarBlocoController.criarAndar);

// Listar usuários
router.get("/usuariosadm", usuariosController.listarUsuarios);

// Excluir usuário (requer permissão arqUser ou ADM)
router.get("/excluirUsuario/:id", auth, usuariosController.deletarUsuario);

// Edição de usuário - agora com middleware auth para que as verificações de permissão no controller sejam aplicadas
router.get("/editarUsuario/:id", auth, usuariosController.formEditarUsuario);
router.post("/editarUsuario/:id", auth, usuariosController.editarUsuario);

router.get("/salas", auth, (req, res) => {
  // Permissão: somente ADM ou quem tem alguma permissão de sala (cadSala/edSalas/arqSala)
  const u = req.session && req.session.usuario;
  if (!u || !(u.isAdm || u.permissaoTipoSala)) {
    return res.render('error', { message: 'Você não tem permissão para acessar Gerenciador de Salas.', layout: 'layout', showSidebar: true, showLogo: true });
  }
  const podeGerenciarSala = !!(u && (u.isAdm || u.permissaoTipoSala));
  res.render("adm/salas", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
    podeGerenciarSala,
    breadcrumb: [
      { title: "Gerenciador ADM", path: "/adm" },
      { title: "Salas", path: "/salas" },
    ],
  });
});

const reservasDoDiaController = require("../controllers/reservasDoDiaController");
router.get("/reservasDoDia", reservasDoDiaController.listarReservasDoDia);

// Rotas para tela de cadastro de bloco
router.get("/adicionabloco", (req, res) => {
  res.render("adm/adicionabloco", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isAdicionarBloco: true,
    breadcrumb: [
      { title: "Gerenciador ADM", path: "/adm" },
      { title: "Gerenciador de blocos", path: "/bloco" },
      { title: "Cadastrar novo bloco", path: "/adicionabloco" },
    ],
  });
});

const { sequelize } = require("../db/db");

router.get("/mais/adicionaandar", auth, (req, res) => {
  const u = req.session && req.session.usuario;
  if (!u || !(u.isAdm || u.permissaoAndares)) {
    return res.render('error', { message: 'Você não tem permissão para cadastrar andares.', layout: 'layout', showSidebar: true, showLogo: true });
  }
  sequelize
    .query("SELECT * FROM blocos", { type: sequelize.QueryTypes.SELECT })
    .then((results) => {
      res.render("mais/adicionaAndar", {
        layout: "layout",
        showSidebar: true,
        showLogo: true,
        blocos: results,
        isAdicionarAndar: true,
        breadcrumb: [
          { title: "Gerenciador ADM", path: "/adm" },
          { title: "Gerenciador de andares", path: "/andares" },
          { title: "Cadastrar Novo Andar", path: "/mais/adicionaandar" },
        ],
      });
    })
    .catch((err) => {
      res.status(500).send("Erro ao buscar blocos");
    });
});

router.get("/mais/adicionamesa", (req, res) => {
  sequelize
    .query("SELECT * FROM blocos", { type: sequelize.QueryTypes.SELECT })
    .then((results) => {
      res.render("mais/adicionaMesa", {
        layout: "layout",
        showSidebar: true,
        showLogo: true,
        blocos: results,
        isAdicionarAndar: true,
        breadcrumb: [
          { title: "Gerenciador ADM", path: "/adm" },
          { title: "Gerenciador de tipo de mesa", path: "/tipoMesa" },
          { title: "Cadastrar tipo de mesa", path: "/mais/adicionamesa" },
        ],
      });
    })
    .catch((err) => {
      res.status(500).send("Erro ao buscar cadastro de tipo de mesa");
    });
});

// Rota para cadastrar TIPO DE SALA (não sala!)
router.get("/mais/adicionatiposala", auth, (req, res) => {
  const u = req.session && req.session.usuario;
  if (!u || !(u.isAdm || u.permissaoTipoSala)) {
    return res.render('error', { message: 'Você não tem permissão para cadastrar tipos de sala.', layout: 'layout', showSidebar: true, showLogo: true });
  }
  res.render("mais/adicionaSala", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    breadcrumb: [
      { title: "Gerenciador ADM", path: "/adm" },
      { title: "Gerenciador de tipo de sala", path: "/tipoSala" },
      { title: "Cadastrar Tipo de Sala", path: "/mais/adicionatiposala" },
    ],
  });
});

// Rota para tela de permissões
router.get('/permissoes', auth, (req, res) => {
  if (!req.session.usuario.isAdm) {
    return res.render('error', { message: 'Você não tem permissão para acessar o Gerenciador de Permissões.', layout: 'layout', showSidebar: true, showLogo: true });
  }
  // Redireciona para o controller, que já popula as permissões
  require('../controllers/permissaoController').listarPermissoes(req, res);
});

//Edição de andares
router.get("/editarAndar/:id", andarBlocoController.formEditarAndar);
router.post("/editarAndar/:id", andarBlocoController.atualizarAndar);

//Edição dos blocos
router.get("/editarBloco/:id", blocosController.formEditarBloco);
router.post("/editarBloco/:id", blocosController.atualizarBloco);

// ...rotas POST para criação de tipoSala, tipoMesa e bloco...
router.post("/tipoSala", tipoSalaController.criarTipoSala);
router.post("/tipoMesa", tipoMesaController.criarMesa);
router.post("/bloco", blocosController.criarBloco);

// API para checagem de duplicidade de bloco
router.get('/api/blocos/check', blocosController.checkDuplicado);

// Rota para resetar senha
router.get('/resetar-senha', async (req, res) => {
  const { token, email } = req.query;
  const usuario = await require('../models/usuariosModel').findOne({ where: { email, token_recuperacao: token } });
  if (!usuario) return res.render('resetarSenha', { erro: 'Token inválido', layout: 'layout', showSidebar: false, showLogo: false });
  res.render('resetarSenha', { email, token, layout: 'layout', showSidebar: false, showLogo: false });
});

router.post('/resetar-senha', async (req, res) => {
  const { email, token, senha } = req.body;
  const usuario = await require('../models/usuariosModel').findOne({ where: { email, token_recuperacao: token } });
  if (!usuario) return res.render('resetarSenha', { erro: 'Token inválido', layout: 'layout' });
  usuario.senha = require('bcrypt').hashSync(senha, 10);
  usuario.token_recuperacao = null;
  await usuario.save();
  res.redirect('/');
});

router.get('/recuperar-senha', (req, res) => {
  res.render('recuperarSenha', { layout: 'layout', showSidebar: false, showLogo: false });
});

router.post('/recuperar-senha', async (req, res) => {
  const { email } = req.body;
  const usuario = await require('../models/usuariosModel').findOne({ where: { email } });
  if (!usuario) return res.render('recuperarSenha', { erro: 'E-mail não cadastrado', layout: 'layout', showSidebar: false, showLogo: false });

  // Gere um token simples (ideal: use JWT ou UUID)
  const token = crypto.randomBytes(32).toString('hex');
  usuario.token_recuperacao = token;
  await usuario.save();

  // Gera o link de recuperação
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const link = `${baseUrl}/resetar-senha?token=${token}&email=${encodeURIComponent(email)}`;

  // Tenta enviar o e-mail via OAuth2 (Gmail)
  const subject = 'Recuperação de Senha - Simple Reserve';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #84925b;">Simple Reserve - Recuperação de Senha</h2>
      <p>Olá,</p>
      <p>Você solicitou a recuperação de senha da sua conta.</p>
      <p>Para redefinir sua senha, clique no botão abaixo:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="background-color: #84925b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Redefinir Senha
        </a>
      </div>
      <p>Ou copie e cole este link no seu navegador:</p>
      <p style="color: #666; word-break: break-all;">${link}</p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        Se você não solicitou esta recuperação, ignore este e-mail.
      </p>
    </div>
  `;

  // Se mailer não estiver configurado, faça fallback sem tentar enviar (evita erro no log)
  if (!isConfigured()) {
    console.warn('[mailer] Não configurado. Enviando fallback com link.');
    return res.render('recuperarSenha', {
      erro: 'Não foi possível enviar o e-mail agora. Use o link temporário abaixo para continuar.',
      link,
      layout: 'layout',
      showSidebar: false,
      showLogo: false
    });
  }

  try {
    await sendMail({ to: email, subject, html });
    console.log('🔑 Link de recuperação de senha:', link);
    return res.render('recuperarSenha', {
      sucesso: 'E-mail enviado! Verifique sua caixa de entrada.',
      link, // Mantemos o link para facilitar testes em desenvolvimento
      layout: 'layout',
      showSidebar: false,
      showLogo: false
    });
  } catch (error) {
    console.error('Erro ao enviar e-mail (OAuth2):', error);
    // Fallback: exibe o link na tela para não bloquear o fluxo do usuário
    return res.render('recuperarSenha', {
      erro: 'Não foi possível enviar o e-mail agora. Use o link temporário abaixo para continuar.',
      link,
      layout: 'layout',
      showSidebar: false,
      showLogo: false
    });
  }
});

module.exports = router;
