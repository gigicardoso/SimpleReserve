(async ()=>{
  try{
    const { sequelize } = require('../db/db');
    await sequelize.authenticate();
    console.log('Conectado ao DB. Listando permissões e usuários...');
    const [perms] = await sequelize.query('SELECT id_permissao, descricao, cadSala, cadUser, edUser, arqUser, arqSala, edSalas, adm FROM permissao ORDER BY id_permissao');
    const [users] = await sequelize.query('SELECT id_user, nome, email, id_permissao FROM usuarios ORDER BY id_user');
    console.log('\nPERMISSOES:');
    perms.forEach(p=> console.log(p));
    console.log('\nUSUARIOS:');
    users.forEach(u=> console.log(u));
  } catch(err){
    console.error('Erro ao listar:', err);
    process.exit(1);
  }
  process.exit(0);
})();
