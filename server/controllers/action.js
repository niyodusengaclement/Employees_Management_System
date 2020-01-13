import cloudinary from 'cloudinary';
import modal from '../modals/modal';
import validation from '../helpers/validation';
import register from './register';

cloudinary.config({
  cloud_name: 'broadcaster',
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

let empImg;
class Action {
  async employeeRegistration(req, res) {
    const { error } = validation.employeeSignupValidation(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.details[0].message.split('"').join(''),
      });
    }
    try {
      const exist = await modal.findEmployee(req.body.email, req.body.national_id, req.body.phone);
      if (exist) {
        return res.status(401).json({
          status: 401,
          error: 'Employee already exist',
        });
      }
      if (!req.files) return register.employee(req, res, '');
      const passport = req.files.passport_photo;
      cloudinary.v2.uploader.upload(passport.tempFilePath, (err, result) => {
        empImg = result.url;
        return empImg;
      });
      setTimeout(() => register.employee(req, res, empImg), 5000);
      return {};
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Internal Server Error',
      });
    }
  }

  async managerRegistration(req, res) {
    const { error } = validation.managerSignupValidation(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.details[0].message.split('"').join(''),
      });
    }
    try {
      const exist = await modal.findManager(req.body.email, req.body.national_id, req.body.phone);
      if (exist) {
        return res.status(401).json({
          status: 401,
          error: 'Manager already exist',
        });
      }
      if (!req.files) return register.manager(req, res, '');
      const passport = req.files.passport_photo;
      cloudinary.v2.uploader.upload(passport.tempFilePath, (err, result) => {
        empImg = result.url;
        return empImg;
      });
      setTimeout(() => register.manager(req, res, empImg), 5000);
      return {};
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Internal Server Error',
      });
    }
  }

  async managerConfirmation(req, res) {
    const { email, token } = req.params;
    if (!email || !token) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid confirmation link',
      });
    }
    try {
      const manager = await modal.findManager(email);
      if (!manager) {
        return res.status(401).json({
          status: 401,
          error: 'Invalid confirmation link',
        });
      }
      const data = modal.verifyConfirmationLink(token);
      if (!data.email) {
        return res.status(401).json({
          status: 401,
          error: 'Invalid confirmation link',
        });
      }
      if (modal.activateManager(email)) {
        return res.status(200).json({
          status: 200,
          error: 'Thank you for activating your account, login to continue',
        });
      }
    } catch (err) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid confirmation link',
      });
    }
  }
}
export default new Action();
