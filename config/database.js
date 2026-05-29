require('dotenv').config();
const { Sequelize } = require('sequelize');

// Substitua com as credenciais do seu banco MySQL local
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    ssl: true,
    port: process.env.DB_PORT ,
    logging: false // Desativa logs extensos no terminal
});

module.exports = sequelize;