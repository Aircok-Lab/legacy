import React from "react";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/Sensor/Container";

const SystemPage = () => {
  return (
    <div className="app-wrapper">
      <div className="row w3-white shadow-sm p-2 mb-3">
        <h2 className="mb-0">센서 관리</h2>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="animated slideInUpTiny animation-duration-3">
            <Container />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPage;
