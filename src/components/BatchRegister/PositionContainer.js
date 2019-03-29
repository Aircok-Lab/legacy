import React, { Component } from "react";
import { connect } from "react-redux";
import AddPosition from "../Tree/AddPosition";
import ListBuilding from "../Tree/ListBuilding";

import { selectTreeNode } from "actions/Tree";
import { buildingListRequest } from "actions/Building";
import { positionListByBuildingIdRequest } from "actions/Position";
import ListPosition from "../Tree/ListPosition";

class PositionContainer extends React.Component {
  componentDidMount() {
    let stepBuildingList = this.props.authUser.buildingList.replace(
      this.props.oldBuildingList + ",",
      ""
    );
    // this.props.buildingListRequest({ id: stepBuildingList });
    // this.props.positionListByBuildingIdRequest({ id: stepBuildingList });
  }

  render() {
    return (
      <div className="row">
        <div className="col-3 py-3">
          this.props.prevBuildingList: {this.props.prevBuildingList}
          <ListBuilding prevBuildingList={this.props.prevBuildingList} />
          <ListBuilding prevBuildingList={this.props.prevBuildingList} />
        </div>
        <div className="col-5 border-left border-right">
          <AddPosition />
        </div>
        <div className="col-4 py-3">
          <ListPosition />
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
)(PositionContainer);
