var express = require("express");
var router = express.Router();
const path = require("path");
const db = require("../db/db");
const tipoSalaController = require("../controllers/tipoSalaController");
const tipoMesaController = require("../controllers/tipoMesaController");
const blocosController = require("../controllers/blocosController");
const andarBlocoController = require("../controllers/andarBlocoController");
const usuariosController = require("../controllers/usuariosController");

/* Rota para Home */
router.get("/", (req, res) => {
  res.render("index", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isAgenda: true,
  });
});

// Para login
router.get("/login", (req, res) => {
  res.render(path.join(__dirname, "..", "views", "login.hbs"), {
    layout: "layout",
    showSidebar: false,
    showLogo: false,
  });
});

// Rota para cadastro de usuário
router.get("/cadastrousuario", (req, res) => {
  res.render("cadastroUsuarios", {
    layout: "layout",
    showSidebar: false, // não mostrar sidebar
    showLogo: false,    // não mostrar logo
    isCadastroUsuario: true,
  });
});

router.post("/cadastrousuario", usuariosController.criarUsuario);

router.get("/adm", (req, res) => {
  res.render("adm/gerenciadorAdm", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
  });
});

router.get("/tipoMesa", tipoMesaController.listarMesas);

router.get("/tipoSala", (req, res) => {
  res.render("adm/tipoSala", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
  });
});

router.get("/bloco", blocosController.listarBlocos);

router.get("/andares/:id_bloco", andarBlocoController.getAndaresPorBloco);
router.get("/andar", andarBlocoController.formCadastroAndar);
router.post("/andar", andarBlocoController.criarAndar);

router.get("/usuariosadm", (req, res) => {
  res.render("adm/usuariosAdm", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
  });
});

router.get("/reservasadm", (req, res) => {
  res.render("adm/reservas", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
  });
});

router.get("/salas", (req, res) => {
  res.render("adm/salas", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
  });
});

router.get("/reservasDoDia", (req, res) => {
  res.render("reservasDoDia", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isReservasDia: true,
  });
});


// ...rotas POST para criação de tipoSala, tipoMesa e bloco...
router.post("/tipoSala", tipoSalaController.criarTipoSala);
router.post("/tipoMesa", tipoMesaController.criarMesa);
router.post("/bloco", blocosController.criarBloco);

module.exports = router;
