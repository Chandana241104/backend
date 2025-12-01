const { Test, Submission, Answer, sequelize } = require('../models');

/**
 * Get user's submission history
 */
const getUserSubmissions = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    const submissions = await Submission.findAll({
      where: { taker_email: email },
      include: [{
        model: Test,
        attributes: ['id', 'title', 'description', 'role']
      }],
      attributes: [
        'id',
        'test_id',
        'role',
        'taker_name',
        'auto_score',
        'manual_score',
        'total_score',
        'status',
        'submitted_at'
      ],
      order: [['submitted_at', 'DESC']]
    });

    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user submissions'
    });
  }
};

/**
 * Get detailed submission with answers
 */
const getUserSubmissionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    const submission = await Submission.findOne({
      where: { 
        id,
        taker_email: email 
      },
      include: [
        {
          model: Test,
          include: [{
            model: Question,
            attributes: ['id', 'question_id', 'type', 'text', 'marks']
          }]
        },
        {
          model: Answer,
          attributes: ['question_id', 'answer']
        }
      ]
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found or access denied'
      });
    }

    // Transform data for frontend
    const transformedSubmission = {
      ...submission.toJSON(),
      test: submission.Test,
      answers: submission.Answers.reduce((acc, answer) => {
        acc[answer.question_id] = answer.answer;
        return acc;
      }, {})
    };

    delete transformedSubmission.Test;
    delete transformedSubmission.Answers;

    res.json({
      success: true,
      data: transformedSubmission
    });
  } catch (error) {
    console.error('Get user submission details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission details'
    });
  }
};

/**
 * Check if user has already taken a test
 */
const checkTestEligibility = async (req, res) => {
  try {
    const { testId } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    const existingSubmission = await Submission.findOne({
      where: {
        test_id: testId,
        taker_email: email
      },
      attributes: ['id', 'status', 'submitted_at']
    });

    const canTakeTest = !existingSubmission;

    res.json({
      success: true,
      data: {
        canTakeTest,
        existingSubmission: existingSubmission ? {
          id: existingSubmission.id,
          status: existingSubmission.status,
          submitted_at: existingSubmission.submitted_at
        } : null
      }
    });
  } catch (error) {
    console.error('Check test eligibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check test eligibility'
    });
  }
};

/**
 * Get user statistics
 */
const getUserStats = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    const totalSubmissions = await Submission.count({
      where: { taker_email: email }
    });

    const gradedSubmissions = await Submission.count({
      where: { 
        taker_email: email,
        status: 'graded'
      }
    });

    const memberSubmissions = await Submission.count({
      where: { 
        taker_email: email,
        role: 'member'
      }
    });

    const mentorSubmissions = await Submission.count({
      where: { 
        taker_email: email,
        role: 'mentor'
      }
    });

    const averageScore = await Submission.findOne({
      where: { 
        taker_email: email,
        status: 'graded'
      },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('total_score')), 'avg_score']
      ]
    });

    res.json({
      success: true,
      data: {
        totalSubmissions,
        gradedSubmissions,
        memberSubmissions,
        mentorSubmissions,
        averageScore: Math.round(averageScore?.dataValues?.avg_score || 0),
        pendingSubmissions: totalSubmissions - gradedSubmissions
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
};

module.exports = {
  getUserSubmissions,
  getUserSubmissionDetails,
  checkTestEligibility,
  getUserStats
};