const Permissao = require("./permissaoModel");
const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const Usuario = sequelize.define(
  "Usuario",
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    senha: {
      type: DataTypes.CHAR(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    id_permissao: {
      type: DataTypes.INTEGER,
      references: {
        model: "permissao",
        key: "id_permissao",
      },
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);

Usuario.belongsTo(Permissao, {
  foreignKey: "id_permissao",
  as: "permissaoUsuario",
});

module.exports = Usuario;
