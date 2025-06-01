var express = require("express");
var router = express.Router();
const path = require("path");
const db = require("../db/db");

/* Rota para Home */
router.get("/", (req, res) => {
  res.render(path.join(__dirname, "..", "views", "index.hbs"), {
    layout: "layout",
    showSidebar: true,
  });
});

/* Rota para cadastro de sala */
router.get("/cadastrosala", (req, res) => {
  res.render(path.join(__dirname, "..", "views", "cadastroSala.hbs"), {
    layout: "layout",
    showSidebar: true,
  });
});
// Para login
router.get("/login", (req, res) => {
  res.render(path.join(__dirname, "..", "views", "login.hbs"), {
    layout: "layout",
    showSidebar: false,
  });
});

// Para cadastro de usuário (futura tela)
/*router.get("/cadastro", (req, res) => {
  res.render(path.join(__dirname, "..", "views", "cadastro.hbs"), {
    layout: "layout",
    showSidebar: false,
  });
});*/

module.exports = router;
