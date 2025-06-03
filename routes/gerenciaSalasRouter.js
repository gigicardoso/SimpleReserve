const express = require('express');
const router = express.Router();
const salasController = require('../controllers/salasController');

router.get('/gerenciar-salas', salasController.listarSalas);
router.get('/salas/excluir/:cod', salasController.excluirSala);
router.get('/salas/editar/:cod', salasController.editarSalaForm);
router.post('/salas/editar/:cod', salasController.editarSala);

module.exports = router;