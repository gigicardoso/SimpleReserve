const db = require("../db/db");

const Agenda = {
  create: (agenda, callback) => {
    const query = `
            INSERT INTO agenda 
            (nome_evento, descricao, data, hora_inicio, hora_final,id_user, id_salas) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(
      query,
      [
        agenda.nome_evento,
        agenda.descricao,
        agenda.data,
        agenda.hora_inicio,
        agenda.hora_final,
        agenda.id_user,
        agenda.id_salas,
      ],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results.insertId);
      }
    );
  },

  /* findById: (id, callback) => {
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
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },*/

  update: (id_agenda, agenda, callback) => {
    const query = `
            UPDATE agenda SET 
                nome_evento = ?, 
                descricao = ?, 
                data = ?, 
                hora_inicio = ?, 
                hora_final = ?, 
                id_user = ?, 
                id_salas = ?
            WHERE id_agenda = ?`;
    db.query(
      query,
      [
        agenda.nome_evento,
        agenda.descricao,
        agenda.data,
        agenda.hora_inicio,
        agenda.hora_final,
        agenda.id_user,
        agenda.id_salas,
      ],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  },

  delete: (id_agenda, callback) => {
    const query = "DELETE FROM agenda WHERE id_agenda = ?";
    db.query(query, [id_agenda], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  getAll: (callback) => {
    const query = `
            SELECT agenda.*, 
                   salas.nome_salas AS sala_nome, 
                   usuario.nome AS usuario_nome,
                   blocos.descricao AS bloco_nome,
                   andar_bloco.descricao AS andar_nome
            FROM agenda
            JOIN salas ON agenda.id_salas = salas.id_salas
            JOIN usuario ON agenda.id_user = usuario.id_user
            JOIN andar_bloco ON salas.id_andar = andar_bloco.id_andar
            JOIN blocos ON andar_bloco.id_bloco = blocos.id_bloco`;
    db.query(query, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
};

module.exports = Agenda;
