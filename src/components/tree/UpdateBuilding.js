import React, { Component } from "react";
import { connect } from "react-redux";
import {
  buildingUpdateRequest,
  buildingLocationRequest,
  buildingLocationReset
} from "actions/Building";

class UpdateBuilding extends Component {
  state = {
    id: this.props.selectedNode.id,
    name: this.props.selectedNode.name,
    address: this.props.selectedNode.address,
    latitude: this.props.selectedNode.latitude,
    longitude: this.props.selectedNode.longitude,
    userID: this.props.authUser.id,
    buildingList: this.props.authUser.buildingList
  };

  updateBuilding = () => {
    if (!this.state.name) {
      alert("건물명을 입력하세요");
    } else if (!this.state.address) {
      alert("주소를 입력하세요");
    } else if (!this.state.latitude) {
      alert("위도를 입력하세요");
    } else if (!this.state.longitude) {
      alert("경도를 입력하세요");
    } else {
      this.props.buildingUpdateRequest(this.state);
      this.props.closeModal();
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  searchAddress = () => {
    this.props.buildingLocationRequest(this.state.address);
  };

  applyLocation = () => {
    this.setState({
      address: this.state.searchedAddress,
      latitude: this.state.searchedLatitude,
      longitude: this.state.searchedLongitude
    });
  };

  resetLocation = () => {
    this.setState({
      address: "여의도",
      latitude: "",
      longitude: ""
    });
    this.props.buildingLocationReset();
  };

  static getDerivedStateFromProps(props, state) {
    if (props.address !== state.searchedAddress && props.location) {
      return {
        searchedAddress: props.address,
        searchedLatitude: props.location.lat,
        searchedLongitude: props.location.lng
      };
    }
    return null;
  }

  render() {
    return (
      <form className="w3-text-blue w3-margin">
        <h2 className="w3-center">건물수정</h2>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            건물명
          </div>
          <div className="w3-rest">
            <input
              className="form-control"
              name="name"
              value={this.state.name}
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
                  className="btn btn-primary"
                  style={{ padding: "8px", marginLeft: "8px" }}
                  onClick={this.searchAddress}
                  disabled={!this.state.address}
                >
                  주소검색
                </button>
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="address"
                  value={this.state.address}
                  type="text"
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        {this.state.searchedAddress && (
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              &nbsp;
            </div>
            <div className="w3-rest">
              <div className="w3-text-grey">
                <div className="form-control" style={{ background: "#eee" }}>
                  <div>주소 : {this.props.address}</div>
                  <div>위도 : {this.props.location.lat}</div>
                  <div>경도 : {this.props.location.lng}</div>
                </div>
              </div>
              <div className="clear-fix">
                <div className="float-right pt-1">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.applyLocation}
                  >
                    적용
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.resetLocation}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            위도
          </div>
          <div className="w3-rest">
            <input
              className="form-control"
              name="latitude"
              value={this.state.latitude}
              type="number"
              placeholder=""
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            경도
          </div>
          <div className="w3-rest">
            <input
              className="form-control"
              name="longitude"
              value={this.state.longitude}
              type="number"
              placeholder=""
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="w3-right">
          <button
            type="button"
            className="w3-button w3-blue w3-padding"
            onClick={e => {
              this.updateBuilding();
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
  selectedNode: state.tree.selectedNode,
  address: state.building.address,
  location: state.building.location
});

const mapDispatchToProps = {
  buildingUpdateRequest,
  buildingLocationRequest,
  buildingLocationReset
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateBuilding);
