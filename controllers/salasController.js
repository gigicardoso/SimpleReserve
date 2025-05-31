const Sala = require('../models/salas');

exports.criarSala = async (req, res) => {
  try {
    const sala = await Sala.create(req.body);
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