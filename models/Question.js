const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  test_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  question_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('mcq', 'multi', 'tf', 'short'),
    allowNull: false
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  options: {
    type: DataTypes.JSONB, // Optimized for Postgres
    defaultValue: []
  },
  correct_answers: {
    type: DataTypes.JSONB, // Optimized for Postgres
    defaultValue: []
  },
  marks: {
    type: DataTypes.INTEGER,
    defaultValue: 4
  }
}, {
  tableName: 'questions',
  timestamps: false
});

module.exports = Question;