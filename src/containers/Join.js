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

class Join extends React.Component {
  constructor() {
    super();
    this.state = {
      UserId: '',   // 아이디
      Password: '',   // 비밀번호
      Name: '',     // 이름
      Email: '',    // 이메일
      Department: '', // 소속(부서)
      BuildingList: '', // 건물
      PositionList: '',  // 층
      Manager: '' // 관리자 여부
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
      UserId,
      Password,
      Name,
      Email,
      Department,
      BuildingList,
      PositionList,
      Manager
    } = this.state;
    const {showMessage, loader, alertMessage} = this.props;
    return (
      <div
        className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="app-login-main-content">
          <div className="app-login-content">
            <div className="app-login-header">
              <h1 className="text-center">회원가입</h1>
            </div>

            <div className="app-login-form">
              <form method="post" action="/">
              <TextField
                  type="text"
                  label="* 아이디"
                  onChange={(event) => this.setState({UserId: event.target.value})}
                  fullWidth
                  defaultValue={UserId}
                  margin="normal"
                  className="mt-0 mb-2"
                />

                <TextField
                  type="password"
                  onChange={(event) => this.setState({Password: event.target.value})}
                  label="* 비밀번호"
                  fullWidth
                  defaultValue={Password}
                  margin="normal"
                  className="mt-0 mb-4"
                />
                
                <TextField
                  type="text"
                  label="* 이름"
                  onChange={(event) => this.setState({Name: event.target.value})}
                  fullWidth
                  defaultValue={Name}
                  margin="normal"
                  className="mt-0 mb-2"
                />

                <TextField
                  type="email"
                  onChange={(event) => this.setState({Email: event.target.value})}
                  label="* 이메일"
                  fullWidth
                  defaultValue={Email}
                  margin="normal"
                  className="mt-0 mb-2"
                />

                <TextField
                  type="text"
                  label="소속(부서"
                  onChange={(event) => this.setState({Department: event.target.value})}
                  fullWidth
                  defaultValue={Department}
                  margin="normal"
                  className="mt-0 mb-2"
                />

                <TextField
                  type="text"
                  label="* 건물명"
                  onChange={(event) => this.setState({BuildingList: event.target.value})}
                  fullWidth
                  defaultValue={BuildingList}
                  margin="normal"
                  className="mt-0 mb-2"
                />

                <TextField
                  type="text"
                  label="* 층"
                  onChange={(event) => this.setState({PositionList: event.target.value})}
                  fullWidth
                  defaultValue={PositionList}
                  margin="normal"
                  className="mt-0 mb-2"
                />

                <div className="mb-3 d-flex align-items-center justify-content-between">
                  <Button className="btn-block" variant="raised" onClick={() => {
                    this.props.showAuthLoader();
                    //this.props.userSignUp({email, password});
                  }} color="primary">
                    승인요청
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
})(Join);
