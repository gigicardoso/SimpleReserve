// filepath: c:\Users\giova\OneDrive\Área de Trabalho\SimpleReserve\models\associations.js
const Bloco = require("./blocosModel");
const AndarBloco = require("./andarBlocoModel");

Bloco.hasMany(AndarBloco, { foreignKey: "id_bloco", as: "andares" });
AndarBloco.belongsTo(Bloco, { foreignKey: "id_bloco", as: "blocoAndar" });