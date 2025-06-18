const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const Permissao = sequelize.define(
  "Permissao",
  {
    id_permissao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descricao: {
      type: DataTypes.STRING(25),
    },
    cadSala: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    cadUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    edUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    edSalas: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    arqUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    arqSala: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "permissao",
    timestamps: false,
  }
);

module.exports = Permissao;
