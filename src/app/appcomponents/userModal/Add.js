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
      userType: 2,
      buildingList: "" + this.props.selectedNode.BuildingID,
      positionList: "" + this.props.selectedNode.id,
      deviceList: ""
    });
  };

  render() {
    return (
      <form className="w3-text-blue w3-margin">
        <h2 className="w3-center">사용자 등록</h2>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
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
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
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
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
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
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
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
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            건물명
          </div>
          <div className="w3-rest">
            {/* <input
              className="w3-input w3-border"
              name="first"
              type="text"
              placeholder=""
            /> */}
            <div
              className="w3-border w3-padding"
              style={{ height: "300px", overflowY: "auto" }}
            >
              <BuildingPositionTree />
            </div>
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            층
          </div>
          <div className="w3-rest">
            <div className="w3-border">aaa</div>
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            &nbsp;
          </div>
          <div className="w3-rest">
            <p>
              <label>
                <input
                  className="w3-radio"
                  type="radio"
                  name="userType"
                  value="1"
                />
                관리자
              </label>

              <label>
                <input
                  className="w3-radio w3-margin-left"
                  type="radio"
                  name="userType"
                  value="0"
                />
                시용자
              </label>

              <label>
                <input
                  className="w3-radio w3-margin-left"
                  type="radio"
                  name="userType"
                  value="2"
                />
                모니터링
              </label>
            </p>
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
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
        <div className="w3-right">
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
      // <form className="w3-text-blue w3-margin">
      //   <h2 className="w3-center">사용자 등록</h2>
      //   <div className="w3-row w3-section">
      //     <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
      //       건물명
      //     </div>
      //     <div className="w3-rest">
      //       <input
      //         className="w3-input w3-border"
      //         name="first"
      //         type="text"
      //         placeholder=""
      //       />
      //     </div>
      //   </div>
      //   <div className="w3-row w3-section">
      //     <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
      //       층
      //     </div>
      //     <div className="w3-rest">
      //       <input
      //         className="w3-input w3-border"
      //         name="first"
      //         type="text"
      //         placeholder=""
      //       />
      //     </div>
      //   </div>
      //   <div className="w3-row w3-section">
      //     <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
      //       측정기명
      //     </div>
      //     <div className="w3-rest">
      //       <input
      //         className="w3-input w3-border"
      //         name="first"
      //         type="text"
      //         placeholder=""
      //       />
      //     </div>
      //   </div>
      //   <div className="w3-row w3-section">
      //     <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
      //       제품군
      //     </div>
      //     <div className="w3-rest">
      //       <input
      //         className="w3-input w3-border"
      //         name="first"
      //         type="text"
      //         placeholder=""
      //       />
      //     </div>
      //   </div>
      //   <div className="w3-row w3-section">
      //     <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
      //       S/N
      //     </div>
      //     <div className="w3-rest">
      //       <input
      //         className="w3-input w3-border"
      //         name="first"
      //         type="text"
      //         placeholder=""
      //       />
      //     </div>
      //   </div>
      //   <div className="w3-row w3-section">
      //     <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
      //       Phone번호
      //     </div>
      //     <div className="w3-rest">
      //       <input
      //         className="w3-input w3-border"
      //         name="first"
      //         type="text"
      //         placeholder=""
      //       />
      //     </div>
      //   </div>
      //   <div className="w3-right">
      //     <button
      //       type="button"
      //       className="w3-button w3-blue w3-padding"
      //       onClick={e => {
      //         this.add();
      //         this.props.closeModal();
      //       }}
      //     >
      //       OK
      //     </button>
      //   </div>
      // </form>
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
