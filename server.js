const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { sequelize } = require('./models');
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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Start server
// ... existing imports

const startServer = async () => {
  try {
    // Authenticate connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    // Sync models (Update associations)
    // NOTE: alter: true updates tables without deleting data. 
    // Use force: true only if you want to wipe data and reset.
    if (process.env.NODE_ENV === 'production') {
      await sequelize.sync({ alter: true }); 
      console.log('✅ Database models synced');
    }

    app.listen(PORT, () => {
      console.log(`🚀 INNOVIII Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
// At the bottom of your server.js
const port = process.env.PORT || 5000;

// Only listen if NOT running on Vercel (Vercel handles the port automatically)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// CRITICAL: Export the app for Vercel
module.exports = app;
