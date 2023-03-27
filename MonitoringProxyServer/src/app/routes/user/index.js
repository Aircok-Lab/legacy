import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import asyncComponent from '../../../util/asyncComponent';

const User = ({match}) => (
  <div className="app-wrapper h-100">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/login`}/>
      <Route path={`${match.url}/login`} component={asyncComponent(() => import('./Login'))}/>
    </Switch>
  </div>
);

export default User;
