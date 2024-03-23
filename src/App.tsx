import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import UserDataProvider from './contexts/UserData';
import Routes from './routes';
import GlobalStyle from './styles/global';
import Toast from './components/Toast';

const App: React.FC = () => {
  return (
    <UserDataProvider>
      <BrowserRouter>
        <Routes />
        <GlobalStyle />
        <Toast />
      </BrowserRouter>
    </UserDataProvider>
  );
};

export default App;
