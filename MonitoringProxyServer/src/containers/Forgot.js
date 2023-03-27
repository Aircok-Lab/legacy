import React from 'react';
import {connect} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Link} from 'react-router-dom';
import IntlMessages from 'util/IntlMessages';
import {
  hideMessage,
  showAuthLoader,
  userSignUp
} from 'actions/Auth';

class Forgot extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: ''
    }
  }

  componentDidUpdate() {
    if (this.props.showMessage) {
      setTimeout(() => {
        this.props.hideMessage();
      }, 3000);
    }
    if (this.props.authUser !== null) {
      this.props.history.push('/');
    }
  }

  render() {
    const {
      name,
      email,
      password
    } = this.state;
    const {showMessage, loader, alertMessage} = this.props;
    return (
      <div
        className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="app-login-main-content">
          <div className="app-login-content">
            <div className="app-login-header">
              <h1 className="text-center">아이디/비밀번호 찾기</h1>
            </div>

            <div className="app-login-form">
              <form method="post" action="/">
                <TextField
                  type="text"
                  label="Name"
                  onChange={(event) => this.setState({name: event.target.value})}
                  fullWidth
                  defaultValue={name}
                  margin="normal"
                  className="mt-0 mb-2"
                />

                <TextField
                  type="email"
                  onChange={(event) => this.setState({email: event.target.value})}
                  label={<IntlMessages id="appModule.email"/>}
                  fullWidth
                  defaultValue={email}
                  margin="normal"
                  className="mt-0 mb-2"
                />

                <TextField
                  type="password"
                  onChange={(event) => this.setState({password: event.target.value})}
                  label={<IntlMessages id="appModule.password"/>}
                  fullWidth
                  defaultValue={password}
                  margin="normal"
                  className="mt-0 mb-4"
                />

                <div className="mb-3 d-flex align-items-center justify-content-between">
                  <Button className="btn-block" variant="raised" onClick={() => {
                    this.props.showAuthLoader();
                    this.props.userSignUp({email, password});
                  }} color="primary">
                    찾기
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>

        {
          loader &&
          <div className="loader-view">
            <CircularProgress/>
          </div>
        }
        {showMessage && NotificationManager.error(alertMessage)}
        <NotificationContainer/>
      </div>
    )
  }
}

const mapStateToProps = ({auth}) => {
  const {loader, alertMessage, showMessage, authUser} = auth;
  return {loader, alertMessage, showMessage, authUser}
};

export default connect(mapStateToProps, {
  userSignUp,
  hideMessage,
  showAuthLoader
})(Forgot);
