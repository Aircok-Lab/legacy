import React, { Component } from 'react';
import { connect } from "react-redux";
import { deviceYulAddRequest } from "actions/Product";
import { setViewMode } from "actions/Setting";

class Add extends Component {
  state = {
    postData: {
      id:"",
      serialNumber:"",
      sensorType:"",
      min:"",
      max:"",
      calc:"",
    }
  };
  add = () => {
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
    }  else {
      this.props.deviceYulAddRequest(this.state.postData);
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
      <div className="col-6 mx-auto" >
      <br></br>
      <br></br>
      <br></br>
        <form className="text-blue w3-margin" >
        <h2 className="text-center" style={{color:"white"}}>디바이스 배율 등록</h2>
        <div className="clearfix">
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" ,color: "white"}}>
            시리얼 번호
          </div>
          <div className="w3-rest">
            <input
              className="form-control"
              name="serialNumber"
              style={{fontSize:"10px"}}
              value={this.state.postData.serialNumber}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px",color: "white" }}>
          센서타입
          </div>
          <div className="w3-rest">
            <input
              className="form-control"
              name="sensorType"
              style={{fontSize:"10px"}}
              value={this.state.postData.sensorType}
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
              style={{fontSize:"10px"}}
              value={this.state.postData.min}
              onChange={this.handleChange}
              type="text"
              placeholder=""
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
              style={{fontSize:"10px"}}
              value={this.state.postData.max}
              onChange={this.handleChange}
              type="text"
              placeholder=""
            />
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px",color: "white" }}>
          CALC
          </div>
          <div className="w3-rest">
            <input
              className="form-control"
              name="calc"
              style={{fontSize:"10px"}}
              value={this.state.postData.calc}
              onChange={this.handleChange}
              type="text"
              placeholder=""
            />
          </div>
        </div>
        <br></br>
      <br></br>
      <br></br>
        <div className="clearfix">
        <div className="float-right">
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
            this.add();
          }}
        >
          저장
        </button>
          </div>
        </div>
      </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  selectedNode: state.tree.selectedNode,
  selectedNode: state.tree.selectedNode,
  viewMode: state.settings.viewMode
});

const mapDispatchToProps = {
  deviceYulAddRequest,
  setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Add);
