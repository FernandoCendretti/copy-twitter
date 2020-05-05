import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import PostController from './app/controllers/PostController';
import CommentsController from './app/controllers/CommentsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.get('/users', UserController.get);
routes.delete('/users', UserController.delete);

routes.post('/posts', PostController.store);
routes.get('/posts', PostController.getAll);
routes.get('/posts/user', PostController.getUserPost);
routes.put('/posts/:id', PostController.update);
routes.delete('/posts/:id', PostController.delete);

routes.post('/comments', CommentsController.store);
routes.put('/comments/:id', CommentsController.update);
routes.delete('/comments/:id', CommentsController.delete);

export default routes;
