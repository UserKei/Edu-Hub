const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '令牌无效或已过期' });
    }
    req.user = user;
    next();
  });
};

exports.requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: '未认证' });
  }
  
  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ message: '权限不足：需要管理员权限' });
  }
  
  next();
};

exports.requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: '未认证' });
  }
  
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ message: '权限不足：需要超级管理员权限' });
  }
  
  next();
};
