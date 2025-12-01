const { sequelize, Admin, Test, Question } = require('../models');
const { memberQuestions, mentorQuestions } = require('./testData');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Force sync to drop tables and recreate them for Postgres
    await sequelize.sync({ force: true });
    console.log('✅ Database synced (Tables recreated)');

    // Create Admin
    await Admin.create({
      name: 'Admin User',
      email: 'admin14@gmail.com',
      password_hash: 'Innoviii@2025', 
      role: 'admin'
    });
    console.log('✅ Admin user created');

    // Create Member Test
    const memberTest = await Test.create({
      title: 'Member Behavioral Test',
      role: 'member',
      description: 'Behavioral & problem-solving questions for members.',
      duration_minutes: 60,
      published: true
    });

    // Add Member Questions
    for (const q of memberQuestions) {
      await Question.create({
        test_id: memberTest.id,
        question_id: q.question_id,
        type: q.type,
        text: q.text,
        marks: q.marks,
        // Ensure these are arrays/objects, not strings
        options: q.options || [],
        correct_answers: q.correct_answers || []
      });
    }
    console.log('✅ Member test created');

    // Create Mentor Test
    const mentorTest = await Test.create({
      title: 'Mentor Technical Test',
      role: 'mentor',
      description: 'Technical & mentorship questions for mentors.',
      duration_minutes: 60,
      published: true
    });

    // Add Mentor Questions
    for (const q of mentorQuestions) {
      await Question.create({
        test_id: mentorTest.id,
        question_id: q.question_id,
        type: q.type,
        text: q.text,
        marks: q.marks,
        options: q.options || [],
        correct_answers: q.correct_answers || []
      });
    }
    console.log('✅ Mentor test created');

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();