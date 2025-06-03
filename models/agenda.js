const db = require('../db/db');

const Agenda = {
    create: (agenda, callback) => {
        const query = `
            INSERT INTO agenda 
            (nome_evento, obs, date, hora_inicio, hora_final, cod_usuarios, cod_salas) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(query, [
            agenda.nome_evento,
            agenda.obs,
            agenda.date,
            agenda.hora_inicio,
            agenda.hora_final,
            agenda.cod_usuarios,
            agenda.cod_salas
        ], (err, results) => {
            if (err) return callback(err);
            callback(null, results.insertId);
        });
    },

    findById: (cod, callback) => {
        const query = `
            SELECT agenda.*, 
                   salas.descricao AS sala_nome, 
                   usuario.nome AS usuario_nome,
                   localizacao.bloco AS localizacao_bloco,
                   localizacao.andar AS localizacao_andar,
                   localizacao.numero AS localizacao_numero
            FROM agenda
            JOIN salas ON agenda.cod_salas = salas.cod
            JOIN usuario ON agenda.cod_usuarios = usuario.cod
            JOIN localizacao ON salas.localizacao = localizacao.cod
            WHERE agenda.cod = ?`;
        db.query(query, [cod], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },

    update: (cod, agenda, callback) => {
        const query = `
            UPDATE agenda SET 
                nome_evento = ?, 
                obs = ?, 
                date = ?, 
                hora_inicio = ?, 
                hora_final = ?, 
                cod_usuarios = ?, 
                cod_salas = ?
            WHERE cod = ?`;
        db.query(query, [
            agenda.nome_evento,
            agenda.obs,
            agenda.date,
            agenda.hora_inicio,
            agenda.hora_final,
            agenda.cod_usuarios,
            agenda.cod_salas,
            cod
        ], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    delete: (cod, callback) => {
        const query = 'DELETE FROM agenda WHERE cod = ?';
        db.query(query, [cod], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    getAll: (callback) => {
        const query = `
            SELECT agenda.*, 
                   salas.descricao AS sala_nome, 
                   usuario.nome AS usuario_nome,
                   localizacao.bloco AS localizacao_bloco,
                   localizacao.andar AS localizacao_andar,
                   localizacao.numero AS localizacao_numero
            FROM agenda
            JOIN salas ON agenda.cod_salas = salas.cod
            JOIN usuario ON agenda.cod_usuarios = usuario.cod
            JOIN localizacao ON salas.localizacao = localizacao.cod`;
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
};

module.exports = Agenda;

