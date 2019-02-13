import React from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import IntlMessages from "util/IntlMessages";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {
  hideMessage,
  showAuthLoader,
  userSignIn
} from "actions/Auth";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: 'aircok',
      password: '1qazxsw@'
    }
  }

  componentDidUpdate() {
    if (this.props.showMessage) {
      setTimeout(() => {
        this.props.hideMessage();
      }, 100);
    }
    if (this.props.authUser.statusCode === 'OK') {
      this.props.history.push('/');
    }
  }

  handleChange = name => (event, checked) => {
    //this.setState({[name]: checked});
  };

  render() {
    const {
      email,
      password
    } = this.state;
    const {showMessage, loader, alertMessage} = this.props;
    return (
      <div
        className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="app-login-main-content">

          <div className="app-login-content">
            <div className="app-login-header mb-4">
              <h1 className="text-center">환경 IoT 센싱 데이터 모니터링 시스템</h1>
            </div>

            <div className="app-login-form">
              <form>
                <fieldset>
                  <TextField
                    label="아이디"
                    fullWidth
                    onChange={(event) => this.setState({email: event.target.value})}
                    defaultValue={email}
                    margin="normal"
                    className="mt-1 my-sm-3"
                  />
                  <TextField
                    type="password"
                    label="비밀번호"
                    fullWidth
                    onChange={(event) => this.setState({password: event.target.value})}
                    defaultValue={password}
                    margin="normal"
                    className="mt-1 my-sm-3"
                  />

                  <div className="mb-3 d-flex align-items-center justify-content-between">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary"
                                    checked={this.state.checkedB}
                                    onChange={this.handleChange('checkedB')}
                                    value="checkedB"
                          />
                        }
                        label="로그인 상태 유지"
                      />
                    </FormGroup>
                  </div>

                  <div className="mb-3 d-flex align-items-center justify-content-between">
                    <Button className="text-center btn-block" onClick={() => {
                      this.props.showAuthLoader();
                      this.props.userSignIn({email, password});
                    }} variant="contained" color="primary">
                      로그인
                    </Button>
                  </div>

                  <div className="row mb-3 d-flex align-items-center justify-content-between">
                    <div className="col text-center">
                      <Link to="/join">
                        회원가입
                      </Link>
                    </div>
                    <div className="col text-center">
                      <Link to="/forgot">
                        아이디/비밀번호 찾기
                      </Link>
                    </div>
                  </div>

                </fieldset>
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
        {showMessage && console.log(alertMessage)}
        {/*<NotificationContainer/>*/}
      </div>
    );
  }
}

const mapStateToProps = ({auth}) => {
  const {loader, alertMessage, showMessage, authUser} = auth;
  return {loader, alertMessage, showMessage, authUser}
};

export default connect(mapStateToProps, {
  userSignIn,
  hideMessage,
  showAuthLoader
})(Login);
