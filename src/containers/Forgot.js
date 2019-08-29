import React from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import IntlMessages from "util/IntlMessages";
import {
  hideMessage,
  showAuthLoader,
  hideAuthLoader,
  userSignUp
} from "actions/Auth";
import { userFindUserRequest, userFindPasswordRequest } from "actions/User";

function TabContainer({ children, dir }) {
  return (
    <div dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
  }
});

class Forgot extends React.Component {
  constructor() {
    super();
    this.state = {
      loginId: "",
      name: "",
      email: "",
      value: 0,
      forgotDialogOpen: false,
      isNameValid: false,
      isEmailValid: false,
      phoneNumberEntered: '',
      isPhoneNumberValid: false
    };
  }
  validateName = name => {
    if (name.length > 1) {
      this.setState({
        isNameValid: true,
        name
      });
    } else {
      this.setState({
        isNameValid: false,
        name
      });
    }
  };
  isEnteredNameValid = () => {
    const { name, isNameValid } = this.state;
  
    if (name) return isNameValid;
  };
  
  inputClassNameHelper = boolean => {
    switch (boolean) {
      case true:
        return 'is-valid';
      case false:
        return 'is-invalid';
      default:
        return '';
    }
  };
  validateEmail = email => {
    const emailRegExp = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;
  
    if (email.match(emailRegExp)) {
      this.setState({
        isEmailValid: true,
        email
      });
    } else {
      this.setState({
        isEmailValid: false,
        email
      });
    }
  };
  isEnteredEmailValid = () => {
    const { email, isEmailValid } = this.state;
  
    if (email) return isEmailValid;
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  handleRequestClose = () => {
    this.setState({ forgotDialogOpen: false });
    this.props.hideAuthLoader();
  };

  componentDidUpdate() {
    if (this.props.showMessage) {
      setTimeout(() => {
        this.props.hideMessage();
      }, 3000);
    }
    if (this.props.authUser !== null) {
      this.props.history.push("/");
    }
  }

  render() {
    const { loginId, name, email, forgotDialogOpen } = this.state;
    const {
      userFindUserRequest,
      userFindPasswordRequest,
      showMessage,
      loader,
      alertMessage
    } = this.props;
    
    const { theme } = this.props;
    return (
      <div className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="app-login-main-content">
          <div className="app-login-content">
            <AppBar position="static" color="default">
              <Tabs
                value={this.state.value}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                fullWidth
              >
                <Tab className="tab" label="아이디 찾기" />
                <Tab className="tab" label="비밀번호 찾기" />
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={this.state.value}
              onChangeIndex={this.handleChangeIndex}
            >
              <TabContainer dir={theme.direction}>
                <div className="app-login-form">
                  <form method="post" action="/" className="myForm">
                    <div className="row">
                      <div className="col-md-3" style={{ lineHeight: "40px" }}>
                        <label>이름</label>
                      </div>
                      <div className="col-md-9">
                        <input
                          type="text"
                          label=""
                          onChange={e => this.validateName(e.target.value)}
                          fullWidth
                          id="nameInput"
                          defaultValue={name}
                          margin="normal"
                          className={`form-control ${this.inputClassNameHelper(this.isEnteredNameValid())}`}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3" style={{ lineHeight: "40px" }}>
                        <label>이메일</label>
                      </div>
                      <div className="col-md-9">
                        <input
                          type="email"
                          label=""
                          onChange={e => this.validateEmail(e.target.value)}
                          fullWidth
                          defaultValue={email}
                          id="emailInput"
                          margin="normal"
                          className={`form-control ${this.inputClassNameHelper(this.isEnteredEmailValid())}`}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-5 mb-3 d-flex align-items-center justify-content-between">
                      <Button
                        className="btn-block"
                        variant="raised"
                        onClick={() => {
                          userFindUserRequest(this.state);
                        }}
                        color="primary"
                      >
                        찾기
                      </Button>
                    </div>
                    <div className="row mb-1 d-flex align-items-center justify-content-between">
                      <div className="col text-center">
                        <Link to="/login">로그인</Link>
                      </div>
                    </div>
                  </form>
                </div>
              </TabContainer>
              <TabContainer dir={theme.direction}>
                <div className="app-login-form">
                  <form method="post" action="/">
                    <div className="row">
                      <div className="col-md-12">
                        <p >
                          회원가입시 등록한 아이디와 이메일주소를 입력하시면
                          메일로 비밀번호 초기화 메일이 발송됩니다.
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3" style={{ lineHeight: "40px" }}>
                        <label>아이디</label>
                      </div>
                      <div className="col-md-9">
                        <TextField
                          type="text"
                          label=""
                          onChange={event =>
                            this.setState({ loginId: event.target.value })
                          }
                          fullWidth
                          defaultValue={loginId}
                          margin="normal"
                          className="mt-0 mb-2"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3" style={{ lineHeight: "40px" }}>
                        <label>이메일</label>
                      </div>
                      <div className="col-md-9">
                        <input
                          type="email"
                          label=""
                          onChange={e => this.validateEmail(e.target.value)}
                          fullWidth
                          defaultValue={email}
                          margin="normal"
                          className={`form-control ${this.inputClassNameHelper(this.isEnteredEmailValid())}`}
                        />
                      </div>
                    </div>

                    <div className="mt-5 mb-3 d-flex align-items-center justify-content-between">
                      <Button
                        className="btn-block"
                        variant="raised"
                        onClick={() => {
                          userFindPasswordRequest(this.state);
                        }}
                        color="primary"
                      >
                        찾기
                      </Button>
                    </div>
                    <div className="row mb-1 d-flex align-items-center justify-content-between">
                      <div className="col text-center">
                        <Link to="/login">로그인</Link>
                      </div>
                    </div>
                  </form>
                </div>
              </TabContainer>
            </SwipeableViews>
          </div>

          <Dialog open={forgotDialogOpen} onClose={this.handleRequestClose}>
            <DialogContent>
              <DialogContentText className="text-center">
                홍길동님의 아이디
                <br />
                ABCDE
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleRequestClose} color="primary">
                확인
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {loader && (
          <div className="loader-view">
            <CircularProgress />
          </div>
        )}
        {showMessage && NotificationManager.error(alertMessage)}
        <NotificationContainer />
      </div>
    );
  }
}

Forgot.propTypes = {
  theme: PropTypes.object.isRequired
};

const mapStateToProps = ({ auth }) => {
  const { loader, alertMessage, showMessage, authUser } = auth;
  return { loader, alertMessage, showMessage, authUser };
};

export default connect(
  mapStateToProps,
  {
    userSignUp,
    hideMessage,
    showAuthLoader,
    hideAuthLoader,
    userFindUserRequest,
    userFindPasswordRequest
  }
)(withStyles(styles, { withTheme: true })(Forgot));
