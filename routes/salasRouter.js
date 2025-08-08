const express = require("express");
const router = express.Router();
const salasController = require("../controllers/salasController");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/salas");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString + "-" + file.originalname);
  },

  fileFilter: (req, file, cb) => {
    const extensao = ["image/jpeg", "image/jpg", "image/png"].find(
      (formatoAceito) => formatoAceito === file.mimetype
    );
    if (extensao) {
      return cb(null, true);
    }
    return cb(null, false);
  },
});
const upload = multer({ storage: storage });

router.post("/cadastrosala", upload.single("imagem_sala"), salasController.criarSala);
router.post("/editar/:id", upload.single("imagem_sala"), salasController.atualizarSala);

// Listar todas as salas (tela de gerenciamento)
router.get("/gerenciarsalas", salasController.listarSalas);

// Criar nova sala
router.get("/cadastrosala", salasController.formCadastroSala);
router.post("/cadastrosala", salasController.criarSala);

// Atualizar sala
router.get("/editar/:id", salasController.formEditarSala);
router.post("/editar/:id", salasController.atualizarSala);

// Deletar sala
router.get("/excluir/:id", salasController.deletarSala);

//Exibir detalhes da sala na tela de gerenciamento de salas
router.get("/detalhes/:id", salasController.detalhesSala);

module.exports = router;
