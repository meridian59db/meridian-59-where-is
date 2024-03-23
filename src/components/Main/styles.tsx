import styled from 'styled-components';

// eslint-disable-next-line import/prefer-default-export
export const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0.1%;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;
