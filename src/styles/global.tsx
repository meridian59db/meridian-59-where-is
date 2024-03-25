import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto&display=swap');

* {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;

  color: #D3E3F7;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* remover seleção de todos os componentes e liberar somente inputs */
  -webkit-user-select: none;
  -moz-user-select: -moz-none;
  -ms-user-select: none;
  user-select: none;

  outline: none;

  font-size: 1.1rem !important;

  /* liberar select em tables */
  table {
    -webkit-user-select: text !important;
    -moz-user-select: -moz-text !important;
    -ms-user-select: text !important;
    user-select: text !important;
  }

  pre, code {
    border-radius: 8px;
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }

  a {
      text-decoration: none;
  }
}

  body, html {
    background-color:  #031525;
    margin: 0;
    height:100%;

    max-width: 100%;
    overflow-x: hidden;

    // Make whole website centralized
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
