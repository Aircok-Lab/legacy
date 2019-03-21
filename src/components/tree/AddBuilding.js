import React, { Component } from "react";
import { connect } from "react-redux";
import { buildingAddRequest } from "actions/Building";

class AddBuilding extends Component {
  state = {
    postData: {
      name: "" + new Date().getTime(),
      address: "영등포구 여의도동",
      latitude: 38,
      longitude: 127,
      userID: this.props.authUser.id
    },
    searchedAddress: "영등포구 여의도동"
  };
  addBuilding = () => {
    // this.props.buildingAddRequest(this.state.postData);
    const positionId = this.props.selectedNode.buildingID
      ? this.props.selectedNode.id
      : "";
    if (!this.state.postData.name) {
      alert("건물명을 입력하세요");
    } else if (!this.state.postData.address) {
      alert("주소를 입력하세요");
    } else if (!this.state.postData.latitude) {
      alert("위도를 입력하세요");
    } else if (!this.state.postData.longitude) {
      alert("경도를 입력하세요");
    } else {
      this.props.buildingAddRequest(this.state.postData);
      this.props.closeModal();
    }
  };
  handleChange = e => {
    this.setState({
      postData: {
        ...this.state.postData,
        [e.target.name]: e.target.value
      }
    });
  };

  render() {
    return (
      <form className="w3-text-blue w3-margin">
        <h2 className="w3-center">건물등록</h2>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            건물명
          </div>
          <div className="w3-rest">
            <input
              className="form-control"
              name="name"
              value={this.state.postData.name}
              type="text"
              placeholder=""
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            주소
          </div>
          <div className="w3-rest">
            <div className="w3-row">
              <div className="w3-right">
                <button
                  type="button"
                  className="w3-padding-top w3-padding-bottom"
                  style={{ padding: "8px 8px", marginLeft: "8px" }}
                >
                  주소검색
                </button>
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="address"
                  value={this.state.postData.address}
                  type="text"
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            &nbsp;
          </div>
          <div className="w3-rest">
            <div className="w3-right">
              <button
                type="button"
                className="w3-padding-top w3-padding-bottom"
                style={{ marginLeft: "8px" }}
              >
                적용
              </button>
              <button
                type="button"
                className="w3-padding-top w3-padding-bottom"
                style={{ marginLeft: "8px" }}
              >
                Reset
              </button>
            </div>
            <div className="w3-rest w3-padding-right w3-text-grey">
              <div className="form-control" style={{ background: "#eee" }}>
                {this.state.searchedAddress} &nbsp;
              </div>
            </div>
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            위도
          </div>
          <div className="w3-rest">
            <div className="form-control" style={{ background: "#eee" }}>
              {this.state.postData.latitude} &nbsp;
            </div>
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            경도
          </div>
          <div className="w3-rest">
            <div className="form-control" style={{ background: "#eee" }}>
              {this.state.postData.longitude} &nbsp;
            </div>
          </div>
        </div>
        <div className="w3-right">
          <button
            type="button"
            className="w3-button w3-blue w3-padding"
            onClick={e => {
              this.addBuilding();
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
  buildingAddRequest: buildingAddRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddBuilding);
