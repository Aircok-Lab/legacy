import React from "react";
import BuildingPositionTree from "app/appcomponents/BuildingPositionTree";
import DeviceTable from "app/appcomponents/DeviceTable";

const DevicePage = () => {
  return (
    <div className="app-wrapper">
      <div className="w3-panel w3-white w3-card w3-padding">
        <h2>측정기 관리</h2>
      </div>
      <div className="row">
        <div className="col-md-3">
          <BuildingPositionTree />
        </div>
        <div className="col-md-9">
          <div className="animated slideInUpTiny animation-duration-3">
            <DeviceTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevicePage;
