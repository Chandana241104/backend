const { Submission, Test, Answer, Question, sequelize } = require('../models');

const submitTest = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { testId } = req.params;
    const { takerName, takerEmail, answers } = req.body;

    // Validate required fields
    if (!takerName || !takerEmail) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    // Validate test exists
    const test = await Test.findByPk(testId);
    if (!test) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    // Create submission
    const submission = await Submission.create({
      test_id: testId,
      role: test.role,
      taker_name: takerName,
      taker_email: takerEmail,
      status: 'pending',
      auto_score: 0,
      manual_score: 0,
      total_score: 0,
      submitted_at: new Date()
    }, { transaction });

    // Save answers - UPDATED FOR POSTGRESQL
    if (answers && typeof answers === 'object') {
      const answerRecords = Object.entries(answers).map(([questionId, answer]) => {
        return {
          submission_id: submission.id,
          question_id: questionId,
          answer: answer // Direct object storage (No JSON.stringify needed)
        };
      });

      if (answerRecords.length > 0) {
        await Answer.bulkCreate(answerRecords, { transaction });
      }
    }

    await transaction.commit();

    res.json({
      success: true,
      message: 'Test submitted successfully',
      submissionId: submission.id
    });
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Submit test error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit test' });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 10 } = req.query;
    const whereClause = {};
    if (role) whereClause.role = role;
    if (status) whereClause.status = status;
    const offset = (page - 1) * limit;

    const { count, rows: submissions } = await Submission.findAndCountAll({
      where: whereClause,
      include: [{
        model: Test,
        attributes: ['title', 'description']
      }],
      order: [['submitted_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: submissions,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(count / limit),
        totalRecords: count
      }
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
  }
};

const getSubmissionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findByPk(id, {
      include: [
        {
          model: Test,
          include: [{
            model: Question,
            attributes: ['id', 'question_id', 'type', 'text', 'options', 'marks'],
            order: [['id', 'ASC']]
          }]
        },
        {
          model: Answer,
          attributes: ['id', 'question_id', 'answer']
        }
      ]
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    // Transform data for frontend - UPDATED FOR POSTGRESQL
    const transformedData = {
      ...submission.toJSON(),
      test: submission.Test ? {
        ...submission.Test.toJSON(),
        questions: submission.Test.Questions
      } : null,
      
      // Transform answers array to object
      answers: submission.Answers ? submission.Answers.reduce((acc, answer) => {
        // Direct assignment (No JSON.parse needed)
        acc[answer.question_id] = answer.answer;
        return acc;
      }, {}) : {}
    };

    // Remove redundant nested properties
    delete transformedData.Test;
    delete transformedData.Answers;

    res.json({ success: true, data: transformedData });

  } catch (error) {
    console.error('❌ Get submission details error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch details' });
  }
};

const gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { manualScore } = req.body;

    const submission = await Submission.findByPk(id);
    if (!submission) return res.status(404).json({ success: false, message: 'Not found' });

    const totalScore = submission.auto_score + parseInt(manualScore);
    
    await submission.update({
      manual_score: parseInt(manualScore),
      total_score: totalScore,
      status: totalScore > 0 ? 'graded' : 'pending'
    });

    res.json({ success: true, message: 'Graded successfully', data: submission });
  } catch (error) {
    console.error('❌ Grade submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to grade' });
  }
};

module.exports = { 
  submitTest, 
  getSubmissions, 
  getSubmissionDetails, 
  gradeSubmission 
};