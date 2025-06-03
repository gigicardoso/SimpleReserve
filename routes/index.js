var express = require("express");
var router = express.Router();
const path = require("path");
const db = require("../db/db");
const Sala = require('../models/salas');
const agendaController = require('../controllers/agendaController');
const salasController = require('../controllers/salasController');




/* Rota para Home */
router.get("/", (req, res) => {
  res.render("index", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isAgenda: true,
  });
});

/* Rota para cadastro de sala */
router.get("/cadastrosala", (req, res) => {
  res.render("cadastroSala", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isCadastroSala: true,
  });
});

router.post("/cadastrosala", salasController.criarSala);

// Para login
router.get("/login", (req, res) => {
  res.render("login", {
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

// Exemplo no router ou controller
router.get('/gerenciarsalas', async (req, res) => {
  const salas = await Sala.findAll({ raw: true });
  res.render('gerenciarSalas', {
    salas,
    layout: 'layout',
    showLogo: true,
    isGerenciarSalas: true,
    showSidebar: true
  });
});


router.get("/reservas", agendaController.listar);

module.exports = router;
