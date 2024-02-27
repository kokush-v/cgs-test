import { ITodo } from './todo.types';

class TodoModel implements ITodo {
  id: number;

  title: string;

  description: string;

  private: boolean;

  completed: boolean;

  creatorId?: number;

  constructor(
    title: string,
    description: string,
    isPrivate: boolean,
    isCompleted: boolean,
    id: number = -1,
    creatorId?: number
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.private = isPrivate;
    this.completed = isCompleted;
    this.creatorId = creatorId;
  }
}

const createTodoModel = (todoFromServer: ITodo) =>
  new TodoModel(
    todoFromServer.title,
    todoFromServer.description,
    todoFromServer.private,
    todoFromServer.completed,
    todoFromServer.id,
    todoFromServer.creatorId
  );

export { createTodoModel };

export default TodoModel;
