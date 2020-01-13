import cloudinary from 'cloudinary';
import notification from '../modals/notification';
import modal from '../modals/modal';

cloudinary.config({
  cloud_name: 'broadcaster',
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

class Register {
  async employee(req, res, empImg) {
    try {
      const employeeInfo = [
        req.body.employee_name,
        req.body.national_id,
        req.body.phone,
        req.body.email,
        req.body.dob,
        req.body.status,
        req.body.position,
      ];
      const info = await modal.addEmployee([...employeeInfo, empImg]);
      const message = 'You have successfully registered in employee management system at Awesomity  ';
      if (info) {
        notification.SendNotification(info, message);
        return res.status(201).json({
          status: 201,
          message: 'Employee registered successfully',
          data: {
            national_id: info.national_id,
            employee_name: info.employee_name,
            photo_url: empImg,
            email: info.email,
            phone: info.phone,
          },
        });
      }
      return info;
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Internal Server Error',
      });
    }
  }

  async manager(req, res, empImg) {
    try {
      const password = await modal.hashPassword(req.body.password);
      const employeeInfo = [
        req.body.employee_name,
        req.body.national_id,
        empImg,
        req.body.phone,
        req.body.email,
        req.body.dob,
        'inactive',
        'Manager',
        password,
      ];
      const info = await modal.addManager(employeeInfo);
      const token = modal.confirmationLink(info);
      const link = `https://employeesmanagementsystem.herokuapp.com/manager/${req.body.email}/${token}/confirm`;
      const message = `You have registered in employee management system as Manager, confirm this action by clicking the link below 
      ${link} `;
      if (info) {
        notification.SendNotification(info, message);
        return res.status(201).json({
          status: 201,
          message: 'We have sent confirmation link on your email, Check your email to continue',
          data: {
            national_id: info.national_id,
            employee_name: info.employee_name,
            photo_url: empImg,
            email: info.email,
            phone: info.phone,
          },
        });
      }
      return info;
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Internal Server Error',
      });
    }
  }
}
export default new Register();
