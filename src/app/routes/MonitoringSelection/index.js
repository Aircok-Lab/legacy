import React, { Component } from "react";
import BuildingPositionTree from "components/tree/BuildingPositionTree";
import Container from "components/MonitoringSelection/Container";

class MonitoringSelectionPage extends Component {
  render() {
    return (
      <div className="app-wrapper">
        <div className="row">
          <div className="col-md-3">
            <h2>모니터링 측정기 관리</h2>
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

export default MonitoringSelectionPage;
