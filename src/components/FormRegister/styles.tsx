import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 3%;
  gap: 15px;
  width: 50vw;
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

export const FormFieldContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  align-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
  gap: 15px;
  width: 100%;
  margin-bottom: 15px;

  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
  }

  &:not(:first-child) {
    margin-top: 5px;
  }
`;
