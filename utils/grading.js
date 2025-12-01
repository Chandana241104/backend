const { Question, Answer, Submission } = require('../models');

/**
 * Auto-grade multiple choice questions
 */
const gradeMultipleChoice = (question, userAnswer) => {
  if (!userAnswer || userAnswer === '') return 0;
  
  const correctAnswers = question.correct_answers;
  if (!correctAnswers || correctAnswers.length === 0) return 0;

  switch (question.type) {
    case 'mcq':
      // Single correct answer
      return parseInt(userAnswer) === correctAnswers[0] ? question.marks : 0;
    
    case 'multi':
      // Multiple correct answers
      if (!Array.isArray(userAnswer)) return 0;
      
      const userAnswers = userAnswer.sort();
      const correct = correctAnswers.sort();
      
      // Check if arrays are equal
      if (userAnswers.length !== correct.length) return 0;
      const isCorrect = userAnswers.every((val, index) => val === correct[index]);
      
      return isCorrect ? question.marks : 0;
    
    case 'tf':
      // True/False
      return userAnswer === correctAnswers[0] ? question.marks : 0;
    
    default:
      return 0;
  }
};

/**
 * Calculate auto score for a submission
 */
const calculateAutoScore = async (submissionId) => {
  try {
    const submission = await Submission.findByPk(submissionId, {
      include: [{
        model: Answer,
        attributes: ['question_id', 'answer']
      }]
    });

    if (!submission) {
      throw new Error('Submission not found');
    }

    const test = await submission.getTest({
      include: [{
        model: Question,
        attributes: ['id', 'question_id', 'type', 'correct_answers', 'marks']
      }]
    });

    let totalAutoScore = 0;

    // Grade each answer
    for (const answer of submission.Answers) {
      const question = test.Questions.find(q => q.question_id === answer.question_id);
      
      if (question && question.type !== 'short') {
        // Only auto-grade non-short answer questions
        const score = gradeMultipleChoice(question, answer.answer);
        totalAutoScore += score;
      }
    }

    // Update submission with auto score
    await submission.update({
      auto_score: totalAutoScore,
      total_score: totalAutoScore + submission.manual_score,
      status: submission.manual_score > 0 ? 'graded' : 'partially_graded'
    });

    return totalAutoScore;
  } catch (error) {
    console.error('Calculate auto score error:', error);
    throw error;
  }
};

/**
 * Get grading statistics for admin
 */
const getGradingStats = async () => {
  try {
    const totalSubmissions = await Submission.count();
    const gradedSubmissions = await Submission.count({ 
      where: { status: 'graded' } 
    });
    const pendingSubmissions = await Submission.count({ 
      where: { status: 'pending' } 
    });
    const partiallyGraded = await Submission.count({ 
      where: { status: 'partially_graded' } 
    });

    const averageScores = await Submission.findOne({
      where: { status: 'graded' },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('auto_score')), 'avg_auto_score'],
        [sequelize.fn('AVG', sequelize.col('manual_score')), 'avg_manual_score'],
        [sequelize.fn('AVG', sequelize.col('total_score')), 'avg_total_score']
      ]
    });

    return {
      totalSubmissions,
      gradedSubmissions,
      pendingSubmissions,
      partiallyGraded,
      averageScores: {
        auto: Math.round(averageScores?.dataValues?.avg_auto_score || 0),
        manual: Math.round(averageScores?.dataValues?.avg_manual_score || 0),
        total: Math.round(averageScores?.dataValues?.avg_total_score || 0)
      },
      completionRate: totalSubmissions > 0 ? 
        Math.round((gradedSubmissions / totalSubmissions) * 100) : 0
    };
  } catch (error) {
    console.error('Get grading stats error:', error);
    throw error;
  }
};

/**
 * Validate answer format based on question type
 */
const validateAnswerFormat = (questionType, answer) => {
  if (!answer && answer !== '') return false;

  switch (questionType) {
    case 'mcq':
      return Number.isInteger(parseInt(answer));
    
    case 'multi':
      return Array.isArray(answer) && answer.every(item => Number.isInteger(parseInt(item)));
    
    case 'tf':
      return answer === 'true' || answer === 'false';
    
    case 'short':
      return typeof answer === 'string';
    
    default:
      return false;
  }
};

module.exports = {
  gradeMultipleChoice,
  calculateAutoScore,
  getGradingStats,
  validateAnswerFormat
};