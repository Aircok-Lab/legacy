import React from "react";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/BatchRegister/Container";

const BatchRegisterPage = () => {
  return (
    <div className="container-fluid h-100 d-flex flex-fill flex-column">
      <div className="row flex-shrink-0 w3-white shadow-sm">
        <h2 className="pt-2 pl-2">일괄 등록</h2>
      </div>
      <div className="row flex-fill d-flex overflow-auto">
        <Container />
      </div>
    </div>
  );
};

export default BatchRegisterPage;
