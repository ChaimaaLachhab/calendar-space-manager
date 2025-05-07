const jwt = require('jsonwebtoken');
const createError = require('http-errors');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(createError(401, 'Token requis'));

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next(createError(401, 'Token invalide ou expiré'));
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(createError(403, 'Accès refusé: admin requis'));
  }
  next();
};
