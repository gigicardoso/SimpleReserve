const Agenda = require("../models/agenda");

exports.criarReserva = async (req, res) => {
  try {
    await Agenda.create({
      nome_evento: req.body.nome_evento,
      obs: req.body.obs,
      date: req.body.date,
      hora_inicio: req.body.hora_inicio,
      hora_final: req.body.hora_final,
      cod_usuarios: 1, // Troque pelo usuário logado se tiver autenticação
      cod_salas: req.body.cod_salas
    });

    res.redirect('/novareserva');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


