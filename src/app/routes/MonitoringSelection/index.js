import React from "react";
import BuildingPositionTree from "components/tree/BuildingPositionTree";
import MonitoringSelectionTable from "components/monitoringSelection/MonitoringSelectionTable";

const ProductPage = () => {
  return (
    <div className="app-wrapper">
      <div className="w3-panel w3-white w3-card w3-padding">
        <h2>모니터링 장치 관리</h2>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="animated slideInUpTiny animation-duration-3">
            <MonitoringSelectionTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
