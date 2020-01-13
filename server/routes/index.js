import express from 'express';
import action from '../controllers/action';
import auth from '../middleware/auth';

const route = express.Router();
route.post('/employees', action.employeeRegistration);
route.post('/manager', action.managerRegistration);
route.patch('/manager/:email/:token/confirm', action.managerConfirmation);
route.post('/login', action.login);
route.delete('/employees/:id', auth.access, action.delete);
route.put('/employees/:id/activate', auth.access, action.activate);
route.put('/employees/:id/suspend', auth.access, action.suspend);
route.put('/employees/:id', auth.access, action.edit);

export default route;
