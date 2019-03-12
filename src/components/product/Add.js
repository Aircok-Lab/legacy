import React, { Component } from "react";
import { connect } from "react-redux";
import { productAddRequest } from "actions/Product";
const uuidv4 = require("uuid/v4");
// uuidv4(); // ⇨ '10ba038e-48da-487b-96e8-8d3b99b6d18a'
class AddProduct extends Component {
  add = () => {
    // console.log(this.props.selectedNode);
    this.props.productAddRequest({
      // loginId: "" + new Date().getTime(),
      // name: "" + new Date().getTime(),
      // password: "" + new Date().getTime(),
      // email: "test@test.com",
      // department: "Sales Department",
      // phone: "010-555-5555",
      // buildingList: "" + this.props.selectedNode.BuildingID,
      // positionList: "" + this.props.selectedNode.id
      name: "테스트",
      version: "v3.0.0",
      period: "1",
      indoor: "1",
      pm25: "1",
      pm10: "1",
      co2: "1",
      hcho: "1",
      voc: "1",
      temperature: "1",
      humidity: "1",
      noise: "1"
    });
  };

  render() {
    return (
      <form className="w3-text-blue w3-margin">
        <h2 className="w3-center">제품군 등록</h2>
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
  authProduct: state.auth.authProduct,
  selectedNode: state.tree.selectedNode
});

const mapDispatchToProps = {
  productAddRequest: productAddRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddProduct);
