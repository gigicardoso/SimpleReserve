const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const Mesa = sequelize.define(
  "Mesa",
  {
    id_mesa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descricao: {
      type: DataTypes.STRING(75),
    },
  },
  {
    tableName: "tipo_mesa",
    timestamps: false,
  }
);

module.exports = Mesa;
