import React from 'react';
import { useQueryClient } from 'react-query';
import { isMobile } from 'react-device-detect';

import { TodoFilter } from '../../todo-filters';
import { TodoSearch } from '../../todo-search';
import { TodoHeaderStyled } from './todo-header.styled';
import { TodoFilterEnum } from '../../todo.enums';
import { QUERY_KEYS } from '../../../../consts/app-keys.const';
import { selectTodoFilter } from '../../todo.selectors';
import { TodoFilters } from '../../../../types/todo/todo.types';
import { debounce } from '../../../../utils';

export interface TodoTableHeaderProps {
  variant: string;
}

export const TodoTableHeader = ({ variant }: TodoTableHeaderProps) => {
  const queryClient = useQueryClient();
  const filter = selectTodoFilter() as TodoFilters;

  return (
    <TodoHeaderStyled>
      <TodoFilter
        onChange={(index) => {
          const tab =
            Object.values(TodoFilterEnum)[index] === 'All'
              ? ''
              : Object.values(TodoFilterEnum)[index];

          queryClient.setQueriesData(QUERY_KEYS.FILTER, {
            ...filter,
            filter: tab.toLocaleLowerCase(),
            page: 1
          });
        }}
        width="100%"
        justifyContent={isMobile ? 'space-around' : 'flex-start'}
        size="md"
        variant={isMobile ? 'line' : 'enclosed'}
      />

      <TodoSearch
        onChange={debounce((event) => {
          const { value } = event.target as HTMLInputElement;

          queryClient.setQueriesData(QUERY_KEYS.FILTER, {
            ...filter,
            search: value,
            page: 1
          });
        }, 500)}
        width={isMobile ? '100%' : 'fit-content'}
        size="md"
        variant={variant}
      />
    </TodoHeaderStyled>
  );
};
