const Agenda = require('../models/agendaModel');
const Sala = require('../models/salasModel');




exports.listarReservasDoDia = async (req, res) => {
  try {
    const id_user = req.session.usuario ? req.session.usuario.id_user : null;
    if (!id_user) {
      return res.redirect('/');
    }
    // Sempre usa a data de hoje
    const dataAtual = new Date().toISOString().slice(0, 10);
    const reservas = await Agenda.findAll({
      where: {
        id_user,
        data: dataAtual
      },
      include: [
        { model: Sala, as: 'sala' }
      ]
    });
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
exports.formEditarReservaDia = async (req, res) => {
  try {
    const { id } = req.params;
    const id_user = req.session.usuario ? req.session.usuario.id_user : null;
    if (!id_user) return res.redirect('/');
    const reserva = await Agenda.findOne({
      where: { id_agenda: id, id_user },
      include: [{ model: Sala, as: 'sala' }]
    });
    if (!reserva) return res.status(404).render('error', { message: 'Reserva não encontrada' });
    const salas = await Sala.findAll();
    res.render('novaReserva', {
      reserva,
      salas,
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isEdicao: true,
      erro: null
    });
  } catch (error) {
    console.error('Erro ao carregar formulário de edição:', error);
    res.render('error', { message: 'Erro ao carregar formulário de edição' });
  }
};

exports.editarReservaDia = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_evento, id_salas, data, hora_inicio, hora_final, descricao } = req.body;
    const id_user = req.session.usuario ? req.session.usuario.id_user : null;
    if (!id_user) return res.redirect('/');

    if (hora_final <= hora_inicio) {
      const reserva = await Agenda.findOne({
        where: { id_agenda: id, id_user },
        include: [{ model: Sala, as: 'sala' }]
      });
      const salas = await Sala.findAll();
      return res.render('novaReserva', {
        reserva: {
          ...reserva.dataValues,
          nome_evento,
          id_salas,
          data,
          hora_inicio,
          hora_final,
          descricao
        },
        salas,
        layout: 'layout',
        showSidebar: true,
        showLogo: true,
        isEdicao: true,
        erro: 'O horário de fim deve ser maior que o horário de início!'
      });
    }

    const reserva = await Agenda.findOne({ where: { id_agenda: id, id_user } });
    if (!reserva) return res.status(404).render('error', { message: 'Reserva não encontrada' });
    await reserva.update({ nome_evento, id_salas, data, hora_inicio, hora_final, descricao });
    res.redirect('/reservasDoDia?data=' + data);
  } catch (error) {
    console.error('Erro ao editar reserva:', error);
    res.render('error', { message: 'Erro ao editar reserva' });
  }
};
