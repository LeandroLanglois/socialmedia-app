import { Router } from 'express';
import userRoutes from './user.routes.js';
import UserController from '../controllers/user.controller.js';

const routes = Router();

routes.use('/', userRoutes);
routes.post('/register', UserController.register);
routes.post('/login', UserController.login);
routes.get('/feed', UserController.getAllPosts);
routes.post('/newpost', UserController.createPost);
routes.get('/post/:id', UserController.getPostById);

export default routes;
