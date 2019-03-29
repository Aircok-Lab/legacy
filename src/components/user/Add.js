import React, { Component } from "react";
import { connect } from "react-redux";
import { userAddRequest } from "actions/User";
import { productListRequest } from "actions/Product";
import { setViewMode } from "actions/Setting";

class Add extends Component {
  state = {
    postData: {
      loginId: "" + new Date().getTime(),
      password: "" + new Date().getTime(),
      name: "" + new Date().getTime(),
      email: "test@test.com",
      department: "Sales Department",
      phone: "010-555-5555",
      userType: "monitoring",
      buildingList: "" + this.props.selectedNode.buildingID,
      positionList: "" + this.props.selectedNode.id,
      deviceList: ""
    }
  };
  add = () => {
    if (!this.state.postData.loginId) {
      alert("로그인ID를 입력하세요");
    } else if (!this.state.postData.name) {
      alert("사용자이름을 입력하세요");
    } else if (!this.state.postData.password) {
      alert("암호를 입력하세요");
    } else if (!this.state.postData.email) {
      alert("이메일을 입력하세요");
    } else if (!this.state.postData.department) {
      alert("부서를 입력하세요");
    } else if (!this.state.postData.phone) {
      alert("전화번호를 입력하세요");
    } else if (!this.state.postData.userType) {
      alert("사용자권한을 선택하세요");
    } else {
      console.log("bbb");
      // 변경된 포지션을 저장
      this.setState(
        {
          postData: {
            ...this.state.postData
            // positionID: positionId
          }
        },
        () => {
          //포지션 저장완료 후, 서버에 데이터 전송
          this.props.userAddRequest(this.state.postData);
        }
      );
    }
  };
  handleChange = e => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    // const name = target.name;
    console.log("value: ", target, value);

    this.setState({
      postData: {
        ...this.state.postData,
        [e.target.name]: e.target.value
      }
    });
  };

  componentDidMount() {
    this.props.productListRequest();
  }

  render() {
    return (
      <form className="text-blue w3-margin">
        <h2 className="text-center">사용자 등록</h2>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            아이디
          </div>
          <div className="w3-rest">
            <input
              className="form-control"
              name="loginId"
              value={this.state.postData.loginId}
              type="text"
              placeholder=""
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            암호
          </div>
          <div className="w3-rest">
            <input
              className="form-control"
              name="password"
              value={this.state.postData.password}
              type="text"
              placeholder=""
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            이름
          </div>
          <div className="w3-rest">
            <input
              className="form-control"
              name="name"
              value={this.state.postData.name}
              type="text"
              placeholder=""
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            이메일
          </div>
          <div className="w3-rest">
            <input
              className="form-control"
              name="email"
              value={this.state.postData.email}
              type="text"
              placeholder=""
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            소속(부서)
          </div>
          <div className="w3-rest">
            <input
              className="form-control"
              name="department"
              value={this.state.postData.department}
              type="text"
              placeholder=""
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            권한
          </div>
          <div className="w3-rest">
            <select
              className="form-control"
              name="userType"
              value={this.state.postData.userType}
              onChange={this.handleChange}
            >
              <option value="" />
              <option value="manager">Manager</option>
              <option value="user">User</option>
              <option value="monitoring">Monitoring</option>
            </select>
          </div>
        </div>
        <div className="clearfix">
          <div className="w3-right">
            {!this.props.hideButton && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={e => {
                  this.props.setViewMode("list");
                }}
              >
                List
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={e => {
                this.add();
              }}
            >
              OK
            </button>
          </div>
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  selectedNode: state.tree.selectedNode,
  productList: state.product.list,
  viewMode: state.settings.viewMode
});

const mapDispatchToProps = {
  userAddRequest,
  productListRequest,
  setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Add);
