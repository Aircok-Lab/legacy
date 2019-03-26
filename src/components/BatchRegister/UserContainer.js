import React, { Component } from "react";
import { connect } from "react-redux";
import BuildingPosition from "components/Tree/BuildingPositionTree";
import List from "components/User/List";
import Add from "components/User/Add";
import { selectTreeNode } from "actions/Tree";
import { buildingListRequest } from "actions/Building";
import { positionListByBuildingIdRequest } from "actions/Position";

class UserContainer extends React.Component {
  componentDidMount() {
    let stepBuildingList = this.props.authUser.buildingList.replace(
      this.props.oldBuildingList + ",",
      ""
    );
    console.log("stepBuildingList", stepBuildingList);
    this.props.buildingListRequest({ id: stepBuildingList });
    this.props.positionListByBuildingIdRequest({ id: stepBuildingList });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-3">
            <BuildingPosition />
          </div>
          <div className="col-9">
            <Add />
          </div>
        </div>
        <hr />
        <List />

        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "150px" }}
            onClick={e => {
              this.props.nextStep();
            }}
          >
            다음
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  buildingList: state.building.list,
  positionList: state.position.list
});

const mapDispatchToProps = {
  buildingListRequest,
  positionListByBuildingIdRequest,
  selectTreeNode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserContainer);
