import React from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
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
import { hideMessage, showAuthLoader, userSignUp } from "actions/Auth";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

// 건물 목록 - 임시
const buildings = [
  {
    value: "building1",
    label: "건물1"
  },
  {
    value: "building2",
    label: "건물2"
  },
  {
    value: "building3",
    label: "건물3"
  },
  {
    value: "building4",
    label: "건물4"
  }
];

// 층 목록 - 임시
const floors = [
  {
    value: "1",
    label: "1층"
  },
  {
    value: "2",
    label: "2층"
  },
  {
    value: "3",
    label: "3층"
  },
  {
    value: "4",
    label: "4층"
  }
];

class Join extends React.Component {
  constructor() {
    super();
    this.state = {
      id: "",
      password: "",
      passwordConfirm: "",
      name: "",
      email: "",
      department: "",
      manager: "0",
      phone: "",
      buildingList: [],
      positionList: [],
      joinDialogOpen: false
    };
  }

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

  handleRequestClose = () => {
    this.setState({ joinDialogOpen: false });
  };

  render() {
    const {
      id,
      password,
      passwordConfirm,
      name,
      email,
      department,
      manager,
      phone,
      buildingList,
      positionList,
      joinDialogOpen
    } = this.state;
    const { showMessage, loader, alertMessage } = this.props;
    return (
      <div className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="app-login-main-content join">
          <div className="app-login-content">
            <div className="app-login-header">
              <h1 className="text-center">회원가입</h1>
            </div>

            <div className="app-login-form">
              <form method="post" action="/">
                <div className="row">
                  <div className="col-md-3" style={{ lineHeight: "40px" }}>
                    <label>* 아이디</label>
                  </div>
                  <div className="col-md-9">
                    <TextField
                      type="text"
                      label=""
                      onChange={event =>
                        this.setState({ id: event.target.value })
                      }
                      fullWidth
                      defaultValue={id}
                      margin="normal"
                      className="mt-0 mb-2"
                    />
                    <p className="text-right">사용 가능한 아이디입니다.</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3" style={{ lineHeight: "40px" }}>
                    <label>* 비밀번호</label>
                  </div>
                  <div className="col-md-9">
                    <TextField
                      type="password"
                      label=""
                      onChange={event =>
                        this.setState({ password: event.target.value })
                      }
                      fullWidth
                      defaultValue={password}
                      margin="normal"
                      className="mt-0 mb-2"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3" style={{ lineHeight: "40px" }}>
                    <label>* 비밀번호 확인</label>
                  </div>
                  <div className="col-md-9">
                    <TextField
                      type="password"
                      label=""
                      onChange={event =>
                        this.setState({ passwordConfirm: event.target.value })
                      }
                      fullWidth
                      defaultValue={passwordConfirm}
                      margin="normal"
                      className="mt-0 mb-2"
                    />
                    <p className="text-right">일치합니다.</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3" style={{ lineHeight: "40px" }}>
                    <label>* 이름</label>
                  </div>
                  <div className="col-md-9">
                    <TextField
                      type="text"
                      label=""
                      onChange={event =>
                        this.setState({ name: event.target.value })
                      }
                      fullWidth
                      defaultValue={name}
                      margin="normal"
                      className="mt-0 mb-2"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3" style={{ lineHeight: "40px" }}>
                    <label>* 이메일</label>
                  </div>
                  <div className="col-md-9">
                    <TextField
                      type="email"
                      label=""
                      onChange={event =>
                        this.setState({ email: event.target.value })
                      }
                      fullWidth
                      defaultValue={email}
                      margin="normal"
                      className="mt-0 mb-2"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3" style={{ lineHeight: "40px" }}>
                    <label>소속(부서)</label>
                  </div>
                  <div className="col-md-9">
                    <TextField
                      type="text"
                      label=""
                      onChange={event =>
                        this.setState({ department: event.target.value })
                      }
                      fullWidth
                      defaultValue={department}
                      margin="normal"
                      className="mt-0 mb-2"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3" style={{ lineHeight: "40px" }}>
                    <label>* 건물명</label>
                  </div>
                  <div className="col-md-9">
                    <FormControl className="w-100">
                      <Select
                        multiple
                        value={buildingList}
                        onChange={event =>
                          this.setState({ buildingList: event.target.value })
                        }
                        input={<Input id="buildingList-multiple" />}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                              width: 200
                            }
                          }
                        }}
                      >
                        {buildings.map(building => (
                          <MenuItem key={building.value} value={building.value}>
                            {building.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3" style={{ lineHeight: "40px" }}>
                    <label>* 층</label>
                  </div>
                  <div className="col-md-9">
                    <FormControl className="w-100">
                      <Select
                        multiple
                        value={positionList}
                        onChange={event =>
                          this.setState({ positionList: event.target.value })
                        }
                        input={<Input id="positionList-multiple" />}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                              width: 200
                            }
                          }
                        }}
                      >
                        {floors.map(floor => (
                          <MenuItem key={floor.value} value={floor.value}>
                            {floor.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3" style={{ lineHeight: "40px" }} />
                  <div className="col-md-9">
                    <FormControl component="fieldset" required>
                      <RadioGroup
                        className="d-flex flex-row"
                        aria-label="manager"
                        name="manager"
                        value={manager}
                        onChange={event =>
                          this.setState({ manager: event.target.value })
                        }
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio color="primary" />}
                          label="관리자"
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio color="primary" />}
                          label="사용자"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </div>

                <div className="mt-3 mb-3 d-flex align-items-center justify-content-between">
                  <Button
                    className="btn-block"
                    variant="raised"
                    onClick={() => {
                      this.props.showAuthLoader();
                      this.props.userSignUp({ email, password });
                      this.setState({ joinDialogOpen: true });
                    }}
                    color="primary"
                  >
                    승인요청
                  </Button>
                </div>
                <div className="mt-3 d-flex align-items-center justify-content-between">
                  <p>* 담당자 승인 후 회원가입이 완료됩니다.</p>
                </div>
              </form>
            </div>
          </div>

          <Dialog open={joinDialogOpen} onClose={this.handleRequestClose}>
            <DialogContent>
              <DialogContentText className="text-center">
                회원가입 승인 요청이 완료되었습니다.
                <br />
                담당자의 승인이 완료되면 메일을 보내드립니다.
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

const mapStateToProps = ({ auth }) => {
  const { loader, alertMessage, showMessage, authUser } = auth;
  return { loader, alertMessage, showMessage, authUser };
};

export default connect(
  mapStateToProps,
  {
    userSignUp,
    hideMessage,
    showAuthLoader
  }
)(Join);
