import React from "react";
import BuildingPositionTree from "components/Tree/BuildingPositionTree2";
import Container from "components/DeviceYul/Container";

const DevicePage = () => {
  return (
    <div className="container-fluid h-100 flex-fill d-flex flex-column">
    <div className="" style={{overflowY:'auto'}}>
      <h2 className="pt-2 pl-2" style={{color:"white",fontFamily:"Noto Sans KR"}}>디바이스 배율 변경</h2>
    </div>
    <div className="row flex-fill d-flex flex-column overflow-auto" style={{overflowY:'auto',height:"100px"}}>
          <Container />
        </div>
    </div>
  );
};

export default DevicePage;
