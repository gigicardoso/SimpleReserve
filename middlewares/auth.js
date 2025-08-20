module.exports = function(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  
  if (req.session.usuario.id_permissao !== 1) {
    req.session.error = 'Acesso negado. Você não tem permissão para acessar a área administrativa.';
    return res.redirect('/');
  }
  
  next();
};