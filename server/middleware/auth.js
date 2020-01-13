import jwt from 'jsonwebtoken';
import modal from '../modals/modal';

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

  async verifyLink(req, res, next) {
    const { email, token } = req.params;
    if (!email || !token) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid reset password link or link has expired',
      });
    }
    try {
      const user = await modal.findManager(email);
      const secret = user.password;
      const options = { expiresIn: '1d' };
      const decoded = jwt.verify(token, secret, options);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid reset password link or link has expired',
      });
    }
  }
}
export default new Authentication();
