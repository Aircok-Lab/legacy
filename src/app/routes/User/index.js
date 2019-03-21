import React from "react";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/User/Container";

const UserPage = () => {
  return (
    <div className="app-wrapper">
      <div className="row w3-white w3-card-2 p-2 mb-3">
        <h2 className="mb-0">사용자 관리</h2>
      </div>
      <div className="row">
        <div className="col-md-3">
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
