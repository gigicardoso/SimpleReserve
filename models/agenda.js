const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

const Agenda = sequelize.define('Agenda', {
  cod: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_evento: {
    type: DataTypes.STRING(85),
    allowNull: false
  },
  obs: DataTypes.STRING(30),
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_final: {
    type: DataTypes.TIME,
    allowNull: false
  },
  cod_usuarios: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cod_salas: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'agenda',
  timestamps: false
});

module.exports = Agenda;

