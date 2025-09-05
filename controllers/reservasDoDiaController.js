const Agenda = require('../models/agendaModel');
const Sala = require('../models/salasModel');


// Isso aqui foi o copilor tentando fazer as coisa, deixei aqui caso tu queira usar :P


exports.listarReservasDoDia = async (req, res) => {
  try {
    const id_user = req.session.usuario ? req.session.usuario.id_user : null;
    if (!id_user) {
      return res.status(401).send('Usuário não autenticado');
    }
    // Data de hoje ou data selecionada
    const dataAtual = req.query.data || new Date().toISOString().slice(0, 10);
    const reservas = await Agenda.findAll({
      where: {
        id_user,
        data: dataAtual
      },
      include: [
        { model: Sala, as: 'sala' }
      ]
    });
    console.log('Reservas do usuário logado:', reservas.map(r => ({
      nome_evento: r.nome_evento,
      sala: r.sala ? r.sala.nome_salas : null,
      data: r.data,
      hora_inicio: r.hora_inicio,
      hora_final: r.hora_final
    })));
    res.render('reservasDoDia', {
      reservas,
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isReservasDia: true,
      dataAtual
    });
  } catch (error) {
    console.error('Erro ao buscar reservas do dia:', error);
    res.render('error', { message: 'Erro ao buscar reservas do dia' });
  }
};
