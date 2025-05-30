var express = require("express");
var router = express.Router();
const path = require("path");
const db = require("../db/db");

/* Rota para Home */
router.get("/", (req, res) => {
  res.render(path.join(__dirname, "..", "views", "index.hbs"));
});

/* Rota para cadastro de sala */
router.get("/cadastrosala", (req, res) => {
  res.render(path.join(__dirname, "..", "views", "cadastroSala.hbs"));
});
router.get("/login", (req, res) => {
  res.render(path.join(__dirname, "..", "views", "login.hbs"));
});
module.exports = router;
