const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

/**
 * Generate JWT token
 */
const generateToken = (payload, expiresIn = '24h') => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'innoviii_secret',
    { expiresIn }
  );
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'innoviii_secret');
};

/**
 * Hash password
 */
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Validate password
 */
const validatePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Format validation errors
 */
const formatValidationErrors = (errors) => {
  return errors.array().map(error => ({
    field: error.path,
    message: error.msg,
    value: error.value
  }));
};

/**
 * Sanitize user input
 */
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  return input;
};

/**
 * Generate random string
 */
const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Format file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Calculate time remaining
 */
const calculateTimeRemaining = (startTime, durationMinutes) => {
  const start = new Date(startTime);
  const end = new Date(start.getTime() + durationMinutes * 60000);
  const now = new Date();
  const remaining = end - now;
  
  return Math.max(0, remaining);
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Paginate results
 */
const paginate = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};
  results.total = data.length;
  results.pages = Math.ceil(data.length / limit);
  results.current = parseInt(page);
  
  if (endIndex < data.length) {
    results.next = parseInt(page) + 1;
  }
  
  if (startIndex > 0) {
    results.previous = parseInt(page) - 1;
  }
  
  results.data = data.slice(startIndex, endIndex);
  return results;
};

/**
 * Generate CSV from data
 */
const generateCSV = (data, headers) => {
  if (!data || data.length === 0) return '';
  
  const headerRow = headers.map(header => `"${header}"`).join(',');
  const rows = data.map(row => 
    headers.map(header => {
      const value = row[header] || '';
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',')
  );
  
  return [headerRow, ...rows].join('\n');
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  validatePassword,
  formatValidationErrors,
  sanitizeInput,
  generateRandomString,
  formatFileSize,
  calculateTimeRemaining,
  isValidEmail,
  paginate,
  generateCSV
};