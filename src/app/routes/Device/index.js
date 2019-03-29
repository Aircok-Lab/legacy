import React from "react";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/Device/Container";

const DevicePage = () => {
  return (
    <div className="app-wrapper h-100">
      <div className="row w3-white shadow-sm p-2 mb-3">
        <h2 className="mb-0">측정기 관리</h2>
      </div>
      <div className="row" style={{ height: "90%" }}>
        <div className="col-md-3 bg-white shadow-sm">
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
};

export default DevicePage;
