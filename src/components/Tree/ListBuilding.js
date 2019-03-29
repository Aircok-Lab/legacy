import React, { Component } from "react";
import { connect } from "react-redux";
import { buildingListRequest } from "actions/Building";
import { selectTreeNode, toggleTreeNode } from "actions/Tree";

class BuildingContainer extends React.Component {
  componentDidMount() {
    this.props.buildingListRequest({ id: this.props.authUser.buildingList });
  }
  nodeClick = item => {
    this.props.selectTreeNode(item);
  };
  render() {
    console.log(
      "buildingList.redner() this.props.prevBuildingList:",
      this.props.prevBuildingList
    );
    const filterOutList = this.props.buildingList.filter(building => {
      return this.props.prevBuildingList.indexOf("" + building.id) === -1;
    });
    // console.log("filterOutList", filterOutList);
    return (
      <React.Fragment>
        {/* prevBuildingList: {this.props.prevBuildingList} */}
        <h2 className="text-center">건물 목록</h2>
        <ul className="list-group list-group-flush">
          {filterOutList.map(building => (
            <li
              key={building.id}
              className="list-group-item"
              style={{
                cursor: "pointer",
                padding: "2px 10px",
                marginBottom: "2px",
                background:
                  this.props.selectedNode.id === building.id ? "#bae7ff" : ""
              }}
              onClick={e => this.nodeClick(building)}
            >
              {building.name}
            </li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  buildingList: state.building.list,
  selectedNode: state.tree.selectedNode
});

const mapDispatchToProps = { buildingListRequest, selectTreeNode };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuildingContainer);
