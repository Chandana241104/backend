const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { sequelize, Admin, Test, Question } = require('./models');
const routes = require('./routes');

// --- 📝 EMBEDDED DATA (So you don't need extra files) ---
const memberQuestions = [
  { "question_id": "q1", "type": "short", "text": "Imagine you are given a task with no clear instructions. What would you do first?", "marks": 4 },
  { "question_id": "q2", "type": "short", "text": "When you get stuck, do you usually ask for help, search online, or try until you solve it?", "marks": 4 },
  { "question_id": "q3", "type": "short", "text": "Do you see mistakes as failures or as opportunities to learn? Why?", "marks": 4 },
  { "question_id": "q4", "type": "short", "text": "How do you stay positive when something doesn't go your way?", "marks": 4 },
  { "question_id": "q5", "type": "short", "text": "If someone criticizes your work, how would you handle it?", "marks": 4 },
  { "question_id": "q6", "type": "short", "text": "What was the last 'why/how' question you asked yourself?", "marks": 4 },
  { "question_id": "q7", "type": "short", "text": "If you had the chance, which skill (outside your studies) would you love to explore?", "marks": 4 },
  { "question_id": "q8", "type": "short", "text": "Do you prefer working alone first or directly learning with others?", "marks": 4 },
  { "question_id": "q9", "type": "short", "text": "What kind of learning makes you more excited—structured (step-by-step) or exploring freely?", "marks": 4 },
  { "question_id": "q10", "type": "short", "text": "What do you enjoy most about working in a team?", "marks": 4 },
  { "question_id": "q11", "type": "short", "text": "If a teammate is struggling, how would you support them?", "marks": 4 },
  { "question_id": "q12", "type": "short", "text": "Do you prefer small groups, large groups, or one-on-one collaboration? Why?", "marks": 4 }
];

const mentorQuestions = [
  { "question_id": "q1", "type": "short", "text": "What is the difference between a primitive data type and a complex or reference data type?", "marks": 4 },
  { "question_id": "q2", "type": "short", "text": "Provide an example of a primitive data type and a complex data type in a language you are familiar with.", "marks": 4 },
  { "question_id": "q3", "type": "short", "text": "Explain the purpose of if-else statements, for loops, and while loops.", "marks": 4 },
  { "question_id": "q4", "type": "short", "text": "When would you choose a for loop over a while loop, and vice-versa?", "marks": 4 },
  { "question_id": "q5", "type": "short", "text": "What is a function, and why are they important in programming?", "marks": 4 },
  { "question_id": "q6", "type": "short", "text": "Explain the difference between passing arguments by value and passing them by reference.", "marks": 4 },
  { "question_id": "q7", "type": "short", "text": "Define what an algorithm is.", "marks": 4 },
  { "question_id": "q8", "type": "short", "text": "What are the two key factors used to analyse an algorithm's efficiency?", "marks": 4 },
  { "question_id": "q9", "type": "short", "text": "List and briefly explain the four pillars of OOP.", "marks": 4 },
  { "question_id": "q10", "type": "short", "text": "Provide a real-world example for Polymorphism.", "marks": 4 },
  { "question_id": "q11", "type": "short", "text": "What is a data structure?", "marks": 4 },
  { "question_id": "q12", "type": "short", "text": "Explain the difference between an array and a linked list.", "marks": 4 },
  { "question_id": "q13", "type": "short", "text": "When would you choose to use a hash map (or dictionary) over an array?", "marks": 4 },
  { "question_id": "q14", "type": "short", "text": "What is recursion?", "marks": 4 },
  { "question_id": "q15", "type": "short", "text": "Write a simple recursive function to calculate the factorial of a number.", "marks": 4 },
  { "question_id": "q16", "type": "short", "text": "What are the potential risks of using recursion?", "marks": 4 },
  { "question_id": "q17", "type": "short", "text": "How do you handle errors and exceptions in your code?", "marks": 4 },
  { "question_id": "q18", "type": "short", "text": "Why is robust error handling critical for a program's reliability?", "marks": 4 },
  { "question_id": "q19", "type": "short", "text": "How do you approach mentoring a new team member with less experience than you?", "marks": 4 },
  { "question_id": "q20", "type": "short", "text": "Describe a situation where you had to explain a complex technical concept to a non-technical audience.", "marks": 4 },
  { "question_id": "q21", "type": "short", "text": "Describe a time you took on a leadership role for a project. What challenges did you face, and how did you overcome them?", "marks": 4 },
  { "question_id": "q22", "type": "short", "text": "How do you motivate a team to meet a tight deadline?", "marks": 4 },
  { "question_id": "q23", "type": "short", "text": "Tell me about a time you had to make a difficult decision that impacted your team.", "marks": 4 },
  { "question_id": "q24", "type": "short", "text": "Describe a challenging project you worked on. What was your role, and what was the outcome?", "marks": 4 },
  { "question_id": "q25", "type": "short", "text": "Tell me about a time you failed at something. What did you learn from the experience?", "marks": 4 },
  { "question_id": "q26", "type": "short", "text": "Give an example of a time you received constructive criticism. How did you react, and what changes did you make?", "marks": 4 }
];

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use(limiter);

    // 3. Create Member Test
    const memberTest = await Test.create({
      title: 'Member Behavioral Test',
      role: 'member',
      description: 'Behavioral & problem-solving questions for members.',
      duration_minutes: 60,
      published: true
    });

    // 4. Add Member Questions
    for (const q of memberQuestions) {
      await Question.create({ ...q, test_id: memberTest.id });
    }

    // 5. Create Mentor Test
    const mentorTest = await Test.create({
      title: 'Mentor Technical Test',
      role: 'mentor',
      description: 'Technical & mentorship questions for mentors.',
      duration_minutes: 60,
      published: true
    });

    // 6. Add Mentor Questions
    for (const q of mentorQuestions) {
      await Question.create({ ...q, test_id: mentorTest.id });
    }

    res.send(`
      <div style="font-family: sans-serif; padding: 20px;">
        <h1 style="color: green;">🎉 Database Seeded Successfully!</h1>
        <p>Tables created and Questions added.</p>
        <p>You can now go back to your website and refresh.</p>
      </div>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send(`<h1>❌ Error Seeding Database</h1><pre>${error.message}</pre>`);
  }
});
// ------------------------------------------------

// Normal API Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'INNOVIII API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

// 404 handler (MUST BE LAST)
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    // ✅ Sync tables (alter: true protects your data on restarts)
    await sequelize.sync({ alter: true }); 
    console.log('✅ Database models synced');

    app.listen(PORT, () => {
      console.log(`🚀 INNOVIII Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
module.exports = app;
