import express from 'express';
import action from '../controllers/action';

const route = express.Router();
route.post('/employees', action.employeeRegistration);
route.post('/manager', action.managerRegistration);
route.patch('/manager/:email/:token/confirm', action.managerConfirmation);

export default route;
