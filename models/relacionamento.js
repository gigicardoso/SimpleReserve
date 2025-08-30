// filepath: c:\Users\giova\OneDrive\Área de Trabalho\SimpleReserve\models\associations.js
const Bloco = require("./blocosModel");
const AndarBloco = require("./andarBlocoModel");
const Sala = require("./salasModel");
const Mesa = require("./tipoMesaModel");
const SalaTipo = require("./tipoSalaModel");
const Agenda = require("./agendaModel");
const Usuario = require("./usuariosModel");

Bloco.hasMany(AndarBloco, { foreignKey: "id_bloco", as: "andares" });
AndarBloco.belongsTo(Bloco, { foreignKey: "id_bloco", as: "blocoAndar" });
Sala.belongsTo(AndarBloco, { foreignKey: "id_andar", as: "andarSala" });
Sala.belongsTo(Mesa, { foreignKey: "id_mesa", as: "mesaSala" });
Sala.belongsTo(SalaTipo, { foreignKey: "id_tipo", as: "tipoSala" });

Agenda.belongsTo(Sala, { foreignKey: "id_salas", as: "sala" });
Sala.hasMany(Agenda, { foreignKey: "id_salas", as: "agendas" });

Agenda.belongsTo(Usuario, { foreignKey: "id_user", as: "usuario" });
Usuario.hasMany(Agenda, { foreignKey: "id_user", as: "agendas" });