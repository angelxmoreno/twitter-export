/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useStore } from '../mobx';

const PrivateRoute: FC<RouteProps> = ({ component: Component, children, ...rest }) => {
  const { authStore } = useStore();

  return (
    <Route
      {...rest}
      render={props =>
        authStore.isAuthenticated ? (
          <>{children}</>
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default observer(PrivateRoute);
