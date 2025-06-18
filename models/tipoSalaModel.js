const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const SalaTipo = sequelize.define(
  "SalaTipo",
  {
    id_tipo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descricao: {
      type: DataTypes.STRING(50),
    },
  },
  {
    tableName: "tipo_sala",
    timestamps: false,
  }
);

module.exports = SalaTipo;
