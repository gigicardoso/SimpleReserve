const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");
const Andar = require("./andarBlocoModel");
const Mesa = require("./tipoMesaModel");
const SalaTipo = require("./tipoSalaModel");

// Definição do modelo Sala
const Sala = sequelize.define(
  "Sala",
  {
    id_salas: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome_salas: DataTypes.STRING,
    descricao: DataTypes.STRING,
    capacidade: DataTypes.INTEGER,
    mesa_canhoto: DataTypes.INTEGER,
    projetor: DataTypes.BOOLEAN,
    ar_cond: DataTypes.BOOLEAN,
    quadro: DataTypes.BOOLEAN,
    computador: DataTypes.INTEGER,
    acess: DataTypes.BOOLEAN,
    mesa_acess: DataTypes.INTEGER,
    imagem_sala: DataTypes.STRING,
    id_tipo: {
      type: DataTypes.INTEGER,
      references: {
        model: "tipo_sala",
        key: "id_tipo",
      },
    },
    id_mesa: {
      type: DataTypes.INTEGER,
      references: {
        model: "tipo_mesa",
        key: "id_mesa",
      },
    },
    id_andar: {
      type: DataTypes.INTEGER,
      references: {
        model: "andar_bloco",
        key: "id_andar",
      },
    },
  },
  {
    tableName: "salas",
    timestamps: false,
  }
);

Sala.belongsTo(Andar, { foreignKey: "id_andar", as: "andarSala" });
Sala.belongsTo(Mesa, { foreignKey: "id_mesa", as: "mesaSala" });
Sala.belongsTo(SalaTipo, { foreignKey: "id_tipo", as: "tipoSala" });

module.exports = Sala;
