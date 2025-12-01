const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Answer = sequelize.define('Answer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  submission_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  question_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  answer: {
    type: DataTypes.JSONB, // Optimized for Postgres
    allowNull: false
  }
}, {
  tableName: 'answers',
  timestamps: false
});

module.exports = Answer;