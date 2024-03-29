import passport from 'passport';
import { Router } from 'express';

import TodoService from '../../services/todo.service';
import todoController from '../../controllers/todo.controller';
import {
  isTodoCreator,
  validateRequestBody,
  isExist,
  tryCatch
} from '../middlewares/utils.middlewares';
import { todoValidationBodySchema } from '../middlewares/validation.schemas';

const todosRouter: Router = Router();

todosRouter.get('', tryCatch(todoController.getAllTodo.bind(todoController)));

todosRouter.get(
  '/:id',
  isExist(TodoService),
  tryCatch(todoController.getTodo.bind(todoController))
);

todosRouter.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  validateRequestBody(todoValidationBodySchema),
  tryCatch(todoController.createTodo.bind(todoController))
);

todosRouter.put(
  '/update/:id',
  passport.authenticate('jwt', { session: false }),
  isExist(TodoService),
  isTodoCreator,
  validateRequestBody(todoValidationBodySchema),
  tryCatch(todoController.updateTodo.bind(todoController))
);

todosRouter.delete(
  '/delete/:id',
  passport.authenticate('jwt', { session: false }),
  isExist(TodoService),
  isTodoCreator,
  tryCatch(todoController.deleteTodo.bind(todoController))
);

export default todosRouter;
