import React, { Component } from "react";
import { connect } from "react-redux";
import { buildingAddRequest, buildingDeleteRequest } from "actions/Building";

class UpdateBuilding extends Component {
  addBuilding = () => {
    this.props.buildingAddRequest({
      name: "",
      address: "",
      latitude: 22,
      longitude: 2222,
      userID: this.props.authUser.UserID,
      user_id: this.props.authUser.id
    });
  };

  deleteBuilding = () => {
    this.props.buildingDeleteRequest({
      id: this.props.node.id,
      user_id: this.props.authUser.id
    });
  };

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
              className="w3-input w3-border"
              name="first"
              type="text"
              placeholder=""
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
                  className="w3-input w3-border"
                  name="first"
                  type="text"
                  placeholder=""
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
              className="w3-input w3-border"
              name="first"
              type="text"
              placeholder=""
            />
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            경도
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
            className="w3-button w3-blue w3-padding w3-margin-right"
            onClick={e => this.deleteBuilding()}
          >
            삭제
          </button>
          <button
            type="button"
            className="w3-button w3-blue w3-padding"
            onClick={e => this.addBuilding()}
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
  buildingAddRequest: buildingAddRequest,
  buildingDeleteRequest: buildingDeleteRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateBuilding);
