var express = require("express");
var router = express.Router();
const path = require("path");
const db = require("../db/db");
const Sala = require('../models/salasModel');

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
/*router.get("/cadastrosala", (req, res) => {
  res.render("cadastroSala", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isCadastroSala: true,
  });
});*/
// Para login
router.get("/login", (req, res) => {
  res.render(path.join(__dirname, "..", "views", "login.hbs"), {
    layout: "layout",
    showSidebar: false,
    showLogo: false,
  });
});

// Rota para novaReserva.hbs
/*router.get("/novareserva", (req, res) => {
  res.render("novaReserva", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isNovaReserva: true,
  });
});*/

// Rota para cadastro de usuário
router.get("/cadastrousuario", (req, res) => {
  res.render("cadastroUsuarios", {
    layout: "layout",
    showSidebar: false, // não mostrar sidebar
    showLogo: false,    // não mostrar logo
    isCadastroUsuario: true,
  });
});



router.get("/gerenciador", (req, res) => {
  res.render("adm/gerenciadorAdm", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
  });
});

router.get("/tipoMesa", (req, res) => {
  res.render("adm/tipoMesa", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
  });
});

router.get("/tipoSala", (req, res) => {
  res.render("adm/tipoSala", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
  });
});

router.get("/bloco", (req, res) => {
  res.render("adm/bloco", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
  });
});
module.exports = router;
