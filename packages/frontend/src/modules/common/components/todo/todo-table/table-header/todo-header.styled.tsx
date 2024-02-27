import { isMobile } from 'react-device-detect';
import styled from 'styled-components';

export const TodoHeaderStyled = styled.div`
  display: flex;
  justify-content: space-around;
  ${isMobile && 'flex-direction: column-reverse;'}
`;
