import React, { cloneElement, Component } from "react";
import { connect } from "react-redux";
import {
  userListByBuildingIdRequest,
  userListByPositionIdRequest,
  userDeleteRequest
} from "actions/User";
import UserModalContainer from "components/user/UserContainer";

class UserTable extends React.Component {
  state = {
    showModal: false,
    modalMode: "addUser",
    userList: []
  };

  openModal = param => e => {
    let modalMode = param;
    this.setState({ showModal: true, modalMode });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  componentDidMount() {
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
      if (this.props.selectedNode.BuildingID) {
        // 층
        this.props.userListByPositionIdRequest({
          positionID: "" + this.props.selectedNode.id
        });
      } else {
        // 건물
        this.props.userListByBuildingIdRequest({
          buildingID: "" + this.props.selectedNode.id
        });
      }
    }
  }

  render() {
    return (
      <div className="">
        <div className="animated slideInUpTiny animation-duration-3">
          <div className="text-right w3-margin-bottom">
            <button
              onClick={this.openModal("addUser")}
              style={{ marginLeft: "2px" }}
              disabled={!this.props.selectedNode.BuildingID}
            >
              등록
            </button>

            <button
              onClick={this.openModal("updateUser")}
              style={{ marginLeft: "2px" }}
              disabled={
                this.state.userList.filter(user => user.isChecked).length != 1
              }
            >
              수정
            </button>
            <button
              onClick={this.openModal("deleteConfirmUser")}
              style={{ marginLeft: "2px" }}
              disabled={
                this.state.userList.filter(user => user.isChecked).length == 0
              }
            >
              삭제
            </button>
          </div>
          <div className="w3-responsive">
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
                {this.state.userList &&
                  this.state.userList.map((row, index) => (
                    <tr key={row.id}>
                      <td>
                        <input
                          className="w3-check"
                          type="checkbox"
                          checked={row.isChecked}
                          value={row.id}
                          onChange={event => {
                            let userList = [...this.state.userList];
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
                          {row.UserType}
                        </span>
                      </td>
                      <td>{row.LoginID}</td>
                      <td>{row.Name}</td>
                      <td>{row.Email}</td>
                      <td>{row.Department}</td>
                      <td>{row.Phone}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <UserModalContainer
          showModal={this.state.showModal}
          modalMode={this.state.modalMode}
          closeModal={this.closeModal}
          userList={this.state.userList}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  userList: state.user.list,
  selectedNode: state.tree.selectedNode
});

const mapDispatchToProps = {
  userListByBuildingIdRequest: userListByBuildingIdRequest,
  userListByPositionIdRequest: userListByPositionIdRequest,
  userDeleteRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTable);
