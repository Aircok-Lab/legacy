import React from 'react';
import {connect} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Link} from 'react-router-dom';
import IntlMessages from 'util/IntlMessages';
import {
  hideMessage,
  showAuthLoader,
  userSignUp
} from 'actions/Auth';

function TabContainer({children, dir}) {
  return (
    <div dir={dir} style={{padding: 8 * 3}}>
      {children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
});

class Forgot extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      value: 0,
      forgotDialogOpen: false
    }
  }

  handleChange = (event, value) => {
    this.setState({value});
  };

  handleChangeIndex = index => {
    this.setState({value: index});
  };

  handleRequestClose = () => {
    this.setState({forgotDialogOpen: false});
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
      password,
      forgotDialogOpen
    } = this.state;
    const {showMessage, loader, alertMessage} = this.props;
    const {theme} = this.props;
    return (
      <div
        className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
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
                <Tab className="tab" label="아이디 찾기"/>
                <Tab className="tab" label="비밀번호 찾기"/>
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={this.state.value}
              onChangeIndex={this.handleChangeIndex}
            >
              <TabContainer dir={theme.direction}>
                <div className="app-login-form">
                  <form method="post" action="/">
                    <div className="row">
                      <div className="col-md-3" style={{lineHeight: '40px'}}>
                        <label>이름</label>
                      </div>
                      <div className="col-md-9">
                        <TextField
                          type="text"
                          label=""
                          onChange={(event) => this.setState({name: event.target.value})}
                          fullWidth
                          defaultValue={name}
                          margin="normal"
                          className="mt-0 mb-2"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3" style={{lineHeight: '40px'}}>
                        <label>이메일</label>
                      </div>
                      <div className="col-md-9">
                        <TextField
                          type="email"
                          label=""
                          onChange={(event) => this.setState({email: event.target.value})}
                          fullWidth
                          defaultValue={email}
                          margin="normal"
                          className="mt-0 mb-2"
                        />
                      </div>
                    </div>

                    <div className="mt-5 mb-3 d-flex align-items-center justify-content-between">
                      <Button className="btn-block" variant="raised" onClick={() => {
                        this.props.showAuthLoader();
                        this.props.userSignUp({email, password});
                        this.setState({forgotDialogOpen: true});
                      }} color="primary">
                        찾기
                      </Button>
                    </div>
                  </form>
                </div>
              </TabContainer>
              <TabContainer dir={theme.direction}>
                <div className="app-login-form">
                  <form method="post" action="/">
                    <div className="row">
                      <div className="col-md-12">
                        <p>회원가입시 등록한 아이디와 이메일주소를 입력하시면 해당 메일로 비밀번호 초기화 메일이 발송됩니다.</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3" style={{lineHeight: '40px'}}>
                        <label>아이디</label>
                      </div>
                      <div className="col-md-9">
                        <TextField
                          type="text"
                          label=""
                          onChange={(event) => this.setState({name: event.target.value})}
                          fullWidth
                          defaultValue={name}
                          margin="normal"
                          className="mt-0 mb-2"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3" style={{lineHeight: '40px'}}>
                        <label>이메일</label>
                      </div>
                      <div className="col-md-9">
                        <TextField
                          type="email"
                          label=""
                          onChange={(event) => this.setState({email: event.target.value})}
                          fullWidth
                          defaultValue={email}
                          margin="normal"
                          className="mt-0 mb-2"
                        />
                      </div>
                    </div>

                    <div className="mt-5 d-flex align-items-center justify-content-between">
                      <Button className="btn-block" variant="raised" onClick={() => {
                        this.props.showAuthLoader();
                        this.props.userSignUp({email, password});
                        this.setState({forgotDialogOpen: true});
                      }} color="primary">
                        찾기
                      </Button>
                    </div>
                  </form>
                </div>
              </TabContainer>
            </SwipeableViews>
          </div>

          <Dialog open={forgotDialogOpen} onClose={this.handleRequestClose}>
            <DialogContent>
              <DialogContentText className="text-center">
                홍길동님의 아이디<br />ABCDE
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleRequestClose} color="primary">
                확인
              </Button>
            </DialogActions>
          </Dialog>

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

Forgot.propTypes = {
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = ({auth}) => {
  const {loader, alertMessage, showMessage, authUser} = auth;
  return {loader, alertMessage, showMessage, authUser}
};

export default connect(mapStateToProps, {
  userSignUp,
  hideMessage,
  showAuthLoader
})(withStyles(styles, { withTheme: true })(Forgot));
