var express = require('express');
var router = express.Router();
const path = require('path');

/* Rota para Home */
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

/* Rota para cadastro de sala */
router.get('/cadastrosala', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'cadastroSala.html'));
});

module.exports = router;