import React, { Component } from "react";
import { connect } from "react-redux";
import { userDeleteRequest } from "actions/User";
class AddUser extends Component {
  add = () => {
    this.props.userDeleteRequest({
      loginId: "" + new Date().getTime(),
      name: "" + new Date().getTime(),
      password: "" + new Date().getTime(),
      email: "test@test.com",
      department: "Sales Department",
      phone: "010-555-5555",
      buildingList: "" + this.props.selectedNode.BuildingID,
      positionList: "" + this.props.selectedNode.id
    });
  };

  render() {
    return (
      <div>
        선택항목을 삭제하시겠습니까?
        <br />
        <div className="w3-right">
          <button
            type="button"
            className="w3-button w3-blue w3-padding"
            onClick={() => {
              const selectedUsers = this.props.userList.filter(
                user => user.isChecked
              );

              const ids = selectedUsers.map(({ id }) => id);
              // console.log("deleteUsers:", selectedUsers, ids.join());
              this.props.userDeleteRequest({
                node: this.props.selectedNode,
                ids: ids.join()
              });
              this.props.closeModal();
            }}
          >
            OK
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  selectedNode: state.tree.selectedNode
});

const mapDispatchToProps = {
  userDeleteRequest: userDeleteRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddUser);
