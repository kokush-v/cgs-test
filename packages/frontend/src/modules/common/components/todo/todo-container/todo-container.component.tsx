import React, { useEffect } from 'react';
import { Button, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import {
  BrowserView,
  MobileOnlyView,
  TabletView,
  isMobile,
  isMobileOnly
} from 'react-device-detect';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';

import { TodoTableHeader } from '../todo-table/table-header';
import { TodoTableContainer } from '../todo-table/table-container';
import {
  StyledTitle,
  StyledTodoMobileContainer,
  StyledTodoTableContainer,
  TodoContainerStyled
} from './todo-container.styled';
import { FormModal } from '../todo-form/form-modal';
import { TodoListContainer } from '../todo-list-container';
import { QUERY_KEYS, ROUTER_KEYS } from '../../../consts/app-keys.const';
import todoService from '../todo.service';
import { TodoSwiperContainer } from '../todo-swiper-container';
import { selectUser } from '../../user/user.selector';
import { TodoFilters } from '../../../types/todo/todo.types';
import { LoadMore } from '../load-more';
import TodoModel from '../../../types/todo/todo.model';
import { useFormattedTodos } from '../todo.selectors';
import { buildQueryString } from '../../../utils';

/* eslint-disable */

export const TodoContainer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = selectUser();

  const searchParams = new URLSearchParams(window.location.search);

  const { data: params } = useQuery<TodoFilters>({
    queryKey: [QUERY_KEYS.FILTER],
    initialData: {
      filter: (searchParams.get('filter') as '') || '',
      search: searchParams.get('search') || '',
      page: Number(searchParams.get('page')) || 1,
      maxPages: 1
    },
    queryFn: async () => ({
      filter: (searchParams.get('filter') as '') || '',
      search: searchParams.get('search') || '',
      page: Number(searchParams.get('page')) || 1,
      maxPages: 1
    }),
    onSuccess: (data) => {
      const newUrl = buildQueryString(data);
      window.history.replaceState(null, '', `${window.location.pathname}?${newUrl}`);
    }
  });

  const {
    data: todos,
    fetchNextPage,
    isError,
    isLoading,
    refetch
  } = useInfiniteQuery<TodoModel[]>(
    [QUERY_KEYS.TODOS],
    async ({ pageParam = 1 }) => {
      const response = await todoService.getTodos(params, pageParam);

      const updatedParams = {
        ...params,
        maxPages: response?.pages
      };

      queryClient.setQueryData([QUERY_KEYS.FILTER], updatedParams);

      return response.data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 10 ? allPages.length + 1 : undefined;
      }
    }
  );

  const fetchMore = async () => {
    fetchNextPage().then(({ data }) => {
      const nextPage =
        (params?.page ?? 0) > (params?.maxPages ?? 0)
          ? params?.maxPages ?? 0
          : (params?.page ?? 1) + 1;

      const updatedParams = {
        ...params,
        page: nextPage,
        maxPages: data?.pageParams[data.pageParams.length - 1] || params?.maxPages
      };

      queryClient.setQueryData([QUERY_KEYS.FILTER], updatedParams);
    });
  };

  const formatTodos = useFormattedTodos(todos);

  useEffect(() => {
    refetch();
  }, [params]);

  return (
    <TodoContainerStyled>
      <StyledTitle>
        <h1>TODO List</h1>
        <Button
          onClick={() => {
            user ? onOpen() : navigate(ROUTER_KEYS.AUTH.LOGIN);
          }}
          colorScheme="purple"
          variant="outline"
          leftIcon={<AddIcon boxSize={3} />}
        >
          NEW TODO
        </Button>
        <FormModal isOpen={isOpen} formType="ADD" onClose={onClose} />
      </StyledTitle>

      <BrowserView>
        <StyledTodoTableContainer>
          <TodoTableHeader variant="enclosed" />
          <TodoTableContainer data={formatTodos} isLoading={isLoading} isError={isError} />
        </StyledTodoTableContainer>
      </BrowserView>

      <TabletView>
        <TodoTableHeader variant="flushed" />
        <TodoSwiperContainer
          fetchMoreFunc={fetchMore}
          data={formatTodos}
          isLoading={isLoading}
          isError={isError}
        />
      </TabletView>

      <MobileOnlyView>
        <StyledTodoMobileContainer>
          <TodoTableHeader variant="flushed" />
          <TodoListContainer data={formatTodos} isLoading={isLoading} isError={isError} />
        </StyledTodoMobileContainer>
      </MobileOnlyView>

      {!(isMobile && !isMobileOnly) && (
        <LoadMore
          isDisabled={!!params?.maxPages && params?.page ? params.page === params.maxPages : false}
          colorScheme="teal"
          variant={'outline'}
          alignSelf={'center'}
          onClick={fetchMore}
        />
      )}
    </TodoContainerStyled>
  );
};
