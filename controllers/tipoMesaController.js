const Mesa = require("../models/tipoMesaModel");

// CONSULTA
exports.listarMesas = async (req, res) => {
  try {
    const mesas = await Mesa.findAll();
    res.render('adm/tipoMesa', {
      mesas,
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isGerenciador: true,
      breadcrumb: [
        { title: 'Gerenciador ADM', path: '/adm' },
        { title: 'Gerenciador de tipo de mesa', path: '/tipoMesa' }
      ]
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar mesa");
  }
};

// CRIAÇÃO
exports.criarMesa = async (req, res) => {
  try {
    await Mesa.create(req.body);
    res.redirect("/tipoMesa");
  } catch (error) {
    res.status(500).send("Erro ao criar mesa");
  }
};

//UPDATE
exports.atualizarMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);
    if (!mesa) return res.status(404).send("Mesa não encontrada");
    await mesa.update(req.body);
    res.redirect("/tipoMesa");
  } catch (error) {
    res.status(500).send("Erro ao atualizar mesa");
  }
};

exports.formEditarMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);
    if (!mesa) return res.status(404).send("Mesa não encontrada");
    res.render("adm/editarMesa", {
      mesa,
      layout: "layout",
      showSidebar: true,
      showLogo: true,
      isEditarMesa: true,
      breadcrumb: [
        { title: 'Gerenciador ADM', path: '/adm' },
        { title: 'Gerenciador de tipo de mesa', path: '/tipoMesa' },
        { title: 'Editar tipo de mesa', path: '' }
      ]
    });
  } catch (error) {
    res.status(500).send("Erro ao buscar mesa para edição");
  }
};

//DELETE
exports.deletarMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);
    if (!mesa) return res.status(404).send("Mesa não encontrada");
    await mesa.destroy();
    res.redirect("/tipoMesa");
  } catch (error) {
    res.status(500).send("Erro ao deletar mesa");
  }
};
