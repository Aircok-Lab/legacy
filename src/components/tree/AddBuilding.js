import React, { Component } from "react";
import { connect } from "react-redux";
import {
  buildingAddRequest,
  buildingLocationRequest,
  buildingLocationReset
} from "actions/Building";

class AddBuilding extends Component {
  state = {
    name: "" + new Date().getTime(),
    buildingType: "Office",
    isPublicBuilding: "0",
    address: "",
    latitude: "",
    longitude: "",
    userID: this.props.authUser.id
  };

  addBuilding = () => {
    if (!this.state.name) {
      alert("건물명을 입력하세요");
    } else if (!this.state.address) {
      alert("주소를 입력하세요");
    } else if (!this.state.latitude) {
      alert("위도를 입력하세요");
    } else if (!this.state.longitude) {
      alert("경도를 입력하세요");
    } else {
      this.setState({
        name: "",
        address: "",
        latitude: "",
        longitude: ""
      });
      // this.props.buildingLocationReset();
      this.props.buildingAddRequest(this.state);
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
      address: this.props.address,
      latitude: this.props.location.lat,
      longitude: this.props.location.lng
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

  // static getDerivedStateFromProps(props, state) {
  //   if (props.address !== state.searchedAddress && props.location) {
  //     return {
  //       searchedAddress: props.address,
  //       searchedLatitude: props.location.lat,
  //       searchedLongitude: props.location.lng
  //     };
  //   }
  //   return null;
  // }

  componentDidMount() {
    this.resetLocation();
  }

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
              value={this.state.name}
              type="text"
              placeholder=""
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            건물타입
          </div>
          <div className="w3-rest">
            <select
              className="form-control"
              name="buildingType"
              value={this.state.buildingType}
              onChange={this.handleChange}
            >
              <option value="NewKindergarten">신축 어린이집</option>
              <option value="Kindergarten">기축 어린이집</option>
              <option value="NewPostpartum">신축 산후조리원</option>
              <option value="Postpartum">기축 산후조리원</option>
              <option value="NewOffice">신축 사무실</option>
              <option value="Office">기축 사무실</option>
              <option value="NewHouse">신축 하우스</option>
              <option value="House">기축 하우스</option>
            </select>
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            공공기관
          </div>
          <div className="w3-rest pl-1">
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  name="isPublicBuilding"
                  value="0"
                  checked={this.state.isPublicBuilding === "0"}
                  onChange={this.handleChange}
                />
                민간기관
              </label>
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  name="isPublicBuilding"
                  value="1"
                  checked={this.state.isPublicBuilding === "1"}
                  onChange={this.handleChange}
                />
                공공기관
              </label>
            </div>
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
        {this.props.address && (
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
        <div className="clearfix">
          <div className="float-right">
            <button
              type="button"
              className="btn btn-primary"
              onClick={e => {
                this.addBuilding();
              }}
            >
              추가
            </button>
          </div>
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  address: state.building.address,
  location: state.building.location
});

const mapDispatchToProps = {
  buildingAddRequest,
  buildingLocationRequest,
  buildingLocationReset
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddBuilding);
