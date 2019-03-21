import React, { Component } from "react";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/Device/Container";

class DevicePage extends Component {
  render() {
    return (
      <div className="app-wrapper">
        <div className="row w3-white w3-card-2 p-2 mb-3">
          <h2 className="mb-0">측정기 관리</h2>
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

export default DevicePage;
