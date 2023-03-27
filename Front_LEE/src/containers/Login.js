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
import { Icon } from "@material-ui/core";
class Login extends React.Component {
  state = {
    loginId: setInitValue("master1"),
    password: setInitValue("master1"),
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
  appKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.login();
    }
  }


  render() {
    const { loginId, password } = this.state;
    const { showMessage, loader, alertMessage, pkey } = this.props;

    return (
      <div className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
      
        {/* <div className="app-login-main-content" > */}
          {/* <div className="app-login-content"> */}
            {/* <div className="app-login-header mb-4"> */}
            {/* </div> */}
            <div className="app-login-form">
            <div className="col text-center" style={{marginTop:"-29px"}}>
              <img src="assets/icons/smart_aircok12.png" alt="smart aircok" title="Smart Aircok" style={{}}></img>
            </div>
            <br></br>
            {/* <div className="col text-center" style={{color:"white",fontSize:"25px",borderRight:"2px solid white",height:"41px",marginLeft:"-336px"}}>
            </div> */}
            <div className="col text-center" style={{color:"white",fontSize:"55px"}}>
              IAQ DATA PLATFORM
              <h2 style={{color:"white",fontFamily:"Noto Sans KR"}}>(실내공기질 데이터 플랫폼)</h2>
            </div>
            <br></br>
              <form >
              <div class="input_box">
                  <input
                    fullWidth
                    label="아이디"
                    placeholder="아이디"
                    onChange={event =>
                      this.setState({ loginId: event.target.value })
                    }
                    defaultValue={loginId}
                    className="mt-1 my-sm-3"
                    style={{marginLeft:"30px", width:"89%",color:"white",border:"2px solid white",height:"78px",backgroundColor:"transparent",padding:"8px 29px",fontFamily:"Noto Sans KR"}}
                    // onKeyDown={e => this.login(e)}
                    variant="outlined"
                  />
                  </div>
                  <input
                    type="password"
                    fullWidth
                    label="비밀번호"
                    placeholder="비밀번호"
                    onChange={event =>
                      this.setState({ password: event.target.value })
                    }
                    onKeyPress={this.appKeyPress}
                    defaultValue={password}
                    className="mt-1 my-sm-3"
                    style={{marginLeft:"30px",width:"89%",color:"white",border:"2px solid white",height:"78px",backgroundColor:"transparent",padding:"8px 29px",fontFamily:"Noto Sans KR"}}
                    // onKeyDown={e => this.login(e)}.
                    variant="outlined"
                    　　　
                  />
                  
                  <div className="mb-3 d-flex align-items-center justify-content-between"
                  style={{marginLeft:"96px",color:"white",fontSize:"15px"}}>
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={this.state.stayLogin}
                          onChange={this.handleChange("stayLogin")}
                          value="stayLogin"
                          style={{color:"white",fontSize:"18px"}}
                          />
                        }
                        // label="로그인 상태 유지"
                        />
                        <span style={{marginRight: "123px",fontSize:"13px",fontFamily:"Noto Sans KR"}}>로그인 상태 유지</span>
                    <div className="mb-3 d-flex align-items-center justify-content-between"
                    style={{marginRight:"135px",color:"white",marginBottom:"-13px"}}
                    >
                      <i className="zmdi zmdi-search zmdi-hc-fw" style={{fontSize:"25px",marginBottom:"-12px"}}/>
                      <Link to="/forgot" style={{color:"white",marginBottom:"-11px",fontSize:"13px",fontFamily:"Noto Sans KR"}}>
                      　아이디 / 비밀번호 찾기</Link>
                  </div>
                  </div>
                  <br></br>
                  <br></br>
                  <div className="mb-3 d-flex align-items-center justify-content-between" style={{width:"200%"}}>
                    <Button
                      className="text-center btn-block"
                      onClick={() => {
                        this.props.showAuthLoader();
                        this.props.userSignIn({ loginId, password, pkey });
                        // this.login();
                      }}
                      // variant="contained"
                      // color="primary"
                      style={{left:"224px", color:"white",border:"2px solid white",width:"15%",marginRight:"560px",height:"78px",fontSize:"18px",fontFamily:"Noto Sans KR"}}
                    >
                      로그인　　>
                      </Button>
                    </div>
              </form>
              {/* <img src="assets/icons/login_back.jpg" style={{marginBottom:'-706px' ,height:"1089px"}}></img>  */}
            </div>
          {/* </div> */}
        {/* </div> */}
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
    userLogout,
  }
)(Login);
