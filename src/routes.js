import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';
import PlanController from './app/controllers/PlanController';

import authMiddleware from './app/middlewares/auth';

const route = Router();

route.post('/users', UserController.store);
route.post('/session', SessionController.store);

route.use(authMiddleware);

route.put('/users', UserController.update);

route.post('/students', StudentsController.store);
route.put('/students', StudentsController.update);

route.get('/plan', PlanController.index);
route.post('/plan', PlanController.store);
route.put('/plan/:id', PlanController.update);
route.delete('/plan/:id', PlanController.delete);

export default route;
