const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  test_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('member', 'mentor'),
    allowNull: false
  },
  taker_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  taker_email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  auto_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  manual_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('pending', 'partially_graded', 'graded'),
    defaultValue: 'pending'
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'submissions',
  timestamps: false
});

module.exports = Submission;