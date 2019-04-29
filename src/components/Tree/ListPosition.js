import React, { Component } from "react";
import { connect } from "react-redux";
import { positionListByBuildingIdRequest } from "actions/Position";
import { selectTreeNode, toggleTreeNode } from "actions/Tree";

class BuildingContainer extends React.Component {
  state = {
    selectedNodeId: ""
  };

  componentDidMount() {
    // let stepBuildingList = this.props.authUser.buildingList.replace(
    //   this.props.oldBuildingList + ",",
    //   ""
    // );
    // this.props.positionListRequest({ id: stepBuildingList });
    // this.props.positionListRequest({ id: this.props.authUser.positionList });
    // const stepBuildingList = "233";

    // console.log("this.props.selectedNode", this.props.selectedNode);
    if (this.props.selectedNode) {
      this.props.positionListByBuildingIdRequest({
        id: "" + this.props.selectedNode.id
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps ###### ", props, state);
    if (props.selectedNode && state.selectedNodeId != props.selectedNode.id) {
      props.positionListByBuildingIdRequest({
        id: "" + props.selectedNode.id
      });
      return {
        selectedNodeId: props.selectedNode.id
      };
    }
    return null;
  }

  render() {
    // console.log(
    //   "buildingList",
    //   this.props.authUser.buildingList,
    //   this.props.oldBuildingList
    // );
    // let stepBuildingList = this.props.authUser.buildingList;
    // stepBuildingList.replace(this.props.buildingList, "");
    // console.log("stepBuildingList", stepBuildingList);

    // if (!this.props.positionListByBuildingId) {
    //   return null;
    // }

    return (
      <React.Fragment>
        {/* <h2 className="text-center">건물 목록</h2>
        <ul className="list-group list-group-flush">
          {this.props.buildingList.map(building => (
            <li key={building.id} className="list-group-item">
              {building.name}
            </li>
          ))}
        </ul> */}
        <h2 className="text-center">위치 목록</h2>
        {this.props.positionListByBuildingId ? (
          <ul className="list-group list-group-flush">
            {this.props.positionListByBuildingId.map(position => (
              <li key={position.id} className="list-group-item">
                {position.name}
              </li>
            ))}
          </ul>
        ) : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  positionListByBuildingId: state.position.positionListByBuildingId,
  selectedNode: state.tree.selectedNode
});

const mapDispatchToProps = { positionListByBuildingIdRequest, selectTreeNode };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuildingContainer);
