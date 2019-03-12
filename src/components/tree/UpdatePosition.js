import React, { Component } from "react";
import { connect } from "react-redux";
import { positionAddRequest, positionDeleteRequest } from "actions/Position";

class UpdatePosition extends Component {
  addPosition = () => {
    this.props.positionAddRequest({
      name: "",
      address: "",
      latitude: 22,
      longitude: 2222,
      userID: this.props.authUser.UserID,
      user_id: this.props.authUser.id
    });
  };

  deletePosition = () => {
    this.props.positionDeleteRequest({
      id: this.props.selectedNode.id,
      userID: this.props.authUser.id
    });
  };

  render() {
    return (
      <form className="w3-text-blue w3-margin">
        <h2 className="w3-center">층수정</h2>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            건물명
          </div>
          <div className="w3-rest">
            <div className="w3-text-gray w3-border w3-padding">
              {"마곡사이언스 파크"}
            </div>
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
        <div className="w3-right">
          <button
            type="button"
            className="w3-button w3-blue w3-padding w3-margin-right"
            onClick={e => {
              this.deletePosition();
              this.props.closeModal();
            }}
          >
            삭제
          </button>
          <button
            type="button"
            className="w3-button w3-blue w3-padding"
            onClick={e => this.addPosition()}
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
  positionAddRequest: positionAddRequest,
  positionDeleteRequest: positionDeleteRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdatePosition);
