import React, { Component } from "react";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/MonitoringSelection/Container";

const MonitoringSelectionPage = () => {
  return (
    <div className="container-fluid d-flex flex-column h-100">
      <div className="w3-white shadow-sm">
        <h2 className="pt-2 pl-2">모니터링 측정기 관리</h2>
      </div>
      <div className="row h-100">
        <div className="col-12 h-100 d-flex flex-column shadow-sm">
          <Container />
        </div>
      </div>
    </div>
  );
};

export default MonitoringSelectionPage;
