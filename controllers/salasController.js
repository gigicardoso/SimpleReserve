const Sala = require("../models/salas");
const Localizacao = require("../models/localizacao");

exports.criarSala = async (req, res) => {
  try {
    console.log('req.body:', req.body); // <-- Adicione esta linha

    // 1. Cria a localização
    const localizacao = await Localizacao.create({
      bloco: req.body.bloco,
      andar: req.body.andar,
      numero: req.body.numero,
    });

    // 2. Cria a sala usando o cod da localização
    const sala = await Sala.create({
      ...req.body,
      localizacao: localizacao.cod, // FK correta
    });

    res.redirect('/cadastrosala');
  } catch (error) {
    console.error(error); // <-- Adicione esta linha para ver o erro detalhado
    res.status(500).json({ error: error.message });
  }
};

exports.listarSalas = async (req, res) => {
  const salas = await Sala.findAll({ raw: true });
  const localizacoes = await Localizacao.findAll({ raw: true });

  // Junta as informações de localização em cada sala
  const salasComLocal = salas.map(sala => {
    const loc = localizacoes.find(l => l.cod === sala.localizacao);
    return {
      ...sala,
      numero: loc ? loc.numero : 'Sem número',
      bloco: loc ? loc.bloco : '',
      andar: loc ? loc.andar : ''
    };
  });

  res.render('gerenciarSalas', { salas: salasComLocal });
};

exports.excluirSala = async (req, res) => {
  await Sala.destroy({ where: { cod: req.params.cod } });
  res.redirect('/gerenciar-salas');
};

exports.editarSalaForm = async (req, res) => {
  const sala = await Sala.findByPk(req.params.cod);
  res.render('editarSala', { sala });
};

exports.editarSala = async (req, res) => {
  await Sala.update(req.body, { where: { cod: req.params.cod } });
  res.redirect('/gerenciar-salas');
};
