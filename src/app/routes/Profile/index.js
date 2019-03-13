import React from "react";
import BuildingPositionTree from "components/tree/BuildingPositionTree";
import UserTable from "components/user/UserTable";

const UserPage = () => {
  return (
    <div className="app-wrapper">
      <div className="w3-panel w3-white w3-card w3-padding">
        <h2>내 정보 관리</h2>
      </div>
      <div className="w3-content" style={{ maxWidth: "500px" }}>
        <div className="animated slideInUpTiny animation-duration-3">
          <form className="w3-text-blue w3-margin">
            <div className="w3-row w3-section">
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
                아이디
              </div>
              <div className="w3-rest">
                <input
                  className="w3-input w3-border"
                  name="first"
                  type="text"
                  placeholder=""
                />
              </div>
            </div>
            <div className="w3-row w3-section">
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
                이름
              </div>
              <div className="w3-rest">
                <input
                  className="w3-input w3-border"
                  name="first"
                  type="text"
                  placeholder=""
                />
              </div>
            </div>
            <div className="w3-row w3-section">
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
                이메일
              </div>
              <div className="w3-rest">
                <input
                  className="w3-input w3-border"
                  name="first"
                  type="text"
                  placeholder=""
                />
              </div>
            </div>
            <div className="w3-row w3-section">
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
                소속(부서)
              </div>
              <div className="w3-rest">
                <input
                  className="w3-input w3-border"
                  name="first"
                  type="text"
                  placeholder=""
                />
              </div>
            </div>
            <div className="w3-row w3-section">
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
                전화번호
              </div>
              <div className="w3-rest">
                <input
                  className="w3-input w3-border"
                  name="first"
                  type="text"
                  placeholder=""
                />
              </div>
            </div>
            <div className="w3-right mb-3">
              <button
                type="button"
                className="w3-button w3-blue w3-padding"
                onClick={e => {
                  this.addDevice();
                  this.props.closeModal();
                }}
              >
                OK
              </button>
              {/* <br />
              <br /> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
