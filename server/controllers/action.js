import cloudinary from 'cloudinary';
import bcrypt from 'bcryptjs';
import modal from '../modals/modal';
import validation from '../helpers/validation';
import register from './register';
import db from '../modals/database/index';
import notification from '../modals/notification';

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

  async login(req, res) {
    const { error } = validation.signinValidation(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.details[0].message.split('"').join(''),
      });
    }
    try {
      const exist = await modal.findManager(req.body.email);
      if (!exist) {
        return res.status(401).json({
          status: 401,
          error: 'Invalid email or password',
        });
      }
      const isValid = await bcrypt.compare(req.body.password, exist.password);
      if (!isValid) {
        return res.status(401).json({
          status: 401,
          error: 'Invalid email or password',
        });
      }
      const token = modal.generateToken(exist);
      return res.status(200).header('x-auth', token).json({
        status: 200,
        message: 'Manager is successfully logged in',
        data: {
          data: {
            national_id: exist.national_id,
            employee_name: exist.employee_name,
            email: exist.email,
            phone: exist.phone,
            token,
          },
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Internal Server Error',
      });
    }
  }

  async delete(req, res) {
    const id = parseInt(req.params.id, 10);
    const exist = await modal.findEmployeeById(id);
    if (!exist) {
      return res.status(404).json({
        status: 401,
        error: 'No Employee with that ID ',
      });
    }
    const { rows } = await db.query('DELETE FROM employees WHERE id=$1 returning *', [id]);
    return res.status(200).json({
      status: 200,
      data: {
        id: rows[0].id,
        message: 'Employee has been deleted',
      },
    });
  }

  async activate(req, res) {
    const id = parseInt(req.params.id, 10);
    const exist = await modal.findEmployeeById(id);
    if (!exist) {
      return res.status(404).json({
        status: 401,
        error: 'No Employee with that ID ',
      });
    }
    const { rows } = await db.query(`UPDATE employees SET status = 'active' WHERE id = $1 returning *`, [id]);
    return res.status(200).json({
      status: 200,
      data: {
        id: rows[0].id,
        message: 'Employee has been activated',
        employee_name: rows[0].employee_name,
      },
    });
  }

  async suspend(req, res) {
    const id = parseInt(req.params.id, 10);
    const exist = await modal.findEmployeeById(id);
    if (!exist) {
      return res.status(404).json({
        status: 401,
        error: 'No Employee with that ID ',
      });
    }
    const { rows } = await db.query(`UPDATE employees SET status = 'inactive' WHERE id = $1 returning *`, [id]);
    return res.status(200).json({
      status: 200,
      data: {
        id: rows[0].id,
        message: 'Employee has been suspended successfully',
        employee_name: rows[0].employee_name,
      },
    });
  }

  async edit(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const exist = await modal.findEmployeeById(id);
      if (!exist) {
        return res.status(404).json({
          status: 401,
          error: 'No Employee with that ID ',
        });
      }
      const { error } = validation.employeeSignupValidation(req.body);
      if (error) {
        return res.status(400).json({
          status: 400,
          error: error.details[0].message.split('"').join(''),
        });
      }
      const employeeInfo = [
        req.body.employee_name,
        req.body.national_id,
        req.body.phone,
        req.body.email,
        req.body.dob,
        req.body.status,
        req.body.position,
      ];
      const info = await modal.updateEmployee([...employeeInfo, id]);
      if (info) {
        return res.status(200).json({
          status: 200,
          message: 'Employee updated successfully',
          data: {
            national_id: info.national_id,
            employee_name: info.employee_name,
            email: info.email,
            phone: info.phone,
          },
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Internal Server Error',
      });
    }
  }

  async search(req, res) {
    const input = req.body.search;
    if (!input) {
      return res.status(400).json({
        status: 400,
        error: 'Input something to search (name, email, nation ID, position)',
      });
    }
    const info = await modal.searchEmployee(input);
    if (!info) {
      return res.status(404).json({
        status: 404,
        error: 'Employee not found',
      });
    }
    return res.status(200).json({
      status: 200,
      data: info,
    });
  }

  async forgetPassword(req, res) {
    const { error } = validation.emailValidator(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.details[0].message.split('"').join(''),
      });
    }
    const isExist = await modal.findManager(req.body.email);
    if (!isExist) {
      return res.status(404).json({
        status: 404,
        error: 'Email not found in our database',
      });
    }
    const token = modal.generateResetToken(isExist);
    const url = `https://employeesmanagementsystem.herokuapp.com/reset/${isExist.email}/${token}`;
    const msg = `You've requested a password reset, kindly click this link ${url} to reset your password`;
    notification.SendNotification(isExist, msg);
    return res.status(200).json({
      status: 200,
      message: 'Link to reset password sent to your email',
    });
  }

  async resetPassword(req, res) {
    const { password, confirmPassword } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({
        status: 400,
        error: 'Password must be atleast 6 characters long',
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 400,
        error: 'Password don\'t match',
      });
    }
    try {
      const newPassword = await modal.hashPassword(password);
      const text = 'UPDATE managers SET password=$1 WHERE email=$2 returning *';
      const values = [
        newPassword,
        req.user.email,
      ];
      const { rows } = await db.query(text, values);
      return res.status(200).json({
        status: 200,
        message: 'Password updated successfully',
        data: {
          national_id: rows[0].national_id,
          employee_name: rows[0].employee_name,
          email: rows[0].email,
          phone: rows[0].phone,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Internal Server Error',
      });
    }
  }
}
export default new Action();
