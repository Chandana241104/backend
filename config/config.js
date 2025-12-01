const path = require('path');
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'innoviii_user',
    password: process.env.DB_PASSWORD || 'InnoviiiProd123!',
    database: process.env.DB_NAME || 'innoviii_db',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 1433,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: true,
        instanceName: 'SQLEXPRESS'
      }
    },
    logging: console.log,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + '_test',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: true
      }
    },
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: true
      }
    },
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 20000
    }
  }
};