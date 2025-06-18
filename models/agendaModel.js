const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');
const Sala = require('./salasModel');
const Usuario = require('./usuariosModel');

const Agenda = sequelize.define('Agenda', {
  id_agenda: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_evento: DataTypes.STRING,
  descricao: DataTypes.STRING,
  data: DataTypes.DATEONLY,
  hora_inicio: DataTypes.TIME,
  hora_final: DataTypes.TIME,
  id_user: DataTypes.INTEGER,
  id_salas: DataTypes.INTEGER
}, {
  tableName: 'agenda',
  timestamps: false
});

// Relacionamentos
Agenda.belongsTo(Sala, { foreignKey: 'id_salas', as: 'sala' });
Agenda.belongsTo(Usuario, { foreignKey: 'id_user', as: 'usuario' });

module.exports = Agenda;
