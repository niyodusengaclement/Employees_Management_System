import cloudinary from 'cloudinary';
import notification from '../modals/notification';
import modal from '../modals/modal';
import validation from '../helpers/validation';

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
      const passport = req.files.passport_photo;
      if (!passport) return {};
      cloudinary.v2.uploader.upload(passport.tempFilePath, (err, result) => {
        empImg = result.url;
        return empImg;
      });
      setTimeout(async () => {
        const employeeInfo = [
          req.body.employee_name,
          req.body.national_id,
          empImg,
          req.body.phone,
          req.body.email,
          req.body.dob,
          req.body.status,
          req.body.position,
        ];
        const info = await modal.addEmployee(employeeInfo);
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
      }, 3000);
      return {};
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Internal Server Error',
      });
    }
  }
}
export default new Action();
