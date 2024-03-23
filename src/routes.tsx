/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Repository from './pages/Repository';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';

import Main from './components/Main';

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const isAuthenticate = localStorage.getItem('acessToken');
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticate ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  );
};

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/repository" component={Repository} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    {/* Rotas privadas */}
    <PrivateRoute path="/profile" component={Main} />
    <PrivateRoute path="/admin" component={Main} />
    h
    <Route exact path="/logout" component={Logout} />
  </Switch>
);

/**
 * Here are the private routes
 *
 * @param userData The user data
 */
export const PrivateRoutes = ({ userData }: any): any => (
  <>
    {userData.role === 'admin' && (
      <>
        <PrivateRoute exact path="/admin" component={<>admin</>} />
      </>
    )}

    <PrivateRoute exact path="/profile" component={<>profile</>} />
  </>
);

export default Routes;
