import React from "react";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/Device/Container";

const DevicePage = () => {
  return (
    <div className="container-fluid h-100 d-flex flex-fill flex-column">
      <div className="">
        <h2 className="pt-2 pl-2" style={{color:"white",fontFamily:"Noto Sans KR"}}>측정기 관리</h2>        
      </div>
      <div className="row flex-fill d-flex" style={{overflowY:'auto'}}
        >
        <div className="col-3 h-100 d-flex flex-column shadow-sm" style={{overflowY:'auto'}}>
          <BuildingPositionTree
            hideButton={false}
            hidePosition={false}
            checkable={false}
            selectable={false}
          />
        </div>
        <div className="col-9 h-100 d-flex flex-column shadow-sm" style={{overflowY:'auto'}}>
          <Container />
        </div>
      </div>
    </div>
  );
};

export default DevicePage;
