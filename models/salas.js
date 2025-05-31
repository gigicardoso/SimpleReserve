const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

// Definição do modelo Sala
const Sala = sequelize.define('Sala', {
  descricao: DataTypes.STRING,
  ocupado: DataTypes.BOOLEAN,
  qtdade_lugares: DataTypes.INTEGER,
  tipo_mesa: DataTypes.STRING,
  mesa_canhoto: DataTypes.INTEGER,
  projetor: DataTypes.BOOLEAN,
  arcondicionado: DataTypes.BOOLEAN,
  quadro: DataTypes.BOOLEAN,
  computador: DataTypes.INTEGER,
  acessebilidade: DataTypes.BOOLEAN,
  qtdade_mesa_acessivel: DataTypes.INTEGER,
  obs: DataTypes.STRING,
  recursos: DataTypes.STRING,
  imagem_sala: DataTypes.STRING,
  tipo_sala: DataTypes.STRING,
  localizacao: DataTypes.INTEGER // FK para tabela localizacao
}, {
  tableName: 'salas',
  timestamps: false
});

module.exports = Sala;

