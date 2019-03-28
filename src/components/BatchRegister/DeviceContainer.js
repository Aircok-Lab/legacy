import React, { Component } from "react";
import { connect } from "react-redux";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import List from "components/Device/List";
import Add from "components/Device/Add";
import { selectTreeNode } from "actions/Tree";
import { buildingListRequest } from "actions/Building";
import { positionListByBuildingIdRequest } from "actions/Position";

class DeviceContainer extends React.Component {
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
      <div className="row">
        <div className="col-2 py-3">
          <h2 className="text-center">건물 목록</h2>
          <BuildingPositionTree hideButton={true} />{" "}
        </div>
        <div className="col-4 border-left border-right">
          <Add hideButton={true} />
        </div>
        <div className="col-6 py-3">
          <h2 className="text-center">측정기 목록</h2>
          <List hideButton={true} />
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
)(DeviceContainer);
