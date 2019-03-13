import React, { Component } from "react";
import { connect } from "react-redux";
import BuildingPositionTree from "components/tree/BuildingPositionTree";
import Container from "components/device/Container";

class DevicePage extends Component {
  render() {
    return (
      <div className="app-wrapper">
        <div className="w3-panel w3-white w3-card w3-padding">
          <h2>측정기 관리</h2>
        </div>
        <div className="row">
          <div className="col-md-3">
            <BuildingPositionTree
              hideButton={false}
              hidePosition={false}
              checkable={false}
              selectable={false}
            />
          </div>
          <div className="col-md-9">
            <div className="animated slideInUpTiny animation-duration-3">
              <Container />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// export default DevicePage;
const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  deviceList: state.device.list,
  selectedNode: state.tree.selectedNode
});

const mapDispatchToProps = {
  // deviceListByBuildingIdRequest: deviceListByBuildingIdRequest,
  // deviceListByPositionIdRequest: deviceListByPositionIdRequest,
  // deviceDeleteRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicePage);
