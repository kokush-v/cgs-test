import { Like } from 'typeorm';
import { Todo } from '../entities/Todo.entity';
import { ITodo, TodoFilters } from '../types/todos.type';

export default class TodoService {
  async findAll(
    filter: TodoFilters,
    search: string,
    page: number
  ): Promise<{ todos: Todo[]; totalCount: number }> {
    const whereClause: any = {};

    if (filter) {
      whereClause[filter] = true;
    }

    if (search && search.length > 0) {
      whereClause.title = Like(`%${search}%`);
    }

    const [todos, todosCount] = await Todo.findAndCount({
      skip: (page - 1) * 10,
      take: 10,
      where: whereClause,
      order: {
        id: 'ASC'
      }
    });

    return { todos, totalCount: todosCount };
  }

  async findOne(todoId: number): Promise<Todo> {
    const existTodo = await Todo.findOneByOrFail({ id: todoId });
    return existTodo;
  }

  async create(todo: ITodo): Promise<Todo> {
    const newTodo = Todo.create({ ...todo, creator: { id: todo.creatorId } });

    await newTodo.save();

    return newTodo;
  }

  async update(todoId: number, todo: ITodo): Promise<Todo> {
    const existTodo = await Todo.findOneByOrFail({ id: todoId });
    Object.assign(existTodo, todo);

    await existTodo.save();

    return existTodo;
  }

  async deleteOne(todoId: number): Promise<Todo> {
    const deletedTodo = await Todo.findOneByOrFail({ id: todoId });
    await deletedTodo.remove();
    return deletedTodo;
  }
}
