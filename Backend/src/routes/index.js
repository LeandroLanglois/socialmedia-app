import { Router } from 'express';
import userRoutes from './user.routes.js';
import UserController from '../controllers/user.controller.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";

const routes = Router();

routes.use('/', userRoutes);
routes.post('/register', UserController.register);
routes.post('/login', UserController.login);
routes.get('/feed', UserController.getAllPosts);
routes.post('/newpost', UserController.createPost);
routes.get('/post/:id', UserController.getPostById);
// Likes & Dislikes
routes.post('/post/:postId/like', authMiddleware, UserController.likePost);
routes.post('/post/:postId/dislike', authMiddleware, UserController.dislikePost);
routes.delete('/post/:postId/like', authMiddleware, UserController.removeLikeDislike);

// Comentários
routes.post('/post/:postId/comment', authMiddleware, UserController.addComment);
routes.get('/post/:postId/comments', UserController.getComments);


export default routes;
