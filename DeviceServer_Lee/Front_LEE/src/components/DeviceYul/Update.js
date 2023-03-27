import React, { Component } from "react";
import { connect } from "react-redux";
import { deviceYulUpdateRequest } from "actions/Product";
import { setViewMode } from "actions/Setting";

class Update extends Component {
  state = {
    postData: {
      id: ""+ this.props.selectedItem.id,
      serialNumber:""+ this.props.selectedItem.serialNumber,
      sensorType:""+ this.props.selectedItem.sensorType,
      min:""+ this.props.selectedItem.min,
      max:""+ this.props.selectedItem.max,
      calc:""+ this.props.selectedItem.calc,
    }
  };
  update = () => {
    if (!this.state.postData.serialNumber) {
      alert("시리얼 넘버를 입력하세요");
    } else if (!this.state.postData.sensorType) {
      alert("센서타입을 입력하세요");
    } else if (!this.state.postData.min) {
      alert("최소값을 입력하세요");
    } else if (!this.state.postData.max) {
      alert("최대값을 입력하세요");
    } else if (!this.state.postData.calc) {
      alert("배율값을 입력하세요");
    } 
     else {
      this.props.deviceYulUpdateRequest(this.state.postData);
    }
  };
  handleChange = e => {
    const target = e.target;
    let value;
    if (target.type === "checkbox") {
      value = target.checked ? "1" : "0";
    } else if (target.type === "file") {
      value = e.target.files[0];
    } else {
      value = target.value;
    }
    const name = target.name;
    this.setState({
      postData: {
        ...this.state.postData,
        [name]: value
      }
    });
  };

  render() {
    return (
      <div className="col-6 mx-auto">
        <form className="text-blue w3-margin">
          <h2 className="text-center">디바이스 배율 수정</h2>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px",color: "white" }}>
              시리얼번호
            </div>
            <div className="w3-rest">
              <input
                className="form-control"
                name="serialNumber"
                value={this.state.postData.serialNumber}
                placeholder=""
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px",color: "white" }}>
              sensorType
            </div>
            <div className="w3-rest">
              <input
                className="form-control"
                name="sensorType"
                value={this.state.postData.sensorType}
                type="text"
                placeholder=""
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px",color: "white" }}>
              MIN
            </div>
            <div className="w3-rest">
              <input
                className="form-control"
                name="min"
                value={this.state.postData.min}
                placeholder=""
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px",color: "white" }}>
              MAX
            </div>
            <div className="w3-rest">
              <input
                className="form-control"
                name="max"
                value={this.state.postData.max}
                placeholder=""
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px",color: "white" }}>
              calc
            </div>
            <div className="w3-rest">
              <input
                className="form-control"
                name="calc"
                value={this.state.postData.calc}
                placeholder=""
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="w3-right">
            <button
              type="button"
              className="btn btn-primary"
              onClick={e => {
                this.props.setViewMode("list");
              }}
            >
              List
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={e => {
                this.update();
              }}
            >
              OK
            </button>
          </div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedItem: state.settings.selectedItem
});

const mapDispatchToProps = {
  deviceYulUpdateRequest,
  setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Update);
