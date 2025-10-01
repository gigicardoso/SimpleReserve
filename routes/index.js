var express = require("express");
var router = express.Router();
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
router.get("/mais/adicionaUsuario", (req, res) => {
  res.render("mais/adicionaUsuario", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    breadcrumb: [
      { title: 'Gerenciador ADM', path: '/adm' },
      { title: 'Gerenciador de Usuários', path: '/usuariosadm' },
      { title: 'Cadastrar Novo Usuário', path: '/mais/adicionaUsuario' }
    ]
  });
});

// Rota para Home 
router.get("/home", (req, res) => {
  res.render("index", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isAgenda: true,
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
router.get("/cadastrousuario", (req, res) => {
  res.render("cadastroUsuarios", {
    layout: "layout",
    showSidebar: false, 
    showLogo: false,    
    isCadastroUsuario: true,
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
router.get("/tipoMesa", tipoMesaController.listarMesas);

// Exclusão de tipo de mesa
router.get("/excluirMesa/:id", tipoMesaController.deletarMesa);

// Edição de tipo de mesa
router.get("/editarMesa/:id", tipoMesaController.formEditarMesa);
router.post("/editarMesa/:id", tipoMesaController.atualizarMesa);

// Listagem de tipos de sala
router.get("/tipoSala", tipoSalaController.listarTipoSalas);

// Exclusão de tipo de sala
router.get("/excluirTipoSala/:id", tipoSalaController.deletarTipoSala);

// Edição de tipo de sala
router.get("/editarTipoSala/:id", tipoSalaController.formEditarTipoSala);
router.post("/editarTipoSala/:id", tipoSalaController.atualizarTipoSala);

//Listagem de blocos
router.get("/bloco", blocosController.listarBlocos);
// Gerenciador de blocos
router.get("/bloco", (req, res) => {
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
router.get("/andares", andarBlocoController.listarAndar);
// Gerenciador de andares
router.get("/andares", (req, res) => {
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

router.get("/salas", (req, res) => {
  res.render("adm/salas", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
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

router.get("/mais/adicionaandar", (req, res) => {
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
  res.render('adm/permissoes', {
    layout: 'layout',
    showSidebar: true,
    showLogo: true,
    breadcrumb: [
      { title: 'Gerenciador ADM', path: '/adm' },
      { title: 'Permissões', path: '/permissoes' }
    ]
  });
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
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: process.env.GMAIL_ACCESS_TOKEN
    }
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
