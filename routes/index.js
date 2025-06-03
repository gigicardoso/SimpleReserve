var express = require("express");
var router = express.Router();
const path = require("path");
const db = require("../db/db");
const Sala = require('../models/salas');

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
// Para login
router.get("/login", (req, res) => {
  res.render(path.join(__dirname, "..", "views", "login.hbs"), {
    layout: "layout",
    showSidebar: false,
    showLogo: false,
  });
});

// Rota para novaReserva.hbs
router.get("/novareserva", (req, res) => {
  res.render("novaReserva", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isNovaReserva: true,
  });
});

// Para cadastro de usuário (futura tela)
/*router.get("/cadastro", (req, res) => {
  res.render(path.join(__dirname, "..", "views", "cadastro.hbs"), {
    layout: "layout",
    showSidebar: false,
    showLogo: false,
  });
});*/

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

module.exports = router;
