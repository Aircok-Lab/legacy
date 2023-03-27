import React from "react";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/Device/Container";

const DevicePage = () => {
  return (
    <div className="container-fluid h-100 d-flex flex-fill flex-column">
      <div className="row flex-shrink-0 w3-white shadow-sm">
        <h2 className="pt-2 pl-2">측정기 관리</h2>
      </div>
      <div className="row flex-fill d-flex">
        <div className="col-3 h-100 d-flex flex-column shadow-sm">
          <BuildingPositionTree
            hideButton={false}
            hidePosition={false}
            checkable={false}
            selectable={false}
          />
        </div>
        <div className="col-9 h-100 d-flex flex-column shadow-sm">
          <Container />
        </div>
      </div>
    </div>
  );
};

export default DevicePage;
