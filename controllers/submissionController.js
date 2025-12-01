const { Submission, Test, Answer, Question, sequelize } = require('../models');

const submitTest = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { testId } = req.params;
    const { takerName, takerEmail, answers } = req.body;

    console.log('📝 Received submission request:', { 
      testId, 
      takerName, 
      takerEmail, 
      answersCount: answers ? Object.keys(answers).length : 0 
    });

    // Log the structure of answers
    if (answers && typeof answers === 'object') {
      console.log('🔍 Answers structure:');
      Object.entries(answers).forEach(([questionId, answer]) => {
        console.log(`  Q${questionId}:`, {
          answer: answer,
          type: typeof answer
        });
      });
    }

    // Validate required fields
    if (!takerName || !takerEmail) {
      await transaction.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Name and email are required' 
      });
    }

    // Validate test exists
    const test = await Test.findByPk(testId);
    if (!test) {
      await transaction.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'Test not found' 
      });
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

    console.log('✅ Created submission:', submission.id);

    // Save answers
    if (answers && typeof answers === 'object') {
      const answerRecords = Object.entries(answers).map(([questionId, answer]) => {
        const answerString = JSON.stringify(answer);
        console.log(`💾 Saving answer for Q${questionId}:`, {
          original: answer,
          stringified: answerString
        });
        
        return {
          submission_id: submission.id,
          question_id: questionId,
          answer: answerString // Store as JSON string for SQL Server
        };
      });

      if (answerRecords.length > 0) {
        await Answer.bulkCreate(answerRecords, { transaction });
        console.log(`✅ Created ${answerRecords.length} answers`);
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
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit test: ' + error.message 
    });
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
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch submissions' 
    });
  }
};

const getSubmissionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📥 Fetching submission details for ID:', id);

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
      return res.status(404).json({ 
        success: false, 
        message: 'Submission not found' 
      });
    }

    console.log('✅ Submission found with:', {
      testTitle: submission.Test?.title,
      questionsCount: submission.Test?.Questions?.length || 0,
      answersCount: submission.Answers?.length || 0
    });

    // Debug: Log raw answers data
    console.log('🔍 Raw Answers Data:');
    if (submission.Answers && submission.Answers.length > 0) {
      submission.Answers.forEach((answer, index) => {
        console.log(`  Answer ${index + 1}:`, {
          question_id: answer.question_id,
          answer: answer.answer,
          answerType: typeof answer.answer
        });
      });
    } else {
      console.log('  No answers found in submission.Answers');
    }

    // Debug: Log raw questions data
    console.log('🔍 Raw Questions Data:');
    if (submission.Test?.Questions && submission.Test.Questions.length > 0) {
      submission.Test.Questions.forEach((question, index) => {
        console.log(`  Question ${index + 1}:`, {
          id: question.id,
          question_id: question.question_id,
          type: question.type,
          text: question.text.substring(0, 50) + '...'
        });
      });
    } else {
      console.log('  No questions found in submission.Test.Questions');
    }

    // Transform the data for frontend
    const transformedData = {
      id: submission.id,
      test_id: submission.test_id,
      role: submission.role,
      taker_name: submission.taker_name,
      taker_email: submission.taker_email,
      auto_score: submission.auto_score,
      manual_score: submission.manual_score,
      total_score: submission.total_score,
      status: submission.status,
      submitted_at: submission.submitted_at,
      
      // Include the test with questions
      test: submission.Test ? {
        id: submission.Test.id,
        title: submission.Test.title,
        description: submission.Test.description,
        role: submission.Test.role,
        duration_minutes: submission.Test.duration_minutes,
        questions: submission.Test.Questions ? submission.Test.Questions.map(question => ({
          id: question.id,
          question_id: question.question_id,
          type: question.type,
          text: question.text,
          options: question.options,
          marks: question.marks || 4
        })) : []
      } : null,
      
      // Transform answers array to object
      answers: submission.Answers ? submission.Answers.reduce((acc, answer) => {
        try {
          let parsedAnswer = answer.answer;
          
          // Try to parse JSON if it's a string
          if (typeof answer.answer === 'string') {
            try {
              parsedAnswer = JSON.parse(answer.answer);
              console.log(`✅ Successfully parsed JSON answer for question ${answer.question_id}:`, parsedAnswer);
            } catch (e) {
              // If it's not JSON, keep the original string
              console.log(`ℹ️ Answer for question ${answer.question_id} is not JSON, using as string:`, answer.answer);
              parsedAnswer = answer.answer;
            }
          } else {
            console.log(`ℹ️ Answer for question ${answer.question_id} is already parsed:`, parsedAnswer);
          }
          
          acc[answer.question_id] = parsedAnswer;
        } catch (error) {
          console.error(`❌ Error parsing answer for question ${answer.question_id}:`, error);
          acc[answer.question_id] = answer.answer;
        }
        return acc;
      }, {}) : {}
    };

    console.log('📤 Final Transformed Data:', {
      hasTest: !!transformedData.test,
      questionsCount: transformedData.test?.questions?.length || 0,
      answersCount: Object.keys(transformedData.answers).length,
      answerKeys: Object.keys(transformedData.answers),
      questionKeys: transformedData.test?.questions?.map(q => q.question_id) || []
    });

    // Additional check: Verify question-answer matching
    if (transformedData.test?.questions && transformedData.answers) {
      console.log('🔍 Question-Answer Matching Check:');
      transformedData.test.questions.forEach(question => {
        const questionId = question.question_id;
        const hasAnswer = transformedData.answers.hasOwnProperty(questionId);
        console.log(`  Q${questionId}: ${hasAnswer ? '✅ Has answer' : '❌ No answer'}`);
      });
    }

    res.json({
      success: true,
      data: transformedData
    });

  } catch (error) {
    console.error('❌ Get submission details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch submission details',
      error: error.message 
    });
  }
};

const gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { manualScore, questionScores } = req.body; // Fixed: added questionScores from request body

    console.log('📊 Grading submission:', { id, manualScore, questionScores });

    const submission = await Submission.findByPk(id);
    if (!submission) {
      return res.status(404).json({ 
        success: false, 
        message: 'Submission not found' 
      });
    }

    // Calculate total score (auto_score + manual_score)
    const totalScore = submission.auto_score + parseInt(manualScore);
    
    await submission.update({
      manual_score: parseInt(manualScore),
      total_score: totalScore,
      status: totalScore > 0 ? 'graded' : 'pending',
      graded_at: new Date()
    });

    // If question scores are provided, log them (you might need a new table for this)
    if (questionScores) {
      console.log('📝 Question scores received:', questionScores);
      // Here you can save individual question scores to a new table
      // For example: QuestionScores table with submission_id, question_id, score
    }

    console.log('✅ Submission graded successfully');

    res.json({
      success: true,
      message: 'Submission graded successfully',
      data: submission
    });
  } catch (error) {
    console.error('❌ Grade submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to grade submission' 
    });
  }
};

module.exports = { 
  submitTest, 
  getSubmissions, 
  getSubmissionDetails, 
  gradeSubmission 
};