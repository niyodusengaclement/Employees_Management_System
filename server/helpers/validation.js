import joi from 'joi';

class Validation {
  employeeSignupValidation(input) {
    const validateSchema = {
      id: joi.optional(),
      employee_name: joi.string().required(),
      national_id: joi.string().required().min(16).max(16),
      passport_photo: joi.optional(),
      phone: joi.string().required().min(12).max(12),
      email: joi.string().email().required(),
      dob: joi.string().required(),
      status: joi.string().required(),
      position: joi.string().required(),
    };
    return joi.validate(input, validateSchema);
  }
}
export default new Validation();