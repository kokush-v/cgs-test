import HttpService from '../../../api/http.service';
import { BACKEND_KEYS } from '../../consts/app-keys.const';
import { createTodoModel } from '../../types/todo/todo.model';
import { ITodo, TodoFilters } from '../../types/todo/todo.types';

class TodoService extends HttpService {
  async getTodos(filter: Omit<TodoFilters, 'maxPages'> | undefined, page: number) {
    const { data, pages = 1 } = await this.get<ITodo[]>({
      url: BACKEND_KEYS.TODOS.ROOT,
      params: { ...filter, page }
    });

    return { data: data.map((todo) => createTodoModel(todo)), pages };
  }

  async createTodo(body: ITodo) {
    const { data } = await this.put<ITodo>({
      method: 'post',
      url: BACKEND_KEYS.TODOS.CREATE,
      data: body
    });

    return data;
  }

  async updateTodo({ id, ...body }: ITodo) {
    const { data } = await this.put<ITodo>({
      method: 'put',
      url: BACKEND_KEYS.TODOS.UPDATE(id),
      data: body
    });

    return data;
  }

  async deleteTodo({ id }: ITodo) {
    const { data } = await this.delete<ITodo>({
      method: 'delete',
      url: BACKEND_KEYS.TODOS.DELETE(id)
    });

    return data;
  }
}

export default new TodoService();
