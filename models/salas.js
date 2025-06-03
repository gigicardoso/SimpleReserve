const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');
const Localizacao = require('./localizacao');

// Definição do modelo Sala
const Sala = sequelize.define('Sala', {
  cod: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descricao: DataTypes.STRING,
  ocupado: DataTypes.BOOLEAN,
  qtdade_lugares: DataTypes.INTEGER,
  tipo_mesa: DataTypes.STRING,
  mesa_canhoto: DataTypes.INTEGER,
  projetor: DataTypes.BOOLEAN,
  arcondicionado: DataTypes.BOOLEAN,
  quadro: DataTypes.BOOLEAN,
  computador: DataTypes.INTEGER,
  acessibilidade: DataTypes.BOOLEAN,
  qtdade_mesa_acessivel: DataTypes.INTEGER,
  obs: DataTypes.STRING,
  recursos: DataTypes.STRING,
  imagem_sala: DataTypes.STRING,
  tipo_sala: DataTypes.STRING,
  localizacao: {
    type: DataTypes.INTEGER,
    references: {
      model: 'localizacao', // Nome da tabela referenciada
      key: 'cod' // Corrigido de 'id' para 'cod'
    }
  }
}, {
  tableName: 'salas',
  timestamps: false
});

// Associação correta
Sala.belongsTo(Localizacao, { foreignKey: 'localizacao', as: 'localizacaoSala' });

module.exports = Sala;

