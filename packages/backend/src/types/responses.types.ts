import { Todo } from '../entities/Todo.entity';
import { IUser, IUserSession } from './user.type';

export interface Status {
  message?: string;
}

export interface Pages {
  pages: number;
}

export interface GetTodosResponse extends Status, Pages {
  data: Todo[];
}

export interface GetTodoResponse extends Status {
  data: Todo;
}

export interface GetUserResponse {
  data?: IUserSession;
}

export interface CreateUserResponse extends Status, GetUserResponse {}

export interface LoginUserResponse extends Status {
  data?: IUser;
  token: string;
}
