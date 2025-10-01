module.exports = function(req, res, next) {
  if (!req.session.usuario || req.session.usuario.id_permissao !== 1) {
    req.session.error = 'Acesso negado. Você não tem permissão para acessar a área administrativa.';
    return res.redirect('/home');
  }
  next();
};