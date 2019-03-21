import React, { cloneElement, Component } from "react";
import { connect } from "react-redux";
import {
  userListByBuildingIdRequest,
  userListByPositionIdRequest,
  userDeleteRequest,
  userSetItem
} from "actions/User";
import { setViewMode } from "actions/Setting";

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
    if (this.props.selectedNode.buildingID) {
      // 층
      this.props.userListByPositionIdRequest({
        positionID: "" + this.props.selectedNode.id
      });
    } else if (this.props.selectedNode.id) {
      // 건물
      this.props.userListByBuildingIdRequest({
        buildingID: "" + this.props.selectedNode.id
      });
    }

    this.setState({ userList: this.props.userList });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      JSON.stringify(prevProps.userList) != JSON.stringify(this.props.userList)
    ) {
      this.setState({ userList: this.props.userList });
    }

    if (
      JSON.stringify(prevProps.selectedNode) !=
      JSON.stringify(this.props.selectedNode)
    ) {
      if (this.props.selectedNode.buildingID) {
        // 층
        this.props.userListByPositionIdRequest({
          positionID: "" + this.props.selectedNode.id
        });
      } else if (this.props.selectedNode.id) {
        // 건물
        this.props.userListByBuildingIdRequest({
          buildingID: "" + this.props.selectedNode.id
        });
      }
    }
  }

  handleChange2 = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    // userList: []
    if (e.target.value) {
      console.log(e.target.value);
      let userList = [...this.state.userList];
      userList = userList.filter(user => user.userType == e.target.value);
      this.setState({ userList });
    } else {
      this.setState({ userList: this.props.userList });
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    let userList = [...this.props.userList];
    if (e.target.value) {
      userList = userList.filter(user => user.userType == e.target.value);
      this.setState({ userList });
    } else {
      this.setState({ userList: this.props.userList });
    }
  };

  render() {
    return (
      <div className="">
        <div className="animated slideInUpTiny animation-duration-3">
          <div className="clearfix pb-1">
            <div className="float-left">
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
            </div>
            <div className="float-right">
              <button
                className="btn btn-primary"
                onClick={e => this.props.setViewMode("add")}
                style={{ marginLeft: "2px" }}
                disabled={!this.props.selectedNode.buildingID}
              >
                등록
              </button>
              <button
                className="btn btn-primary"
                onClick={e => {
                  const selectedUser = this.state.userList.filter(
                    user => user.isChecked
                  );
                  // this.props.userSetItem(selectedUser[0]);
                  this.props.setViewMode("update", selectedUser[0]);
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

          <table className="w3-table-all w3-centered">
            <thead>
              <tr>
                <th style={{ paddingRight: "24px", width: "30px" }}>
                  <input
                    className="w3-check"
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
                <th>번호</th>
                <th>구분</th>
                <th>아이디</th>
                <th>이름</th>
                <th>이메일</th>
                <th>소속(부서)</th>
                <th>전화번호</th>
              </tr>
            </thead>
            <tbody>
              {this.state.userList.map((row, index) => (
                <tr key={row.id}>
                  <td>
                    <input
                      className="w3-check"
                      type="checkbox"
                      checked={row.isChecked}
                      value={row.id}
                      onChange={event => {
                        console.log("onChange checkbox....");
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
                  <td>{index + 1}</td>
                  <td>
                    <span style={{ textTransform: "capitalize" }}>
                      {row.userType}
                    </span>
                  </td>
                  <td>{row.loginID}</td>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.department}</td>
                  <td>{row.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
  userSetItem
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
