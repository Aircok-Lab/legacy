import React, { Component } from "react";
import { connect } from "react-redux";
import { userAddRequest } from "actions/User";
import BuildingPositionTree from "app/appcomponents/BuildingPositionTree";

const uuidv4 = require("uuid/v4");
// uuidv4(); // ⇨ '10ba038e-48da-487b-96e8-8d3b99b6d18a'
class DeleteUser extends Component {
  add = () => {
    // console.log(this.props.selectedNode);
    this.props.userAddRequest({
      loginId: "" + new Date().getTime(),
      name: "" + new Date().getTime(),
      password: "" + new Date().getTime(),
      email: "test@test.com",
      department: "Sales Department",
      phone: "010-555-5555",
      userType: "monitoring",
      buildingList: "" + this.props.selectedNode.BuildingID,
      positionList: "" + this.props.selectedNode.id,
      deviceList: ""
    });
  };

  render() {
    return (
      <form className="w3-text-blue w3-margin">
        <h2 className="w3-center">사용자 등록</h2>
        <div className="row" style={{ maxWidth: "1200px" }}>
          <div className="col-sm-3 col-md-6">
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
                권한
              </div>
              <div className="w3-rest">
                <div>
                  <label>
                    <input
                      className="w3-radio"
                      type="radio"
                      name="userType"
                      value="1"
                    />
                    관리자
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      className="w3-radio"
                      type="radio"
                      name="userType"
                      value="0"
                    />
                    시용자
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      className="w3-radio"
                      type="radio"
                      name="userType"
                      value="2"
                    />
                    모니터링
                  </label>
                </div>
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
          </div>
          <div className="col-sm-9 col-md-6">
            {/* <div className="w3-row w3-section">
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
                건물
              </div>
              <div className="w3-rest">
                <div
                  className="w3-border w3-padding"
                  style={{ height: "300px", overflowY: "auto" }}
                >
                  <BuildingPositionTree
                    hideButton={true}
                    hidePosition={true}
                    checkable={true}
                    selectable={false}
                  />
                </div>
              </div>
            </div> */}
            <div className="w3-row w3-section">
              <div
                className="w3-col w3-padding-right"
                style={{ width: "40px" }}
              >
                위치
              </div>
              <div className="w3-rest">
                <div
                  className=""
                  style={{ height: "300px", overflowY: "auto" }}
                >
                  <BuildingPositionTree
                    hideButton={true}
                    hidePosition={false}
                    checkable={true}
                    selectable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-md-end">
          <button
            type="button"
            className="w3-button w3-blue w3-padding"
            onClick={e => {
              this.add();
              this.props.closeModal();
            }}
          >
            OK
          </button>
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  selectedNode: state.tree.selectedNode
});

const mapDispatchToProps = {
  userAddRequest: userAddRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteUser);
