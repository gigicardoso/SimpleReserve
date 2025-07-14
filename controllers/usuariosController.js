const Usuario = require('../models/usuariosModel');

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.render('adm/usuariosAdm', {
      usuarios,
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isGerenciador: true
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send('Erro ao buscar usuários');
  }
};

// Criar usuário
exports.criarUsuario = async (req, res) => {
  try {
    if (req.body.senha !== req.body.senha2){
      return res.status(400).send('As senhas não coincidem');
    }
    await Usuario.create(
      {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha
      }
    );
    res.redirect('/usuariosadm');
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).send('Erro ao criar usuário');
  }
};

//UPDATE
exports.atualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).send('Usuario não encontrada');
    await usuario.update(req.body);
    res.redirect('/usuariosadm');
  } catch (error) {
    res.status(500).send('Erro ao atualizar usuario');
  }
};

exports.formEditarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).send('Usuario não encontrada');
    res.render('adm/editarUsuario', {
      usuario,
      layout: 'layout',
      showSidebar: true,
      showLogo: true,
      isEditarUsuario: true
    });
  } catch (error) {
    res.status(500).send('Erro ao buscar usuario para edição');
  }
};

//DELETE
exports.deletarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).send('Usuario não encontrada');
    await usuario.destroy();
    res.redirect('/usuariosadm');
  } catch (error) {
    res.status(500).send('Erro ao deletar usuario');
  }
};