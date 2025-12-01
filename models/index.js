const sequelize = require('../config/database');
const Admin = require('./Admin');
const Test = require('./Test');
const Question = require('./Question');
const Submission = require('./Submission');
const Answer = require('./Answer');

// --- Define Associations ---

// Test has many Questions
Test.hasMany(Question, { foreignKey: 'test_id' });
Question.belongsTo(Test, { foreignKey: 'test_id' });

// Test has many Submissions
Test.hasMany(Submission, { foreignKey: 'test_id' });
Submission.belongsTo(Test, { foreignKey: 'test_id' });

// Submission has many Answers
Submission.hasMany(Answer, { foreignKey: 'submission_id' });
Answer.belongsTo(Submission, { foreignKey: 'submission_id' });

// Export everything
module.exports = {
  sequelize,
  Admin,
  Test,
  Question,
  Submission,
  Answer
};