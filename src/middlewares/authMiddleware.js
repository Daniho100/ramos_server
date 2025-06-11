import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
  console.log('authMiddleware hit');
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided');
    return next({ status: 401, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log('Invalid token:', error);
    return next({ status: 401, message: 'Invalid token' });
  }
}

export default authMiddleware ;