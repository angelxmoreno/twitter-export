import React, { FC } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import Pages from './pages';
import PageContainer from './layout/PageContainer';
import PrivateRoute from './router/PrivateRoute';
import appHistory from './router/appHistory';

const App: FC = () => {
  return (
    <Router history={appHistory}>
      <PageContainer>
        <Switch>
          <Route path="/" exact>
            <Pages.Home />
          </Route>
          <Route path="/login">
            <Pages.LogIn />
          </Route>
          <Route path="/search">
            <Pages.Search />
          </Route>
          <PrivateRoute path="/followers">
            <Pages.Followers />
          </PrivateRoute>
        </Switch>
      </PageContainer>
    </Router>
  );
};

export default App;
