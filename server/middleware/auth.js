import jwt from 'jsonwebtoken';

class Authentication {
  access(req, res, next) {
    const check = req.header('x-auth');
    if (!check) {
      return res.status(401).json({
        status: 401,
        error: 'No token provided! Provide token and try again',
      });
    }
    try {
      const options = { expiresIn: '1d' };
      const decoded = jwt.verify(check, process.env.SECRET, options);
      req.user = decoded;
      if (decoded.status === 'inactive') {
        return res.status(403).json({
          status: 403,
          error: 'Your account is not activated, you cannot perform manager activities ',
        });
      }
      return next();
    } catch (err) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid token provided, check your token please',
      });
    }
  }
}
export default new Authentication();
