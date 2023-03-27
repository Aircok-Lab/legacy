import React, { Component } from "react";
import { connect } from "react-redux";
import { positionListByBuildingIdRequest } from "actions/Position";
import { selectTreeNode, toggleTreeNode } from "actions/Tree";

class BuildingContainer extends React.Component {
  state = {
    selectedNodeId: ""
  };

  componentDidMount() {
    // if (this.props.selectedNode) {
    //   this.props.positionListByBuildingIdRequest({
    //     id: "" + this.props.selectedNode.id
    //   });
    // } else {
    //   this.props.positionListByBuildingIdRequest({
    //     id: "-1"
    //   });
    // }

    console.log("2222", this.props.selectedNode);
    this.props.positionListByBuildingIdRequest({
      id: this.props.selectedNode ? "" + this.props.selectedNode.id : "-1"
    });
  }

  static getDerivedStateFromProps(props, state) {
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
    return (
      <React.Fragment>
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
