import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hackgov-super-secret-key-12345';

export const verifyToken = (req: any, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Authentication required. No session token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired session token.' });
  }
};

export const requireAdmin = (req: any, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Administrative clearance required to access this resource.' });
    return;
  }
  next();
};
