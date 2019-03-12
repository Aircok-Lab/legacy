import React, { Component } from "react";
import { connect } from "react-redux";
import { deviceAddRequest } from "actions/Device";
const uuidv4 = require("uuid/v4");
// uuidv4(); // ⇨ '10ba038e-48da-487b-96e8-8d3b99b6d18a'
class AddDevice extends Component {
  addDevice = () => {
    this.props.deviceAddRequest({
      name: "test1",
      serialNumber: new Date().getTime(),
      phone: "1",
      positionID: this.props.node.id,
      productID: 1
    });
  };

  render() {
    return (
      <form className="w3-text-blue w3-margin">
        <h2 className="w3-center">측정기 등록</h2>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            건물명
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
            층
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
            측정기명
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
            제품군
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
            S/N
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
            Phone번호
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
              this.addDevice();
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
  authUser: state.auth.authUser
});

const mapDispatchToProps = {
  deviceAddRequest: deviceAddRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDevice);
