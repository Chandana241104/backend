const { Test, Submission, sequelize } = require('../models');
const { exportToCSV } = require('../utils/csvExport');

const getDashboardStats = async (req, res) => {
  try {
    const totalTests = await Test.count();
    const totalSubmissions = await Submission.count();
    
    const gradedSubmissions = await Submission.count({ 
      where: { status: 'graded' } 
    });
    
    const pendingSubmissions = await Submission.count({ 
      where: { status: 'pending' } 
    });

    const memberSubmissions = await Submission.count({ 
      where: { role: 'member' } 
    });
    
    const mentorSubmissions = await Submission.count({ 
      where: { role: 'mentor' } 
    });

    res.json({
      success: true,
      data: {
        totalTests,
        totalSubmissions,
        gradedSubmissions,
        pendingSubmissions,
        memberSubmissions,
        mentorSubmissions
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard stats' 
    });
  }
};

const exportSubmissions = async (req, res) => {
  try {
    const { role, status } = req.query;

    const whereClause = {};
    if (role) whereClause.role = role;
    if (status) whereClause.status = status;

    const submissions = await Submission.findAll({
      where: whereClause,
      include: [{
        model: Test,
        attributes: ['title']
      }],
      order: [['submitted_at', 'DESC']]
    });

    const csvData = await exportToCSV(submissions);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=submissions.csv');
    res.send(csvData);
  } catch (error) {
    console.error('Export submissions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to export submissions' 
    });
  }
};

module.exports = { getDashboardStats, exportSubmissions };