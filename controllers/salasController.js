const Sala = require("../models/salasModel");
const AndarBloco = require("../models/andarBlocoModel");
const Mesa = require("../models/tipoMesaModel");
const SalaTipo = require("../models/tipoSalaModel");
const Bloco = require("../models/blocosModel");
const Permissao = require("../models/permissaoModel");

async function getPerm(req) {
  const u = req.session && req.session.usuario;
  if (!u) return null;
  const p = await Permissao.findByPk(u.id_permissao);
  return p ? (p.get ? p.get({ plain: true }) : p) : null;
}

// Checagem granular por ação
async function requireSalaPerm(req, res, campo) {
  try {
    const p = await getPerm(req);
    const isAdm = !!(p && p.adm);
    const ok = !!(p && (campo ? p[campo] : p.cadSala || p.edSalas || p.arqSala));
    if (!p || (!isAdm && !ok)) {
      res.status(403).render("error", { message: "Você não tem acesso a essa função", alert: true });
      return true;
    }
    return false;
  } catch (e) {
    res.status(500).render("error", { message: "Erro ao verificar permissão", alert: true });
    return true;
  }
}

// CONSULTA
exports.listarSalas = async (req, res) => {
  if (await requireSalaPerm(req, res, null)) return;
  try {
    const p = await getPerm(req);
    const podeCadastrarSala = !!(p && (p.adm || p.cadSala));
    const podeEditarSala = !!(p && (p.adm || p.edSalas));
    const podeExcluirSala = !!(p && (p.adm || p.arqSala));
    const salas = await Sala.findAll({
      include: [
        {
          model: AndarBloco,
          as: "andarSala",
          include: [{ model: Bloco, as: "blocoAndar" }],
        },
        { model: Mesa, as: "mesaSala" },
        { model: SalaTipo, as: "tipoSala" },
      ],
    });
    res.render("gerenciarSalas", {
      salas,
      podeCadastrarSala,
  podeEditarSala,
  podeExcluirSala,
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isGerenciarSalas: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao buscar salas");
  }
};

// CRIAÇÃO
exports.criarSala = async (req, res) => {
  if (await requireSalaPerm(req, res, "cadSala")) return;
  try {
    const dadosSala = req.body;
    if (req.file) {
      dadosSala.imagem_sala = req.file.filename;
    }
    // Verifica duplicidade pelo nome da sala
    const duplicada = await Sala.findOne({
      where: { nome_salas: dadosSala.nome_salas },
    });
    if (duplicada) {
      return res.render("mais/adicionaSala", {
        layout: "layout",
        erro: `A sala '${dadosSala.nome_salas}' já foi cadastrada!`,
        showSidebar: true,
        showLogo: true,
      });
    }
    await Sala.create(dadosSala);
    res.redirect("/salas/gerenciarsalas");
  } catch (error) {
    res.status(500).send("Erro ao criar sala");
    console.log(error);
  }
};

//UPDATE
exports.atualizarSala = async (req, res) => {
  if (await requireSalaPerm(req, res, "edSalas")) return;
  try {
    const sala = await Sala.findByPk(req.params.id);
    if (!sala) return res.status(404).send("Sala não encontrada");
    
    // Verifica se o usuário marcou para remover a imagem
    if (req.body.remover_imagem === '1') {
      req.body.imagem_sala = null;
      // Deletar o arquivo físico do servidor
      if (sala.imagem_sala) {
        const fs = require('fs');
        const path = require('path');
        const imagePath = path.join(__dirname, '..', 'public', 'uploads', 'salas', sala.imagem_sala);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    } else if (req.file) {
      // Se enviou uma nova imagem, usa a nova
      req.body.imagem_sala = req.file.filename;
      // Deletar a imagem antiga do servidor
      if (sala.imagem_sala) {
        const fs = require('fs');
        const path = require('path');
        const imagePath = path.join(__dirname, '..', 'public', 'uploads', 'salas', sala.imagem_sala);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }
    
    // Remove o campo remover_imagem antes de atualizar (não é uma coluna do banco)
    delete req.body.remover_imagem;
    
    await sala.update(req.body);
    res.redirect("/salas/gerenciarsalas");
  } catch (error) {
    res.status(500).send("Erro ao atualizar sala");
  }
};

exports.formEditarSala = async (req, res) => {
  if (await requireSalaPerm(req, res, "edSalas")) return;
  try {
    const sala = await Sala.findByPk(req.params.id, {
      include: [
        { model: AndarBloco, as: "andarSala" },
        { model: Mesa, as: "mesaSala" },
        { model: SalaTipo, as: "tipoSala" },
      ],
    });
    if (!sala) return res.status(404).send("Sala não encontrada");

    const tiposSala = await SalaTipo.findAll();
    const tiposMesa = await Mesa.findAll();
    const blocos = await Bloco.findAll();
    let andares = [];
    if (blocos.length > 0) {
      andares = await AndarBloco.findAll({
        where: { id_bloco: blocos[0].id_bloco },
      });
    }

    res.render("cadastroSala", {
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isAtualizarSala: true,
      sala,
      tiposSala,
      tiposMesa,
      blocos,
      andares,
      breadcrumb: [
        { title: "Gerenciador ADM", path: "/adm" },
        { title: "Gerenciador de Salas", path: "/salas/gerenciarsalas" },
        { title: "Editar Sala", path: `/salas/editar/${sala.id_salas}` },
      ],
    });
  } catch (error) {
    res.status(500).send("Erro ao carregar formulário de atualização de sala");
  }
};

//DELETE
exports.deletarSala = async (req, res) => {
  if (await requireSalaPerm(req, res, "arqSala")) return;
  try {
    const sala = await Sala.findByPk(req.params.id);
    if (!sala) return res.status(404).send("Sala não encontrada");
    await sala.destroy();
    res.redirect("/salas/gerenciarsalas");
  } catch (error) {
    res.status(500).send("Erro ao deletar sala");
  }
};

// Exibir formulário de cadastro de sala
exports.formCadastroSala = async (req, res) => {
  if (await requireSalaPerm(req, res, "cadSala")) return;
  try {
    const tiposSala = await SalaTipo.findAll();
    const tiposMesa = await Mesa.findAll();
    const blocos = await Bloco.findAll();
    let andares = [];
    if (blocos.length > 0) {
      const AndarBloco = require("../models/andarBlocoModel");
      andares = await AndarBloco.findAll({
        where: { id_bloco: blocos[0].id_bloco },
      });
    }
    res.render("cadastroSala", {
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isCadastroSala: true,
      tiposSala,
      tiposMesa,
      blocos,
      andares,
      breadcrumb: [
        { title: "Gerenciador ADM", path: "/adm" },
        { title: "Gerenciador de Salas", path: "/salas/gerenciarsalas" },
        { title: "Cadastrar Sala", path: "/salas/cadastrosala" },
      ],
    });
  } catch (error) {
    res.status(500).send("Erro ao carregar formulário de cadastro de sala");
  }
};

// Exibir detalhes da sala
exports.detalhesSala = async (req, res) => {
  try {
    const sala = await Sala.findByPk(req.params.id, {
      include: [
        { model: AndarBloco, as: "andarSala" },
        { model: Mesa, as: "mesaSala" },

        { model: SalaTipo, as: "tipoSala" },
      ],
    });
    if (!sala) return res.status(404).send("Sala não encontrada");
    res.json(sala);
  } catch (error) {
    res.status(500).send("Erro ao carregar detalhes da sala");
  }
};
