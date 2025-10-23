const express = require("express");
const router = express.Router();
const salasController = require("../controllers/salasController");
const auth = require("../middlewares/auth");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/salas");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Protege todas as rotas de salas com autenticação
router.use(auth);

// Listar todas as salas (tela de gerenciamento)
router.get("/gerenciarsalas", salasController.listarSalas);

// Criar nova sala
router.get("/cadastrosala", salasController.formCadastroSala);
router.post("/cadastrosala", upload.single("imagem_sala"), salasController.criarSala);

// Atualizar sala
router.get("/editar/:id", salasController.formEditarSala);
router.post("/editar/:id", upload.single("imagem_sala"), salasController.atualizarSala);

// Deletar sala
router.get("/excluir/:id", salasController.deletarSala);

//Exibir detalhes da sala na tela de gerenciamento de salas
router.get("/detalhes/:id", salasController.detalhesSala);

module.exports = router;
