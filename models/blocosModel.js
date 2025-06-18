const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const Bloco = sequelize.define(
  "Bloco",
  {
    id_bloco: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descricao: {
      type: DataTypes.STRING(15),
    },
  },
  {
    tableName: "blocos",
    timestamps: false,
  }
);

module.exports = Bloco;
