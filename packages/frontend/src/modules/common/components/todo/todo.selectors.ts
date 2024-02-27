import { useMemo } from 'react';

import { InfiniteData, useQuery } from 'react-query';
import { QUERY_KEYS } from '../../consts/app-keys.const';
import { TodoFilters } from '../../types/todo/todo.types';
import TodoModel from '../../types/todo/todo.model';

export const selectTodos = () => {
  const { data } = useQuery<TodoModel[]>({
    queryKey: [QUERY_KEYS.TODOS],
    select: (state) => state
  });

  return data;
};

export const selectTodoFilter = () => {
  const { data } = useQuery<TodoFilters>({
    queryKey: [QUERY_KEYS.FILTER],
    select: (state) => state
  });

  return data;
};

export const useFormattedTodos = (todos: InfiniteData<TodoModel[]> | undefined) => {
  const formattedTodos = useMemo(() => {
    if (!todos) {
      return [];
    }

    return todos.pages.flatMap((page) => page.map((todo) => todo));
  }, [todos]);

  return formattedTodos;
};
