import React from "react";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/BatchRegister/Container";

const UserPage = () => {
  return (
    <div className="app-wrapper">
      <div className="row">
        <div className="col-md-3">
          <h2>일괄 등록</h2>
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

export default UserPage;
