import styled from 'styled-components';
import { FaBullseye } from 'react-icons/fa';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 100px;

  @media (max-width: 768px) {
    margin-top: 0;
  }
`;

export const CardsContainer = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap; /* Allow items to wrap onto new rows */
  align-items: center;
  justify-content: center;

  width: 65%;

  @media (max-width: 768px) {
    width: 95%;
  }

  //border: 1px solid white;

  .disabled-option {
    color: gray;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const Card = styled.div`
  display: flex;
  border: 1px solid #495c73;
  border-radius: 5px;

  background-color: #162c46;
  flex-basis: calc(20%);
  padding: 1.5%;
  justify-content: space-evenly;
  flex-direction: column;

  min-height: 120px;
  min-width: 364px;

  @media (max-width: 768px) {
    min-width: 90%;
    min-height: fit-content;
  }
`;

export const Card2 = styled.div``;

export const Select = styled.select`
  border-radius: 5px;
  padding: 5px;
  background-color: #0d2136;
  height: fit-content;

  option {
    color: #97a9c3;
  }
`;

export const Title = styled.h3`
  color: #8aabdc;
  font-size: 2rem !important;

  abbr {
    color: #8aabdc;
    font-size: 2rem !important;
  }
`;

export const Header = styled.span`
  color: #97a9c3;
  font-weight: bold;
`;

export const HorizontalRule = styled.hr`
  border-color: #495c73;
  filter: opacity(0.2);
`;

export const Clickable = styled.div`
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: white;
  }
`;

export const FoundIcon = styled(FaBullseye)`
  font-size: 1.2rem;
  fill: #89dcae;
`;

export const LastFound = styled.div`
  display: flex;
  align-items: baseline;
  gap: 5px;
  color: #97a9c3;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Hour = styled.span`
  color: #97a9c3;
  align-self: flex-end;
  font-size: 0.8rem !important;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px;
  gap: 5px;
`;

export const Head = styled.h3`
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FoundRow = styled.div`
  display: flex;
  color: #89dcae;
  gap: 5px;
  font-size: 0.9rem !important;
`;

export const PlaceHolder = styled.div`
  filter: opacity(0.2);
  text-decoration: underline;
`;
