import React, { Component } from "react";
import { connect } from "react-redux";
import { buildingListRequest, buildingSelect } from "actions/Building";
import { selectTreeNode, toggleTreeNode } from "actions/Tree";

class BuildingContainer extends React.Component {
  state = {
    selectedNode: this.props.selectedNode
  };
  componentDidMount() {
    this.props.buildingListRequest({ id: this.props.authUser.buildingList });
    const selectedNode = JSON.parse(localStorage.getItem("selectedNode"));
    if (selectedNode) {
      this.nodeClick(selectedNode);
    }

    // const steps = JSON.parse(localStorage.getItem("steps"));
    // console.log(
    //   "#### ",
    //   this.props.authUser.buildingList,
    //   steps.prevBuildingList,
    //   selectedNode.id
    // );

    // const found = true;
    // if (selectedNode && found) {
    //   this.nodeClick(selectedNode);
    // }
  }

  static getDerivedStateFromProps(props, state) {
    // console.log(props, state);
    return null;
  }

  nodeClick = item => {
    this.props.selectTreeNode(item);
    localStorage.setItem("selectedNode", JSON.stringify(item));

    // this.props.buildingSelect(item);
    // localStorage.setItem("selectedBuilding", JSON.stringify(item));
  };
  render() {
    const steps = JSON.parse(localStorage.getItem("steps"));
    let filterOutList = null;
    if (steps) {
      filterOutList = this.props.buildingList.filter(building => {
        return steps.prevBuildingList.indexOf("" + building.id) === -1;
      });
    } else {
      filterOutList = this.props.buildingList;
    }

    return (
      <React.Fragment>
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
                  this.props.selectedNode &&
                  this.props.selectedNode.id === building.id
                    ? "#bae7ff"
                    : ""
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
  // selectedBuilding: state.building.selectedBuilding
});

const mapDispatchToProps = {
  buildingListRequest,
  selectTreeNode,
  buildingSelect
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuildingContainer);
