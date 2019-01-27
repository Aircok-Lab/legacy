import React from 'react';
import {connect} from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Link} from 'react-router-dom';
import IntlMessages from 'util/IntlMessages';
import {
  hideMessage,
  showAuthLoader,
  userSignUp
} from 'actions/Auth';

const buildings = [
  {
    value: 'building1',
    label: '건물1'
  },
  {
    value: 'building2',
    label: '건물2'
  },
  {
    value: 'building3',
    label: '건물3'
  },
  {
    value: 'building4',
    label: '건물4'
  },
];

const floors = [
  {
    value: '1',
    label: '1층'
  },
  {
    value: '2',
    label: '2층'
  },
  {
    value: '3',
    label: '3층'
  },
  {
    value: '4',
    label: '4층'
  },
];

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

  handleChange(type) {
    console.log(type);
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
                  className="mt-0 mb-2"
                />

                <TextField
                  type="password"
                  onChange={(event) => this.setState({Password: event.target.value})}
                  label="* 비밀번호 확인"
                  fullWidth
                  defaultValue={Password}
                  margin="normal"
                  className="mt-0 mb-2"
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
                  label="소속(부서)"
                  onChange={(event) => this.setState({Department: event.target.value})}
                  fullWidth
                  defaultValue={Department}
                  margin="normal"
                  className="mt-0 mb-2"
                />

                <TextField
                  select
                  label="* 건물명"
                  value={BuildingList}
                  onChange={(event) => this.setState({BuildingList: event.target.value})}
                  SelectProps={{}}
                  margin="normal"
                  fullWidth
                  className="mt-0 mb-2"
                >
                  {buildings.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="* 층"
                  value={BuildingList}
                  onChange={(event) => this.setState({PositionList: event.target.value})}
                  SelectProps={{}}
                  margin="normal"
                  fullWidth
                  className="mt-0 mb-2"
                >
                  {floors.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <FormControl component="fieldset" required>
                  <RadioGroup
                    className="d-flex flex-row"
                    aria-label="gender"
                    name="gender"
                    value={this.state.value}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel value="male1" control={<Radio color="primary"/>} label="관리자"/>
                    <FormControlLabel value="female1" control={<Radio color="primary"/>} label="사용자"/>
                  </RadioGroup>
                </FormControl>

                <div className="mt-4 mb-3 d-flex align-items-center justify-content-between">
                  <Button className="btn-block" variant="raised" onClick={() => {
                    this.props.showAuthLoader();
                    //this.props.userSignUp({email, password});
                  }} color="primary">
                    승인요청
                  </Button>
                </div>
                <div>
                  <p>* 담당자 승인 후 회원가입이 완료됩니다.</p>
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
