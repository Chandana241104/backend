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
    type: DataTypes.TEXT, // Store as TEXT for SQL Server
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('answer');
      try {
        return JSON.parse(rawValue);
      } catch {
        return rawValue;
      }
    },
    set(value) {
      this.setDataValue('answer', JSON.stringify(value));
    }
  }
}, {
  tableName: 'answers',
  timestamps: false
});

module.exports = Answer;