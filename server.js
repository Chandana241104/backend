const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// 👇 UPDATE IMPORTS to include Models and Data
const { sequelize, Admin, Test, Question } = require('./models');
const { memberQuestions, mentorQuestions } = require('./testData'); 
const routes = require('./routes');

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

// Routes
app.use('/api', routes);

// --- 🛠️ SPECIAL SETUP ROUTE (Run this once) ---
// This allows you to fill the database without needing the Shell
app.get('/seed-db', async (req, res) => {
  try {
    console.log('🔄 Starting Database Seed...');
    
    // 1. Reset Database (Drops all tables and recreates them)
    await sequelize.sync({ force: true });
    
    // 2. Create Admin
    await Admin.create({
      name: 'Admin User',
      email: 'admin14@gmail.com',
      password_hash: 'Innoviii@2025', 
      role: 'admin'
    });

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

// 404 handler
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

    // ✅ FIX: Always sync tables (use 'alter' to avoid deleting data on restart)
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
