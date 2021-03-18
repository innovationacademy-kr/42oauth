const { Sequelize } = require('sequelize');

module.exports = new Sequelize(process.env.DB_SCHEMA,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  });
