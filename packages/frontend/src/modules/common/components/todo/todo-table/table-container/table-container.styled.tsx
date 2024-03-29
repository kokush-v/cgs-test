import styled from 'styled-components';
import { COLORS, FONTS } from '../../../../../theme';

export const TodoTableContainerStyled = styled.div`
  border-left: 1px solid ${COLORS.gray};
  border-right: 1px solid ${COLORS.gray};

  & td {
    text-align: center;
    height: 100%;
  }
  ,
  & th {
    text-align: center;
    vertical-align: middle;
  }
`;

export const StyledTableErrorMessage = styled.div`
  text-align: center;
  font-size: ${FONTS.SIZES.l};
  font-weight: ${FONTS.WEIGHTS.bold};
  margin: 2em;
`;
