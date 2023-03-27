import React, { cloneElement, Component } from "react";
import { connect } from "react-redux";
import {
  userListByBuildingIdRequest,
  userListByPositionIdRequest,
  userDeleteRequest,
  userSetItem,
  userInfoSuccess
} from "actions/User";
import { setViewMode } from "actions/Setting";
import { selectTreeNode, toggleTreeNode } from "actions/Tree";
import { positionClearChecked, positionToggleChecked } from "actions/Position";

class List extends React.Component {
  state = {
    userType: "",
    showModal: false,
    selectedNode: {},
    userList: []
  };

  delete = () => {
    if (confirm("선택항목을 삭제하시겠습니까?")) {
      const selectedUsers = this.state.userList.filter(user => {
        return user.isChecked;
      });
      const ids = selectedUsers.map(({ id }) => id);
      this.props.userDeleteRequest({
        node: this.props.selectedNode,
        ids: ids.join()
      });
    }
  };

  componentDidMount() {
    this.props.positionClearChecked();
    // this.props.userInfoSuccess("");
    // const steps = JSON.parse(localStorage.getItem("steps"));
    // if (steps) {
    //   this.props.selectTreeNode(null);
    //   localStorage.removeItem("selectedNode");
    // }
    if (this.props.selectedNode && this.props.selectedNode.buildingID) {
      // 층
      this.props.userListByPositionIdRequest({
        positionID: "" + this.props.selectedNode.id
      });
    } else if (this.props.selectedNode && this.props.selectedNode.id) {
      // 건물
      this.props.userListByBuildingIdRequest({
        buildingID: "" + this.props.selectedNode.id
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(state.userList) != JSON.stringify(props.userList)) {
      const userList = props.userList.filter(user => {
        if (props.authUser.userType === "manager" && user.userType === "master")
          return false;
        return true;
      });
      return {
        userList
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const steps = JSON.parse(localStorage.getItem("steps"));
    // console.log("5555", steps, prevProps.selectedNode, this.props.selectedNode);
    // // if (!steps) {
    // //   this.props.selectTreeNode(null);
    // //   localStorage.removeItem("selectedNode");
    // // }

    if (
      JSON.stringify(prevProps.selectedNode) !=
      JSON.stringify(this.props.selectedNode)
    ) {
      if (this.props.selectedNode && this.props.selectedNode.buildingID) {
        // 층
        this.props.userListByPositionIdRequest({
          positionID: "" + this.props.selectedNode.id
        });
      } else if (this.props.selectedNode && this.props.selectedNode.id) {
        // 건물
        if (!(steps && steps.step === 4)) {
          this.props.userListByBuildingIdRequest({
            buildingID: "" + this.props.selectedNode.id
          });
        }
      }
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    let userList = [...this.props.userList];
    if (e.target.value) {
      userList = userList.filter(user => user.userType == e.target.value);
      this.setState({ userList });
    } else {
      const userList = this.props.userList.filter(
        user => user.userType !== "master"
      );
      this.setState({ userList });
    }
  };

  render() {
    return (
      <React.Fragment>
        {!this.props.hideButton && (
          <div className="clearfix flex-shrink-0 pb-1 pt-2">
            {/* <div className="float-left">
              <div style={{ width: "200px" }}>
                <select
                  className="form-control"
                  name="userType"
                  value={this.state.userType}
                  onChange={this.handleChange}
                >
                  <option value="">All</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                  <option value="monitoring">Monitoring</option>
                </select>
              </div>
            </div> */}
            <div className="float-right" style={{fontFamily:"Noto Sans KR"}}>
              <button
                className="btn btn-primary"
                onClick={e => this.props.setViewMode("add")}
                style={{ marginLeft: "2px" }}
              >
                등록
              </button>
              <button
                className="btn btn-primary"
                onClick={e => {
                  const selectedUsers = this.state.userList.filter(
                    user => user.isChecked
                  );
                  this.props.setViewMode("update", selectedUsers[0]);
                }}
                style={{ marginLeft: "2px" }}
                disabled={
                  this.state.userList.filter(user => user.isChecked).length != 1
                }
              >
                수정
              </button>
              <button
                className="btn btn-primary"
                onClick={e => {
                  this.delete();
                }}
                style={{ marginLeft: "2px" }}
                disabled={
                  this.state.userList.filter(user => user.isChecked).length == 0
                }
              >
                삭제
              </button>
            </div>
          </div>
        )}

        <div className="flex-fill overflow-auto table-responsive" style={{color:"white"}}>
          <table className="table table-bordered text-center text-nowrap" style={{width:'99%'}}>
            <thead>
              <tr>
                {!this.props.hideButton && (
                  <th style={{backgroundColor:"rgb(90 87 87)",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>
                    <input
                      type="checkbox"
                      onChange={event => {
                        let userList = [...this.state.userList];
                        userList.forEach(user => {
                          user.isChecked = event.target.checked;
                        });
                        this.setState({ userList: userList });
                      }}
                    />
                  </th>
                )}
                <th style={{minWidth: "80px", backgroundColor:"rgb(90 87 87)" ,color:"white" ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>번호</th>
                <th style={{minWidth: "100px",backgroundColor:"rgb(90 87 87)" ,color:"white" ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>구분</th>
                <th style={{minWidth: "150px",backgroundColor:"rgb(90 87 87)" ,color:"white" ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>아이디</th>
                <th style={{minWidth: "268px",backgroundColor:"rgb(90 87 87)" ,color:"white" ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>이름</th>
                <th style={{minWidth: "268px",backgroundColor:"rgb(90 87 87)" ,color:"white" ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>이메일</th>
                <th style={{minWidth: "238px",backgroundColor:"rgb(90 87 87)" ,color:"white" ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>소속(부서)</th>
                <th style={{minWidth: "226px",backgroundColor:"rgb(90 87 87)" ,color:"white" ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>전화번호</th>
              </tr>
            </thead>
            <tbody style={{height:"718px" ,width:"100%"}}>
              {this.state.userList.map((row, index) => (
                <tr key={row.id}>
                  {!this.props.hideButton && (
                    <td style={{border:"1px solid rgb(72, 68, 68)"}}>
                      <input
                        type="checkbox"
                        checked={row.isChecked}
                        value={row.id}
                        onChange={event => {
                          let userList = this.state.userList;
                          userList.forEach(user => {
                            if (user.id === Number(event.target.value)) {
                              user.isChecked = event.target.checked;
                            }
                          });
                          this.setState({ userList: userList });
                        }}
                      />
                    </td>
                  )}
                  <td style={{minWidth: "80px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{index + 1}</td>
                  <td style={{minWidth: "100px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>
                    <span style={{ textTransform: "capitalize" ,minWidth: "100px",color:"white"}}>
                      {row.userType}
                    </span>
                  </td>
                  <td style={{minWidth: "150px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.loginID}</td>
                  <td style={{minWidth: "268px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.name}</td>
                  <td style={{minWidth: "268px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.email}</td>
                  <td style={{minWidth: "238px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.department}</td>
                  <td style={{minWidth: "208px",color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>{row.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  userList: state.user.list,
  selectedNode: state.tree.selectedNode,
  viewMode: state.settings.viewMode
});

const mapDispatchToProps = {
  userListByBuildingIdRequest,
  userListByPositionIdRequest,
  userDeleteRequest,
  setViewMode,
  userSetItem,
  userInfoSuccess,
  positionClearChecked
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
