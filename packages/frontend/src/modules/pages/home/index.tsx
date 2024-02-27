import React from 'react';
import { TodoContainer } from '../../common/components/todo/todo-container';
import { UserHeader } from '../../common/components/user/user-header';

const HomePageContainer = () => (
  <>
    <UserHeader />
    <TodoContainer />
  </>
);

export default HomePageContainer;
