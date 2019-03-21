import React, { Component } from "react";
import { connect } from "react-redux";
import { buildingUpdateRequest, buildingDeleteRequest } from "actions/Building";

class UpdateBuilding extends Component {
  state = {
    postData: {
      id: this.props.node.id,
      name: this.props.node.name,
      address: this.props.node.Address,
      latitude: this.props.node.Latitude,
      longitude: this.props.node.Longitude,
      userID: this.props.authUser.id,
      buildingList: this.props.authUser.buildingList
    }
  };
  updateBuilding = () => {
    this.props.buildingUpdateRequest(this.state.postData);
  };

  handleChange = e => {
    // console.log("handleChange", e.target.value);
    this.setState({
      postData: {
        ...this.state.postData,
        [e.target.name]: e.target.value
      }
    });
  };

  deleteBuilding = () => {
    // console.log("deleteBuilding", this.props.node.id);
    this.props.buildingDeleteRequest({
      id: this.props.selectedNode.id,
      userID: this.props.authUser.id
    });
  };

  render() {
    return (
      <form className="w3-text-blue w3-margin">
        <h2 className="w3-center">건물수정</h2>
        {/* {JSON.stringify(this.props.node)} */}
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
              서울시 영등포구 여의도동
            </div>
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            위도
          </div>
          <div className="w3-rest">
            <input
              className="form-control"
              name="latitude"
              value={this.state.postData.latitude}
              type="text"
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
              value={this.state.postData.longitude}
              type="text"
              placeholder=""
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="w3-right">
          <button
            type="button"
            className="w3-button w3-blue w3-padding w3-margin-right"
            onClick={e => {
              this.deleteBuilding();
              this.props.closeModal();
            }}
          >
            삭제
          </button>
          <button
            type="button"
            className="w3-button w3-blue w3-padding"
            onClick={e => {
              this.updateBuilding();
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
  buildingUpdateRequest: buildingUpdateRequest,
  buildingDeleteRequest: buildingDeleteRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateBuilding);
