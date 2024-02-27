import React from 'react';
import { Spinner } from '@chakra-ui/react';

import { TodoDataTable } from '../table/table.component';
import { useTodoColumns } from './useTodoColumns';
import { StyledTableErrorMessage, TodoTableContainerStyled } from './table-container.styled';
import { ITodo } from '../../../../types/todo/todo.types';

interface TodoTableContainerProps {
  data: ITodo[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const TodoTableContainer = ({ data, isLoading, isError }: TodoTableContainerProps) => (
  <TodoTableContainerStyled>
    {isLoading ? (
      <Spinner margin="2em" size="md" />
    ) : isError || data === undefined ? (
      <StyledTableErrorMessage>Something bad happend...</StyledTableErrorMessage>
    ) : data.length === 0 ? (
      <StyledTableErrorMessage>No data</StyledTableErrorMessage>
    ) : (
      <TodoDataTable columns={useTodoColumns()} data={data} />
    )}
  </TodoTableContainerStyled>
);
