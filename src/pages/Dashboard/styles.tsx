import styled from 'styled-components';

export const CardsContainer = styled.div`
  display: flex;
  gap: 15px;
  flex-direction: column;

  .disabled-option {
    color: gray;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const Card = styled.div`
  display: flex;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 2%;
  flex-direction: column;
  gap: 10px;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const Card2 = styled.div``;

export const Select = styled.select`
  border-radius: 5px;
  padding: 5px;
  background-color: black;

  option {
    color: lightgray;
  }
`;

export const Title = styled.h3`
  color: orange;

  abbr {
    color: orange;
  }
`;

export const HorizontalRule = styled.hr`
  border-color: black;
`;
