import React, { Component } from "react";
import { connect } from "react-redux";
import { positionAddRequest, positionDeleteRequest } from "actions/Position";

class AddPosition extends Component {
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

  render() {
    return (
      <form className="w3-text-blue w3-margin">
        <h2 className="w3-center">층등록</h2>
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

        <button
          type="button"
          className="w3-button w3-right w3-blue w3-padding"
          onClick={e => this.addPosition()}
        >
          OK
        </button>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser
});

const mapDispatchToProps = {
  positionAddRequest: positionAddRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPosition);
