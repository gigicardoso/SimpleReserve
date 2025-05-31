const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

const Localizacao = sequelize.define('Localizacao', {
  cod: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bloco: {
    type: DataTypes.STRING(14),
    allowNull: false
  },
  andar: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'localizacao',
  timestamps: false
});

module.exports = Localizacao;
