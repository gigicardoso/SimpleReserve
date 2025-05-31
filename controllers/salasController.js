const Sala = require('../models/salas');
const Localizacao = require('../models/localizacao');

exports.criarSala = async (req, res) => {
  try {
    // 1. Cria a localização
    const localizacao = await Localizacao.create({
      bloco: req.body.bloco,
      andar: req.body.andar,
      numero: req.body.numero
    });

    // 2. Cria a sala usando o cod da localização
    const sala = await Sala.create({
      ...req.body,
      localizacao: localizacao.cod // FK correta
    });

    res.status(201).json(sala);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listarSalas = async (req, res) => {
  try {
    const salas = await Sala.findAll();
    res.json(salas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};