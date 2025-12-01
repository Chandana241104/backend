-- Create database
-- CREATE DATABASE IF NOT EXISTS innoviii_db;
USE innoviii;

-- Create tables (these will be created by Sequelize, but here's the SQL reference)

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  role ENUM('member', 'mentor') NOT NULL,
  description TEXT,
  duration_minutes INT DEFAULT 60,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_id INT,
  question_id VARCHAR(50) NOT NULL,
  type ENUM('mcq', 'multi', 'tf', 'short') NOT NULL,
  text TEXT NOT NULL,
  options JSON,
  correct_answers JSON,
  marks INT DEFAULT 4,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_id INT,
  role ENUM('member', 'mentor') NOT NULL,
  taker_name VARCHAR(255) NOT NULL,
  taker_email VARCHAR(255) NOT NULL,
  auto_score INT DEFAULT 0,
  manual_score INT DEFAULT 0,
  total_score INT DEFAULT 0,
  status ENUM('pending', 'partially_graded', 'graded') DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES tests(id)
);

CREATE TABLE IF NOT EXISTS answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id INT,
  question_id VARCHAR(50) NOT NULL,
  answer JSON NOT NULL,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_tests_role ON tests(role);
CREATE INDEX idx_tests_published ON tests(published);
CREATE INDEX idx_submissions_role ON submissions(role);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_email ON submissions(taker_email);
CREATE INDEX idx_questions_test_id ON questions(test_id);
CREATE INDEX idx_answers_submission_id ON answers(submission_id);
