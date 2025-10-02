const express = require('express');
const router = express.Router();
const Sala = require('../models/salasModel');
const AndarBloco = require('../models/andarBlocoModel');
const Mesa = require('../models/tipoMesaModel');
const SalaTipo = require('../models/tipoSalaModel');
const Bloco = require('../models/blocosModel');

// Retorna todas as salas para pesquisa
router.get('/salas', async (req, res) => {
  try {
    const salas = await Sala.findAll({
      include: [
        { model: AndarBloco, as: 'andarSala', include: [{ model: Bloco, as: 'blocoAndar' }] },
        { model: Mesa, as: 'mesaSala' },
        { model: SalaTipo, as: 'tipoSala' }
      ]
    });
    // Mapeia para o formato esperado pelo frontend
    const resultado = salas.map(sala => ({
      id: sala.id_salas,
      nome: sala.nome_salas,
      tipo_sala: sala.tipoSala ? sala.tipoSala.descricao : '',
      bloco: sala.andarSala && sala.andarSala.blocoAndar ? sala.andarSala.blocoAndar.descricao : '',
      andar: sala.andarSala ? sala.andarSala.descricao : '',
      capacidade: sala.capacidade,
      tipo_mesa: sala.mesaSala ? sala.mesaSala.descricao : '',
      descricao: sala.descricao,
      imagem_url: sala.imagem_sala ? `/uploads/salas/${sala.imagem_sala}` : ''
    }));
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar salas' });
  }
});

module.exports = router;
