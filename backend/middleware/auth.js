
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    next();
  });
};

export const isAdmin = (req, res, next) => {

  User.findById(req.userId).then(user => {
    if (user && user.isAdmin) {
      next();
    } else {
      res.status(403).send({ message: 'Require Admin Role!' });
    }
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};
