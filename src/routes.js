import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';
import PlanController from './app/controllers/PlanController';
import EnrollmentsController from './app/controllers/EnrollmentsController';

import authMiddleware from './app/middlewares/auth';

const route = Router();

route.post('/users', UserController.store);
route.post('/session', SessionController.store);

route.use(authMiddleware);

route.put('/users', UserController.update);

route.get('/students', StudentsController.index);
route.post('/students', StudentsController.store);
route.put('/students/:id', StudentsController.update);
route.delete('/students/:id', StudentsController.delete);

route.get('/plan', PlanController.index);
route.post('/plan', PlanController.store);
route.put('/plan/:id', PlanController.update);
route.delete('/plan/:id', PlanController.delete);

route.get('/enrollments', EnrollmentsController.index);
route.post('/enrollments', EnrollmentsController.store);
route.put('/enrollments/:id', EnrollmentsController.update);
route.delete('/enrollments/:id', EnrollmentsController.delete);

export default route;
