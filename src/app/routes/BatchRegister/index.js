import React from "react";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/BatchRegister/Container";

const UserPage = () => {
  return (
    <div className="app-wrapper">
      <div className="row w3-white w3-card-2 p-2 mb-3">
        <h2 className="mb-0">일괄 등록</h2>
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

export default UserPage;
