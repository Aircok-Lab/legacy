import React, {Component} from 'react';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
//import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import {MuiPickersUtilsProvider} from 'material-ui-pickers';
import {Redirect, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';
import {IntlProvider} from 'react-intl'
import 'react-big-calendar/lib/less/styles.less';
import 'styles/bootstrap.scss'
import 'styles/app.scss';
import 'styles/app-rtl.scss';
import defaultTheme from './themes/defaultTheme';
import AppLocale from '../lngProvider';

import MainApp from 'app/index';
import Login from './Login';
import Join from './Join';
import Forgot from './Forgot';
import {setInitUrl, setInitUser} from '../actions/Auth';
import RTL from 'util/RTL';
import asyncComponent from 'util/asyncComponent';

const RestrictedRoute = ({component: Component, authUser, ...rest}) =>
  <Route
    {...rest}
    render={props =>
      authUser
        ? <Component {...props} />
        : <Redirect
          to={{
            pathname: '/login',
            state: {from: props.location}
          }}
        />}
  />;

class App extends Component {

    componentWillMount() {
        console.log('componentDidMount');
        if (this.props.initURL === '') {
            this.props.setInitUrl(this.props.history.location.pathname);
        }

        var retrievedObject = localStorage.getItem('user_id');

        console.log('retrievedObject: ', JSON.parse(retrievedObject));
        if (localStorage.getItem('user_id') !== null){
            console.log(retrievedObject);
            this.props.setInitUser(JSON.parse(retrievedObject));
        }
    }

    componentDidMount() {
        console.log('componentDidMount');
        
    }

    render() {
        const {match, location, locale, authUser, initURL, isDirectionRTL} = this.props;
        if (location.pathname === '/') {
            if (authUser === null) {
                return ( <Redirect to={'/login'}/> );
            } else if (initURL === '' || initURL === '/' || initURL === '/login') {
                return ( <Redirect to={'/login'}/> );
            } else {
                return ( <Redirect to={initURL}/> );
            }
        }
        let applyTheme = createMuiTheme(defaultTheme);
        if (isDirectionRTL) {
            applyTheme.direction = 'rtl';
            document.body.classList.add('rtl')
        } else {
            document.body.classList.remove('rtl');
            applyTheme.direction = 'ltr';
        }

        const currentAppLocale = AppLocale[locale.locale];
        return (
            <MuiThemeProvider theme={applyTheme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <IntlProvider
                        locale={currentAppLocale.locale}
                        messages={currentAppLocale.messages}>
                        <RTL>
                            <div className="app-main">
                            <Switch>
                                <RestrictedRoute path={`${match.url}app`} authUser={authUser}
                                                 component={MainApp}/>
                                {/* <Route path={`${match.url}app`} authUser={authUser} component={MainApp}/> */}
                                <Route path='/login' component={Login}/>
                                <Route path='/join' component={Join}/>
                                <Route path='/forgot' component={Forgot}/>
                                <Route
                                    component={asyncComponent(() => import('components/Error404'))}/>
                            </Switch>
                            </div>
                        </RTL>
                    </IntlProvider>
                </MuiPickersUtilsProvider>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = ({settings, auth}) => {
    const {sideNavColor, locale, isDirectionRTL} = settings;
    const {authUser, initURL} = auth;
    return {sideNavColor, locale, isDirectionRTL, authUser, initURL}
};

export default connect(mapStateToProps, {setInitUrl, setInitUser})(App);

