const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'innoviii_secret');
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin role required.' 
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

module.exports = { authenticateAdmin };