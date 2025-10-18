var express = require("express");
var router = express.Router();
// Rota para tela de pesquisa de salas
const Sala = require("../models/salasModel");
const AndarBloco = require("../models/andarBlocoModel");
const Bloco = require("../models/blocosModel");
router.get("/pesquisar", async (req, res) => {
  // Busca blocos e andares cadastrados
  const blocos = await Bloco.findAll();
  const andares = await AndarBloco.findAll();
  res.render("pesquisar", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isPesquisar: true,
    breadcrumb: [
      { title: "Gerenciador ADM", path: "/adm" },
      { title: "Pesquisa de Salas", path: "/pesquisar" }
    ],
    blocos: blocos.map(b => b.descricao),
    andares: andares.map(a => a.descricao)
  });
});
const path = require("path");
const db = require("../db/db");
const tipoSalaController = require("../controllers/tipoSalaController");
const tipoMesaController = require("../controllers/tipoMesaController");
// Rota para histórico de reservas
router.get("/historico", (req, res) => {
  // Aqui deve vir a consulta real do banco, exemplo:
  // db.query(...).then(reservas => {
  //   res.render("historico", { layout: "layout", reservas });
  // });
  res.render("historico", {
    layout: "layout",
    showSidebar: true,
    showLogo: true
  });
});
const blocosController = require("../controllers/blocosController");
const andarBlocoController = require("../controllers/andarBlocoController");
const usuariosController = require("../controllers/usuariosController");
const auth = require("../middlewares/auth");
const { verificarPermissao } = require("../middlewares/auth");

// Rota protegida para tela de reservas
router.get("/reservasadm", auth, (req, res) => {
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
    breadcrumb: [
      { title: 'Gerenciador ADM', path: '/adm' },
      { title: 'Gerenciador de Usuários', path: '/usuariosadm' },
      { title: 'Cadastrar Novo Usuário', path: '/mais/adicionaUsuario' }
    ]
  });
});

// Rota para Home 
router.get("/home", auth, (req, res) => {
  res.render("index", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isAgenda: true,
    usuario: req.session.usuario
  });
});

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

router.get("/adm", auth, (req, res) => {
  res.render("adm/gerenciadorAdm", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
    breadcrumb: [
      { title: 'Gerenciador ADM', path: '/adm' }
    ],
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

//Exclusão de andar
router.get("/excluirBloco/:id", blocosController.deletarBloco);

//Edição de andar
router.get("/editarBloco/:id", blocosController.formEditarBloco);
router.post("/editarBloco/:id", blocosController.atualizarBloco);

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

//Exclusão de andar
router.get("/excluirAndar/:id", andarBlocoController.deletarAndar);

//Edição de andar
router.get("/editarAndar/:id", andarBlocoController.formEditarAndar);
router.post("/editarAndar/:id", andarBlocoController.atualizarAndar);

// Listar andares por bloco
router.get("/andares/:id_bloco", andarBlocoController.getAndaresPorBloco);

//Cadastro de andar
router.get("/andar", andarBlocoController.formCadastroAndar);
router.post("/andar", andarBlocoController.criarAndar);

// Listar usuários
router.get("/usuariosadm", usuariosController.listarUsuarios);

// Excluir usuário
router.get("/excluirUsuario/:id", usuariosController.deletarUsuario);

// Edição de usuário
router.get("/editarUsuario/:id", usuariosController.formEditarUsuario);
router.post("/editarUsuario/:id", usuariosController.editarUsuario);

router.get("/reservasadm", (req, res) => {
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

router.get("/mais/adicionasala", auth, (req, res) => {
  const u = req.session && req.session.usuario;
  if (!u || !(u.isAdm || u.permissaoTipoSala)) {
    return res.render('error', { message: 'Você não tem permissão para cadastrar tipos de sala.', layout: 'layout', showSidebar: true, showLogo: true });
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

router.get("/mais/adicionasala", (req, res) => {
  sequelize
    .query("SELECT * FROM blocos", { type: sequelize.QueryTypes.SELECT })
    .then((results) => {
      res.render("mais/adicionaSala", {
        layout: "layout",
        showSidebar: true,
        showLogo: true,
        blocos: results,
        isAdicionarAndar: true,
        breadcrumb: [
          { title: "Gerenciador ADM", path: "/adm" },
          { title: "Gerenciador de tipo de sala", path: "/tipoSala" },
          { title: "Cadastrar Nova Sala", path: "/mais/adicionasala" },
        ],
      });
    })
    .catch((err) => {
      res.status(500).send("Erro ao buscar cadastro de Sala");
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
  if (!usuario) return res.render('resetarSenha', { erro: 'Token inválido', layout: 'layout' });
  res.render('resetarSenha', { email, token, layout: 'layout' });
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
  res.render('recuperarSenha', { layout: 'layout' });
});

router.post('/recuperar-senha', async (req, res) => {
  const { email } = req.body;
  const usuario = await require('../models/usuariosModel').findOne({ where: { email } });
  if (!usuario) return res.render('recuperarSenha', { erro: 'E-mail não cadastrado', layout: 'layout' });

  // Gere um token simples (ideal: use JWT ou UUID)
  const token = Math.random().toString(36).substr(2);
  usuario.token_recuperacao = token;
  await usuario.save();

  // Envie o e-mail
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'SEU_EMAIL@gmail.com', pass: 'SUA_SENHA' }
  });
  const link = `http://localhost:3000/resetar-senha?token=${token}&email=${email}`;
  await transporter.sendMail({
    from: 'SEU_EMAIL@gmail.com',
    to: email,
    subject: 'Recuperação de Senha',
    html: `<p>Para redefinir sua senha, clique <a href="${link}">aqui</a>.</p>`
  });

  res.render('recuperarSenha', { sucesso: 'E-mail enviado!', layout: 'layout' });
});

module.exports = router;
