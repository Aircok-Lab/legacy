import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import IntlMessages from "util/IntlMessages";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { userSignOut } from "actions/Auth";
import { selectTreeNode } from "actions/Tree";
import { userLogout } from "actions/User";
import {
  hideMessage,
  showAuthLoader,
  userSignIn,
  publicKeyRequest
} from "actions/Auth";
import setInitValue from "../util/setInitValue";

class Login extends React.Component {
  state = {
    loginId: setInitValue("linkit"),
    password: setInitValue("1"),
    stayLogin: JSON.parse(localStorage.getItem("stayLogin"))
  };

  componentDidMount() {
    // browser backkey 일때 사용자정보 Clear
    this.handleLogout();

    // auth가 Clear되어 1초후 pkey를 가져온다.
    setTimeout(() => {
      this.props.publicKeyRequest();
    }, 1000);
  }

  componentDidUpdate() {
    if (this.props.authUser !== null) {
      this.props.history.push("/");
    }
  }

  handleLogout = () => {
    this.props.userSignOut();
    this.setState({ open: false });
    this.props.selectTreeNode({});
    localStorage.removeItem("selectedNode");
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
    localStorage.setItem("stayLogin", JSON.stringify(event.target.checked));
  };

  login(e) {
    this.props.userSignIn({
      loginId: this.state.loginId,
      password: this.state.password,
      pkey: this.props.pkey
    });
  }

  render() {
    const { loginId, password } = this.state;
    const { showMessage, loader, alertMessage, pkey } = this.props;
    return (
      <div className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="app-login-main-content">
          <div className="app-login-content">
            <div className="app-login-header mb-4">
              <h1 className="text-center">
                환경 IoT 센싱 데이터 모니터링 시스템
              </h1>
            </div>

            <div className="app-login-form">
              <form>
                <fieldset>
                  <TextField
                    label="아이디"
                    fullWidth
                    onChange={event =>
                      this.setState({ loginId: event.target.value })
                    }
                    defaultValue={loginId}
                    margin="normal"
                    className="mt-1 my-sm-3"
                    // onKeyDown={e => this.login(e)}
                  />
                  <TextField
                    type="password"
                    label="비밀번호"
                    fullWidth
                    onChange={event =>
                      this.setState({ password: event.target.value })
                    }
                    defaultValue={password}
                    margin="normal"
                    className="mt-1 my-sm-3"
                    // onKeyDown={e => this.login(e)}
                  />

                  <div className="mb-3 d-flex align-items-center justify-content-between">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            checked={this.state.stayLogin}
                            onChange={this.handleChange("stayLogin")}
                            value="stayLogin"
                          />
                        }
                        label="로그인 상태 유지"
                      />
                    </FormGroup>
                  </div>

                  <div className="mb-3 d-flex align-items-center justify-content-between">
                    <Button
                      className="text-center btn-block"
                      onClick={() => {
                        // this.props.showAuthLoader();
                        // this.props.userSignIn({ loginId, password, pkey });
                        this.login();
                      }}
                      variant="contained"
                      color="primary"
                    >
                      로그인
                    </Button>
                  </div>

                  <div className="row mb-3 d-flex align-items-center justify-content-between">
                    <div className="col text-center">
                      <Link to="/forgot">아이디/비밀번호 찾기</Link>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
        {loader && (
          <div className="loader-view">
            <CircularProgress />
          </div>
        )}
        {/* {showMessage && console.log(alertMessage)} */}
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { loader, alertMessage, showMessage, authUser, pkey, initURL } = auth;
  return { loader, alertMessage, showMessage, authUser, pkey, initURL };
};

export default connect(
  mapStateToProps,
  {
    userSignIn,
    hideMessage,
    showAuthLoader,
    publicKeyRequest,
    userSignOut,
    selectTreeNode,
    userLogout
  }
)(Login);
