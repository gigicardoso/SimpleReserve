const Sequelize = require('sequelize');


const sequelize = new Sequelize('sr', 'root', '', {
        host: 'localhost',
        dialect: 'mysql'
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}