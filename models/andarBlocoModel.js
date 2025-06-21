const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const AndarBloco = sequelize.define(
  "Andar",
  {
    id_andar: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descricao: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },

    id_bloco: {
      type: DataTypes.INTEGER,
      references: {
        model: "blocos",
        key: "id_bloco",
      },
    },
  },
  {
    tableName: "andar_bloco",
    timestamps: false,
  }
);

AndarBloco.belongsTo(require("./blocosModel"), { foreignKey: "id_bloco", as: "bloco" });

module.exports = AndarBloco;
