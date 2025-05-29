var express = require("express");
var router = express.Router();
const path = require("path");
const db = require("../db/db");

/* Rota para Home */
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

/* Rota para cadastro de sala */
router.get("/cadastrosala", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "cadastroSala.html"));
});
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});
module.exports = router;
