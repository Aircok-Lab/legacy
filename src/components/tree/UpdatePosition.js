import React, { Component } from "react";
import { connect } from "react-redux";
import { positionUpdateRequest, positionDeleteRequest } from "actions/Position";

class UpdatePosition extends Component {
  state = {
    id: "" + this.props.selectedNode.id,
    name: "" + this.props.selectedNode.name,
    position: "1",
    buildingID: "" + this.props.selectedNode.buildingID,
    positionList: this.props.authUser.positionList,
    userID: this.props.authUser.id
  };
  updatePosition = () => {
    if (!this.state.name) {
      alert("위치를 입력하세요");
    } else {
      this.props.positionUpdateRequest(this.state);
      this.props.closeModal();
    }
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
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
        <h2 className="w3-center">위치수정</h2>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            건물명
          </div>
          <div className="w3-rest">
            <div className="form-control" style={{ background: "#eee" }}>
              {this.props.selectedNode.buildingName} &nbsp;
            </div>
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            위치
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
            onClick={e => this.updatePosition()}
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
  positionUpdateRequest: positionUpdateRequest,
  positionDeleteRequest: positionDeleteRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdatePosition);
