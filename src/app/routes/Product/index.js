import React from "react";
import BuildingPositionTree from "components/tree/BuildingPositionTree";
import Container from "components/Product/Container";

const UserPage = () => {
  return (
    <div className="app-wrapper">
      <div className="row">
        <div className="col-md-3">
          <h2>제품군 관리</h2>
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

export default UserPage;
