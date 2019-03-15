import React, { Component } from "react";
import { connect } from "react-redux";
import { positionAddRequest, positionDeleteRequest } from "actions/Position";

class AddPosition extends Component {
  state = {
    postData: {
      name: "" + new Date().getTime(),
      position: "1",
      buildingID: "" + this.props.selectedNode.id,
      userID: this.props.authUser.id
    }
  };
  addPosition = () => {
    if (!this.state.postData.name) {
      alert("위치명을 입력하세요");
    } else {
      this.props.positionAddRequest(this.state.postData);
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
        {/* {JSON.stringify(this.props.selectedNode)} */}
        <h2 className="w3-center">위치등록</h2>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
            건물명
          </div>
          <div className="w3-rest">
            <div className="w3-rest">
              <div className="form-control" style={{ background: "#eee" }}>
                {this.props.selectedNode.Name} &nbsp;
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
                value={this.state.postData.name}
                type="text"
                placeholder=""
                onChange={this.handleChange}
              />
            </div>
          </div>

          <button
            type="button"
            className="w3-button w3-right w3-blue w3-padding"
            onClick={e => {
              this.addPosition();
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
  positionAddRequest: positionAddRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPosition);
