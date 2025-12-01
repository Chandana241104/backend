const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Test = sequelize.define('Test', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('member', 'mentor'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tests',
  timestamps: false
});

module.exports = Test;