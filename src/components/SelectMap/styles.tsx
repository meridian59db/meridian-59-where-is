import styled from 'styled-components';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

export const Select = styled.select`
  border-radius: 5px;
  padding: 5px;
  background-color: #0d2136;
  height: fit-content;
  width: 100%;

  option {
    color: #97a9c3;
  }
`;

export const Check = styled(IoMdCheckmarkCircleOutline)`
  font-size: 1.3rem !important;
  margin-left: 5px;
  cursor: pointer;

  &&:hover {
    color: white;
  }
`;
