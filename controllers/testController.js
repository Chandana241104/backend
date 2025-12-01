const { Test, Question } = require('../models');

const getTestsByRole = async (req, res) => {
  try {
    const { role } = req.query;
    
    if (!role || !['member', 'mentor'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid role (member/mentor) is required' 
      });
    }

    const tests = await Test.findAll({
      where: { 
        role, 
        published: true 
      },
      attributes: ['id', 'title', 'description', 'duration_minutes', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: tests
    });
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch tests' 
    });
  }
};

const getTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const test = await Test.findByPk(id, {
      include: [{
        model: Question,
        attributes: ['id', 'question_id', 'type', 'text', 'options', 'marks'],
        order: [['id', 'ASC']]
      }]
    });

    if (!test) {
      return res.status(404).json({ 
        success: false, 
        message: 'Test not found' 
      });
    }

    // Transform questions to match frontend expected format
    const transformedTest = {
      ...test.toJSON(),
      questions: test.Questions.map(q => ({
        id: q.question_id,
        type: q.type,
        text: q.text,
        options: q.options,
        marks: q.marks
      }))
    };

    delete transformedTest.Questions;

    res.json({
      success: true,
      data: transformedTest
    });
  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch test' 
    });
  }
};

module.exports = { getTestsByRole, getTestById };