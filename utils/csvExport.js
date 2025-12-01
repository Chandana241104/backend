const { stringify } = require('csv-stringify/sync');

const exportToCSV = (submissions) => {
  const csvData = submissions.map(submission => ({
    'Submission ID': submission.id,
    'Test Title': submission.Test?.title || 'N/A',
    'Role': submission.role,
    'Taker Name': submission.taker_name,
    'Taker Email': submission.taker_email,
    'Auto Score': submission.auto_score,
    'Manual Score': submission.manual_score,
    'Total Score': submission.total_score,
    'Status': submission.status,
    'Submitted At': submission.submitted_at
  }));

  return stringify(csvData, {
    header: true,
    columns: [
      'Submission ID',
      'Test Title',
      'Role',
      'Taker Name',
      'Taker Email',
      'Auto Score',
      'Manual Score',
      'Total Score',
      'Status',
      'Submitted At'
    ]
  });
};

module.exports = { exportToCSV };