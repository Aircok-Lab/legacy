import React, { Component } from "react";
import BuildingPositionTree from "components/tree/BuildingPositionTree";
import Container from "components/device/Container";

class DevicePage extends Component {
  render() {
    return (
      <div className="app-wrapper">
        <div className="row">
          <div className="col-md-3">
            <h2>측정기 관리</h2>
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
