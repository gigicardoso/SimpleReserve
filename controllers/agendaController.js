const { Op } = require("sequelize");
const Agenda = require("../models/agendaModel");
const Sala = require("../models/salasModel");
const Usuario = require("../models/usuariosModel");
const Permissao = require("../models/permissaoModel");

// Helper granular
async function getPerm(req) {
  const u = req.session && req.session.usuario;
  if (!u) return null;
  const p = await Permissao.findByPk(u.id_permissao);
  return p ? (p.get ? p.get({ plain: true }) : p) : null;
}
async function requireReservaPerm(req, res, campo) {
  try {
    const p = await getPerm(req);
    const isAdm = !!(p && p.adm);
    const ok = !!(p && (campo ? p[campo] : (p.cadReserva || p.edReserva || p.arqReserva)));
    if (!p || (!isAdm && !ok)) {
      res.status(403).render("error", { message: "Você não tem acesso a essa função", alert: true });
      return true;
    }
    return false;
  } catch (e) {
    res.status(500).render("error", { message: "Erro ao verificar permissão", alert: true });
    return true;
  }
}

//CONSULTA PARA VIEW DE RESERVAS (ADM)
exports.listarReservasAdm = async (req, res) => {
  // Acesso liberado para todos com pelo menos uma permissão = 1 (via middleware e/ou temAcessoAdm)
  const u = req.session && req.session.usuario;
  if (!u || !u.temAcessoAdm) {
    return res.status(403).render("error", { message: "Você não tem acesso a essa função" });
  }
  try {
    const reservas = await Agenda.findAll({
      include: [
        { model: Sala, as: "sala" },
        { model: Usuario, as: "usuario" },
      ],
    });
    const reservasFormatadas = reservas.map(r => ({
      id_agenda: r.id_agenda,
      nomeUsuario: r.usuario ? r.usuario.nome : '',
      nomeSala: r.sala ? r.sala.nome_salas : '',
      dataReserva: r.data,
      horaInicio: r.hora_inicio ? r.hora_inicio.slice(0,5) : '',
      horaFim: r.hora_final ? r.hora_final.slice(0,5) : '',
      nomeEvento: r.nome_evento || '',
      descricao: r.descricao || ''
    }));
    const isAdm = !!(u && u.isAdm);
    // Carrega listas para os filtros (usuários e salas)
    const usuariosListRaw = await Usuario.findAll({ attributes: ['nome'], order: [['nome','ASC']] });
    const salasListRaw = await Sala.findAll({ attributes: ['nome_salas'], order: [['nome_salas','ASC']] });
    const usuariosList = usuariosListRaw.map(x => x.nome);
    const salasList = salasListRaw.map(x => x.nome_salas);

    res.render('adm/reservas', {
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isGerenciador: true,
      breadcrumb: [
        { title: 'Gerenciador ADM', path: '/adm' },
        { title: 'Reservas', path: '/reservasadm' }
      ],
      reservas: reservasFormatadas,
      usuarios: usuariosList,
      salas: salasList,
      podeEditarReserva: isAdm,
      podeExcluirReserva: isAdm,
      isAdm
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar reservas: " + (error && error.message ? error.message : 'Erro desconhecido'));
  }
};

//CONSULTA PARA VIEW DE AGENDAMENTOS DO USUÁRIO (HOME)
exports.listarReservasUsuario = async (req, res) => {
  const u = req.session && req.session.usuario;
  if (!u) {
    return res.redirect('/');
  }
  try {
    // Busca permissão real do usuário
    const permissao = await Permissao.findByPk(u.id_permissao);
    
    // Na tela inicial (home), TODOS os usuários veem apenas suas próprias reservas
    const reservas = await Agenda.findAll({
      where: { id_user: u.id_user },
      include: [
        { model: Sala, as: "sala" },
        { model: Usuario, as: "usuario" },
      ],
      order: [['data', 'DESC'], ['hora_inicio', 'DESC']]
    });
    const reservasFormatadas = reservas.map(r => ({
      id_agenda: r.id_agenda,
      nomeUsuario: r.usuario ? r.usuario.nome : '',
      nomeSala: r.sala ? r.sala.nome_salas : '',
      dataReserva: r.data,
      horaInicio: r.hora_inicio ? r.hora_inicio.slice(0,5) : '',
      horaFim: r.hora_final ? r.hora_final.slice(0,5) : '',
      nomeEvento: r.nome_evento || '',
      descricao: r.descricao || ''
    }));
    const isAdm = !!(permissao && permissao.adm);
    res.render('index', {
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isAgenda: true,
      usuario: u,
      reservas: reservasFormatadas,
      podeEditarReserva: isAdm,
      podeExcluirReserva: isAdm
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar agendamentos: " + (error && error.message ? error.message : 'Erro desconhecido'));
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
  // Cadastro de reserva é público, não exige permissão administrativa
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
    //Validação: data não pode ser no passado
    const hoje = new Date().toISOString().slice(0, 10);
if (data < hoje) {
  const salas = await Sala.findAll();
  return res.render("novaReserva", {
    salas,
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isNovaReserva: true,
    erro: "Não é possível reservar para uma data passada!",
    valores: { id_salas, data, hora_inicio, hora_final, nome_evento, descricao }
  });
}

    // Verifica conflito de reserva para a mesma sala, data e sobreposição de horário
    // Há conflito se: (nova_inicio < existente_fim) E (nova_fim > existente_inicio)
    // Se uma termina exatamente quando a outra começa, NÃO há conflito
    const conflito = await Agenda.findOne({
      where: {
        id_salas,
        data,
        [Op.and]: [
          { hora_inicio: { [Op.lt]: hora_final } },   // reserva existente começa ANTES da nova terminar
          { hora_final: { [Op.gt]: hora_inicio } }     // reserva existente termina DEPOIS da nova começar
        ]
      }
    });
    if (conflito) {
      const Sala = require("../models/salasModel");
      const salas = await Sala.findAll();
      return res.render("novaReserva", {
        salas,
        layout: "layout",
        showSidebar: true,
        showLogo: true,
        isNovaReserva: true,
        erro: "Já existe uma reserva para esta sala neste horário!",
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
  if (await requireReservaPerm(req, res, 'edReserva')) return;
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
/*exports.deletarReserva = async (req, res) => {
  try {
    const agenda = await Agenda.findByPk(req.params.id);
    if (!agenda) return res.status(404).send("Agenda não encontrada");
    await agenda.destroy();
    res.send("Agenda deletada com sucesso");
  } catch (error) {
    console.error("Erro ao deletar reserva:", error);
    res.status(500).send("Erro ao deletar agenda");
  }
};*/

exports.deletarReserva = async (req, res) => {
  const u = req.session && req.session.usuario;
  const isAdm = !!(u && u.isAdm);
  
  try {
    const agenda = await Agenda.findByPk(req.params.id);
    if (!agenda) {
      if (req.method === "GET") {
        return res.status(404).render('error', { message: 'Reserva não encontrada' });
      }
      return res.status(404).json({ erro: "Reserva não encontrada" });
    }

    // Verifica se o usuário pode excluir: ou é admin ou é o dono da reserva
    if (!isAdm && agenda.id_user !== u.id_user) {
      if (req.method === 'GET') {
        return res.status(403).render('error', { message: 'Você não tem permissão para excluir esta reserva.' });
      }
      return res.status(403).json({ erro: 'Você não tem permissão para excluir esta reserva.' });
    }

    await agenda.destroy();
    // Se for GET, redireciona para a listagem
    if (req.method === "GET") {
      const origem = req.query.origem;
      if (origem === 'reservasadm') {
        return res.redirect("/reservas/reservasadm");
      }
      return res.redirect("/reservasDoDia");
    }
    // Se for DELETE, responde JSON
    res.status(200).json({ sucesso: true });
  } catch (error) {
    if (req.method === "GET") {
      const origem = req.query.origem;
      if (origem === 'reservasadm') {
        return res.redirect("/reservas/reservasadm?erro=Erro ao deletar reserva");
      }
      return res.redirect("/reservasDoDia?erro=Erro ao deletar reserva");
    }
    res.status(500).json({ erro: "Erro ao deletar reserva" });
  }
};


exports.verificarDisponibilidade = async (req, res) => {
  const { id_salas, data, hora_inicio, hora_final } = req.body || {};

  try {
    if (!id_salas || !data || !hora_inicio || !hora_final) {
      return res.status(400).json({ erro: 'Parâmetros insuficientes' });
    }

    // Busca TODAS as reservas que se sobrepõem ao intervalo informado
    // Há conflito se: (nova_inicio < existente_fim) E (nova_fim > existente_inicio)
    // Se uma termina exatamente quando a outra começa, NÃO há conflito
    const conflitos = await Agenda.findAll({
      where: {
        id_salas,
        data,
        [Op.and]: [
          { hora_inicio: { [Op.lt]: hora_final } },   // reserva existente começa ANTES da nova terminar
          { hora_final: { [Op.gt]: hora_inicio } }     // reserva existente termina DEPOIS da nova começar
        ]
      },
      order: [['hora_inicio','ASC']]
    });

    if (!conflitos || conflitos.length === 0) {
      return res.json({ disponivel: true });
    }

    // Calcula o intervalo efetivamente sobreposto (para o primeiro conflito)
    const c = conflitos[0];
    const overlapInicio = (hora_inicio > c.hora_inicio ? hora_inicio : c.hora_inicio).slice(0,5);
    const overlapFim = (hora_final < c.hora_final ? hora_final : c.hora_final).slice(0,5);

    return res.json({
      disponivel: false,
      conflitos: conflitos.map(r => ({
        id_agenda: r.id_agenda,
        inicio: r.hora_inicio ? r.hora_inicio.slice(0,5) : '',
        fim: r.hora_final ? r.hora_final.slice(0,5) : ''
      })),
      sobreposicao: { inicio: overlapInicio, fim: overlapFim }
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao verificar disponibilidade" });
  }
};

// Renderiza o formulário de edição
exports.formEditarReserva = async (req, res) => {
  const u = req.session && req.session.usuario;
  const isAdm = !!(u && u.isAdm);
  
  try {
    const agenda = await Agenda.findByPk(req.params.id);
    if (!agenda) return res.status(404).render('error', { message: 'Reserva não encontrada' });
    
    // Verifica se o usuário pode editar: ou é admin ou é o dono da reserva
    if (!isAdm && agenda.id_user !== u.id_user) {
      return res.status(403).render('error', { message: 'Você não tem permissão para editar esta reserva.' });
    }
    
    const salas = await Sala.findAll();
    const origem = req.query.origem;
    res.render('novaReserva', {
      reserva: agenda,
      salas,
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isEdicao: true,
      origem: origem,
      erro: null
    });
  } catch (error) {
    console.error('Erro ao carregar formulário de edição:', error);
    res.render('error', { message: 'Erro ao carregar formulário de edição' });
  }
};

// Atualiza a reserva
exports.editarReserva = async (req, res) => {
  const u = req.session && req.session.usuario;
  const isAdm = !!(u && u.isAdm);
  
  try {
    const { nome_evento, id_salas, data, hora_inicio, hora_final, descricao, origem } = req.body;
    const agenda = await Agenda.findByPk(req.params.id);
    if (!agenda) return res.status(404).render('error', { message: 'Reserva não encontrada' });

    // Verifica se o usuário pode editar: ou é admin ou é o dono da reserva
    if (!isAdm && agenda.id_user !== u.id_user) {
      return res.status(403).render('error', { message: 'Você não tem permissão para editar esta reserva.' });
    }

    // Validação: não permitir reserva no passado
    const hoje = new Date().toISOString().slice(0, 10);
    if (data < hoje) {
      const salas = await Sala.findAll();
      return res.render('novaReserva', {
        reserva: { ...agenda.dataValues, nome_evento, id_salas, data, hora_inicio, hora_final, descricao },
        salas,
        layout: 'layout',
        showSidebar: true,
        showLogo: true,
        isEdicao: true,
        origem: origem,
        erro: 'Não é possível reservar para uma data passada!'
      });
    }

    // Validação: horário final deve ser maior que o inicial
    if (hora_final <= hora_inicio) {
      const salas = await Sala.findAll();
      return res.render('novaReserva', {
        reserva: { ...agenda.dataValues, nome_evento, id_salas, data, hora_inicio, hora_final, descricao },
        salas,
        layout: 'layout',
        showSidebar: true,
        showLogo: true,
        isEdicao: true,
        origem: origem,
        erro: 'O horário de fim deve ser maior que o horário de início!'
      });
    }

    await agenda.update({ nome_evento, id_salas, data, hora_inicio, hora_final, descricao });
    
    if (origem === 'reservasadm') {
      return res.redirect('/reservas/reservasadm');
    }
    res.redirect('/home');
  } catch (error) {
    console.error('Erro ao editar reserva:', error);
    res.render('error', { message: 'Erro ao editar reserva' });
  }
};

// Listar histórico de reservas do usuário logado
exports.listarHistoricoUsuario = async (req, res) => {
  const u = req.session && req.session.usuario;
  if (!u) {
    return res.redirect('/');
  }
  try {
    // Busca apenas as reservas do usuário logado (sem exceção para admin aqui)
    const reservas = await Agenda.findAll({
      where: { id_user: u.id_user },
      include: [
        { model: Sala, as: "sala" },
        { model: Usuario, as: "usuario" },
      ],
      order: [['data', 'DESC'], ['hora_inicio', 'DESC']]
    });
    
    const reservasFormatadas = reservas.map(r => ({
      id_agenda: r.id_agenda,
      nomeUsuario: r.usuario ? r.usuario.nome : '',
      nomeSala: r.sala ? r.sala.nome_salas : '',
      dataReserva: r.data,
      horaInicio: r.hora_inicio ? r.hora_inicio.slice(0,5) : '',
      horaFim: r.hora_final ? r.hora_final.slice(0,5) : '',
      nomeEvento: r.nome_evento || '',
      descricao: r.descricao || ''
    }));
    
    res.render('historico', {
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isHistorico: true,
      reservas: reservasFormatadas
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).send("Erro ao buscar histórico: " + (error && error.message ? error.message : 'Erro desconhecido'));
  }
};
