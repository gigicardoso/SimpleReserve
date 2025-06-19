const express = require("express");
const router = express.Router();
const salasController = require("../controllers/salasController");

// Listar todas as salas (tela de gerenciamento)
router.get("/gerenciarsalas", salasController.listarSalas);

// Criar nova sala
router.get("/cadastrosala", (req, res) => {
  res.render("cadastroSala", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isCadastroSala: true,
  });
});

router.post("/cadastrosala", salasController.criarSala);

// Atualizar sala
router.post("/editar/:id", salasController.atualizarSala);

// Deletar sala
router.post("/excluir/:id", salasController.deletarSala);

module.exports = router;
