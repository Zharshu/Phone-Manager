const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('Auth Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Authorization token missing or invalid');
    return res.status(401).json({
       message: 'Authorization token missing or invalid' 
      });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.log('Token verification error:', error.message);
    return res.status(401).json({
       message: 'Invalid token'
       });
  }
};

module.exports = authMiddleware;
