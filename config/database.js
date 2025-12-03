const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432, // Good practice to have a default
    dialect: 'postgres',
    logging: false,
    pool: { max: 10, min: 2, acquire: 30000, idle: 10000 },
    
    // 👇 THIS IS THE MISSING PART REQUIRED FOR RENDER 👇
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false 
      }
    }
  }
);

module.exports = sequelize;
