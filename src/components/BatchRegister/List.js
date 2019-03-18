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

    // this.setState({ userList: this.props.userList });
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

  render() {
    return (
      <div className="">
        <div className="animated slideInUpTiny animation-duration-3">
          <h2 className="text-center text-blue">사용자등록</h2>
          <h2 className="text-center text-blue">측정기등록</h2>
          <h2 className="text-center text-blue">건물등록</h2>
          <h2 className="text-center text-blue">위치등록</h2>
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
  userListByBuildingIdRequest: userListByBuildingIdRequest,
  userListByPositionIdRequest: userListByPositionIdRequest,
  userDeleteRequest,
  setViewMode,
  userSetItem
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
