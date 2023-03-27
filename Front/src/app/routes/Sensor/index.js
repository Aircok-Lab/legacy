import React from "react";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/Sensor/Container";

const SystemPage = () => {
  return (
    // <div className="app-wrapper">
    //   <div className="row w3-white shadow-sm p-2 mb-3">
    //     <h2 className="mb-0">센서 관리</h2>
    //   </div>
    //   <div className="row">
    //     <div className="col-md-12">
    //       <div className="animated slideInUpTiny animation-duration-3">
    //         <Container />
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="container-fluid h-100 d-flex flex-fill flex-column">
      <div className="row flex-shrink-0 w3-white shadow-sm">
        <h2 className="pt-2 pl-2">센서 관리</h2>
      </div>
      <div className="row flex-fill d-flex">
        {/* <div className="col-3 h-100 d-flex flex-column shadow-sm">Tree</div> */}
        <div className="col-12 h-100 d-flex flex-column shadow-sm overflow-auto">
          <Container />
        </div>
      </div>
    </div>
  );
};

export default SystemPage;
