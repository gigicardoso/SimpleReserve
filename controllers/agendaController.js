const Agenda = require('../models/agenda');

// Listar todas as reservas
exports.listar = (req, res) => {
    Agenda.getAll((err, reservas) => {
        if (err) return res.status(500).send('Erro ao buscar reservas');
        res.render('listaReservas', { reservas });
    });
};

// Exibir formulário de nova reserva
exports.formNova = (req, res) => {
    const db = require('../db/db');
    db.query(`
        SELECT salas.cod, salas.descricao, localizacao.numero
        FROM salas
        JOIN localizacao ON salas.localizacao = localizacao.cod
    `, (err, salas) => {
        if (err) return res.status(500).send('Erro ao buscar salas');
        res.render('novaReserva', { salas });
    });
};

// Criar nova reserva
exports.criar = (req, res) => {
    console.log('req.body:', req.body); // Mantenha esse log para ver o que chega
    const novaAgenda = {
        nome_evento: req.body.nome_evento,
        obs: req.body.obs,
        date: req.body.date,
        hora_inicio: req.body.hora_inicio,
        hora_final: req.body.hora_final,
        cod_usuarios: req.body.cod_usuarios,
        cod_salas: req.body.cod_salas
    };
    Agenda.create(novaAgenda, (err, insertId) => {
        if (err) return res.status(500).send('Erro ao criar reserva');
        res.redirect('/'); // Redireciona para a home após criar a reserva
    });
};

// Exibir detalhes de uma reserva
exports.detalhar = (req, res) => {
    Agenda.findById(req.params.cod, (err, reserva) => {
        if (err || !reserva) return res.status(404).send('Reserva não encontrada');
        res.render('detalheReserva', { reserva });
    });
};

// Excluir reserva
exports.excluir = (req, res) => {
    Agenda.delete(req.params.cod, (err) => {
        if (err) return res.status(500).send('Erro ao excluir reserva');
        res.redirect('/reservas');
    });
};

// Atualizar reserva
exports.atualizar = (req, res) => {
    const agendaAtualizada = {
        nome_evento: req.body.nome_evento,
        obs: req.body.obs,
        date: req.body.date,
        hora_inicio: req.body.hora_inicio,
        hora_final: req.body.hora_final,
        cod_usuarios: req.body.cod_usuarios,
        cod_salas: req.body.cod_salas
    };
    Agenda.update(req.params.cod, agendaAtualizada, (err) => {
        if (err) return res.status(500).send('Erro ao atualizar reserva');
        res.redirect('/reservas');
    });
};