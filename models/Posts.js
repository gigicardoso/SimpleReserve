const db = require('./db');

//aqui é onde vamos colocar as tabelas do banco de dados

const Posts = db.sequelize.define('postagens', {
    titulo: {
        type: db.Sequelize.STRING
    },
    conteudo: {
        type: db.Sequelize.TEXT
    }
}); 

module.exports = Posts;

//Posts.sync({force: true})