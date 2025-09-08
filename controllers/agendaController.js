const { Op } = require("sequelize");
const Agenda = require("../models/agendaModel");
const Sala = require("../models/salasModel");
const Usuario = require("../models/usuariosModel");

//CONSULTA PARA VIEW DE RESERVAS
exports.listarReservasAdm = async (req, res) => {
  try {
    const reservas = await Agenda.findAll({
      include: [
        { model: Sala, as: "sala" },
        { model: Usuario, as: "usuario" },
      ],
    });
    // Formata os dados para a view
    const reservasFormatadas = reservas.map(r => ({
      nomeUsuario: r.usuario ? r.usuario.nome : '',
      nomeSala: r.sala ? r.sala.nome_salas : '',
      dataReserva: r.data,
      horaInicio: r.hora_inicio ? r.hora_inicio.slice(0,5) : '',
      horaFim: r.hora_final ? r.hora_final.slice(0,5) : '',
      nomeEvento: r.nome_evento || '',
      descricao: r.descricao || ''
    }));
    console.log('RESERVAS FORMATADAS:', reservasFormatadas);
    res.render('adm/reservas', {
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isGerenciador: true,
      breadcrumb: [
        { title: 'Gerenciador ADM', path: '/adm' },
        { title: 'Reservas', path: '/reservasadm' }
      ],
      reservas: reservasFormatadas
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar reservas", error);
  }
};

//Renderiza o formulário de nova reserva
exports.formNovaReserva = async (req, res) => {
  try {
    // Carrega as salas disponíveis para selecionar na reserva
    const salas = await Sala.findAll();
    res.render("novaReserva", {
      layout: "layout",
      salas
      // Você pode adicionar outros dados necessários para o formulário
    });
  } catch (error) {
    console.error("Erro ao carregar formulário de nova reserva:", error);
    res.render("error", { message: "Erro ao carregar formulário de nova reserva" });
  }
};

//CRIAÇÃO
exports.criarReserva = async (req, res) => {
  try {
    const { id_salas, data, hora_inicio, hora_final, nome_evento, descricao } = req.body;
    const id_user = req.session.usuario ? req.session.usuario.id_user : null;
    if (!id_user) {
      return res.status(401).send("Usuário não autenticado");
    }
    // Validação: horário final deve ser maior que o inicial
    if (hora_final <= hora_inicio) {
      // Busque as salas para renderizar novamente o formulário
      const Sala = require("../models/salasModel");
      const salas = await Sala.findAll();

      return res.render("novaReserva", {
        salas,
        layout: "layout",
        showSidebar: true,
        showLogo: true,
        isNovaReserva: true,
        erro: "O horário de fim deve ser maior que o horário de início!",
        // Você pode repassar os valores preenchidos para o formulário, se desejar
        valores: { id_salas, data, hora_inicio, hora_final, nome_evento, descricao }
      });
    }

    await Agenda.create({
      id_salas,
      data,
      hora_inicio,
      hora_final,
      nome_evento,
      descricao,
      id_user
    });

    res.redirect("/home");
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    res.render("novaReserva", {
      layout: "layout",
      erro: "Erro ao criar reserva. Tente novamente."
    });
  }
};

//UPDATE
exports.atualizarReserva = async (req, res) => {
  try {
    const agenda = await Agenda.findByPk(req.params.id);
    if (!agenda) return res.status(404).send("Reserva não encontrada");
    await agenda.update(req.body);
    res.json(agenda);
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    res.status(500).send("Erro ao atualizar agenda");
  }
};

//DELETE
exports.deletarReserva = async (req, res) => {
  try {
    const agenda = await Agenda.findByPk(req.params.id);
    if (!agenda) return res.status(404).send("Agenda não encontrada");
    await agenda.destroy();
    res.send("Agenda deletada com sucesso");
  } catch (error) {
    console.error("Erro ao deletar reserva:", error);
    res.status(500).send("Erro ao deletar agenda");
  }
};

exports.verificarDisponibilidade = async (req, res) => {
  const { id_salas, data, hora_inicio, hora_final } = req.body;

  try {
    const conflito = await Agenda.findOne({
      where: {
        id_salas,
        data,
        [Op.or]: [
          {
            hora_inicio: { [Op.between]: [hora_inicio, hora_final] }
          },
          {
            hora_final: { [Op.between]: [hora_inicio, hora_final] }
          },
          {
            [Op.and]: [
              { hora_inicio: { [Op.lte]: hora_inicio } },
              { hora_final: { [Op.gte]: hora_final } }
            ]
          }
        ]
      }
    });

    res.json({ disponivel: !conflito });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao verificar disponibilidade" });
  }
};
