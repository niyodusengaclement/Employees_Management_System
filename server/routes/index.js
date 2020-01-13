import express from 'express';
import action from '../controllers/action';

const route = express.Router();
route.post('/employees', action.employeeRegistration);

export default route;
