import React from "react";
import BuildingPositionTree from "components/Tree/BuildingPositionTree";
import Container from "components/Profile/Container";

const ProfilePage = () => {
  return (
    <div className="app-wrapper">
      <div className="row">
        <div className="col-md-3">
          <h2>내 정보 관리</h2>
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

export default ProfilePage;
