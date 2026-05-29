const { Sequelize } = require('sequelize');

// Substitua com as credenciais do seu banco MySQL local
const sequelize = new Sequelize('feedback_db', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false // Desativa logs extensos no terminal
});

module.exports = sequelize;