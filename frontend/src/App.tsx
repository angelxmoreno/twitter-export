import React, { FC } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Pages from './pages';
import PageContainer from './layout/PageContainer';

const App: FC = () => {
  return (
    <Router>
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
        </Switch>
      </PageContainer>
    </Router>
  );
};

export default App;
