import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 3%;
  width: 100%;
  min-width: 50vw;
`;

export const Login = styled.button`
  padding: 10px;
  background-color: rgba(124, 131, 128, 0.2);
  border: 2px solid rgba(124, 131, 128, 0.2);
  font-weight: bold;
  border-radius: 3px;
  border: 0;
  cursor: pointer;
  color: gray;
  margin-top: 1%;

  &:hover {
    background-color: transparent;
    border: 2px solid #fb0;
    color: #fb0;
  }
`;
