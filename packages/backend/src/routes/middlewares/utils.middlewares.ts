import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import TodoService from '../../services/todo.service';
import UserService from '../../services/user.service';
import { GetExistRequest, GetTodoRequest } from '../../types/requests.types';
import { User } from '../../entities/User.entity';
import { Todo } from '../../entities/Todo.entity';
import { ERRORS } from '../../constants';

type FindServices = TodoService | UserService;

export const validateRequestBody =
  (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ error: validationResult.error.details.map((d) => d.message).join(', ') });
    }

    next();
  };

export const isExist =
  <T extends FindServices>(EntityClass: new () => T) =>
  async (req: GetExistRequest, res: Response, next: NextFunction) => {
    try {
      const entity = new EntityClass();

      if (entity instanceof UserService) {
        const { email } = req.body;

        try {
          await entity.findOne(email);

          if (req.route.path !== '/register') {
            return next();
          }
        } catch (error) {
          if (req.route.path === '/register') {
            return next();
          }

          throw new Error(ERRORS.USER.NOT_EXIST);
        }

        throw new Error(ERRORS.USER.NOT_EXIST);
      } else if (entity instanceof TodoService) {
        const { id } = req.params;
        if (!id) throw new Error(ERRORS.ID_UNDEFINED);

        await entity.findOne(Number(id));
      }

      next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({
          error: error.name === 'EntityNotFoundError' ? ERRORS.NOT_FOUND : error.message
        });
      }
    }
  };

export const isTodoCreator = async (req: GetTodoRequest, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.user as User;
    const { id: todoId } = req.params;

    const isCreator = await Todo.existsBy({ id: Number(todoId), creator: { id: userId } });

    if (!isCreator) throw Error('NOT_CREATOR');

    next();
  } catch (error) {
    if (error instanceof Error) res.status(400).json({ error: error.message });
  }
};

export const tryCatch =
  (
    handler: (
      req: Request<any, any, any, any>,
      res: Response<any>,
      next: NextFunction
    ) => Promise<void>
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      if (error instanceof Error) res.status(400).json({ error: error.message });
    }
  };
