const { sequelize, Admin, Test, Question } = require('../models');
const { memberQuestions, mentorQuestions } = require('./testData');
require('dotenv').config();
const seedDatabase = async () => {
  try {
    // Sync database (creates tables)
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create admin user
    // In seed.js
const admin = await Admin.create({
  name: 'Admin User',
  email: 'admin14@gmail.com',
  password_hash: 'Innoviii@2025', // This will be hashed by the hook
  role: 'admin'
});
    console.log('Admin user created');

    // Create member test
    const memberTest = await Test.create({
      title: 'Member Behavioral Test - Uploaded',
      role: 'member',
      description: 'Behavioral & problem-solving questions for members uploaded by the admin.',
      duration_minutes: 60,
      published: true
    });

    // Add member questions
    for (const q of memberQuestions) {
      await Question.create({
        test_id: memberTest.id,
        question_id: q.question_id,
        type: q.type,
        text: q.text,
        marks: q.marks
      });
    }
    console.log('Member test with 12 questions created');

    // Create mentor test
    const mentorTest = await Test.create({
      title: 'Mentor Technical Test - Uploaded',
      role: 'mentor',
      description: 'Technical & mentorship questions for mentors uploaded by the admin.',
      duration_minutes: 60,
      published: true
    });

    // Add mentor questions
    for (const q of mentorQuestions) {
      await Question.create({
        test_id: mentorTest.id,
        question_id: q.question_id,
        type: q.type,
        text: q.text,
        marks: q.marks
      });
    }
    console.log('Mentor test with 26 questions created');

    console.log('Database seeded successfully!');
    // console.log('\n=== Login Credentials ===');
    // console.log('Email: admin@innoviii.test');
    // console.log('Password: admin123');
    // console.log('========================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Handle SQL Server connection
const connectAndSeed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQL Server connection established successfully');
    await seedDatabase();
  } catch (error) {
    console.error('❌ Unable to connect to SQL Server:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure SQL Server is running');
    console.log('2. Check your connection string in .env file');
    console.log('3. Verify SQL Server authentication mode');
    console.log('4. Ensure TCP/IP is enabled in SQL Server Configuration Manager');
    process.exit(1);
  }
};

connectAndSeed();