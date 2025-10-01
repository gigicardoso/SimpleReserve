module.exports = async function(req, res, next) {
  if (!req.session.usuario && req.cookies.rememberMe) {
    console.log('Tentando restaurar sessão pelo cookie...');
    const Usuario = require("../models/usuariosModel");
    const usuario = await Usuario.findOne({ where: { token_login: req.cookies.rememberMe } });
    if (usuario) {
      req.session.usuario = {
        id_user: usuario.id_user,
        nome: usuario.nome,
        email: usuario.email,
        id_permissao: usuario.id_permissao,
      };
      console.log('Sessão restaurada:', req.session.usuario);
    } else {
      console.log('Token inválido no cookie!');
    }
  }
  if (!req.session.usuario) {
    return res.redirect('/');
  }
  next();
};