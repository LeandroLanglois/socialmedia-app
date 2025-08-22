import { Router } from 'express';
import userRoutes from './user.routes.js';
import UserController from '../controllers/user.controller.js';

const routes = Router();

routes.use('/', userRoutes);
routes.post('/register', UserController.register);
routes.post('/login', UserController.login);
routes.get('/feed', (req, res) => {
  res.json([
    { id: 1, title: "Primeiro post", description: "Descrição do post" },
    { id: 2, title: "Segundo post", description: "Outro post aqui" }
  ]);
});
routes.post('/newpost', UserController.createPost);

export default routes;
