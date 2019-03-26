import React, { Component } from "react";
import { connect } from "react-redux";
import AddBuilding from "../Tree/AddBuilding";

class BuildingContainer extends React.Component {
  isReadyToNext = () => {
    return this.props.oldBuildingList === this.props.authUser.buildingList
      ? true
      : false;
  };

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-12">
            <AddBuilding />
          </div>
        </div>
        <hr />
        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "150px" }}
            onClick={e => {
              this.props.nextStep();
            }}
            disabled={this.isReadyToNext()}
          >
            다음
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuildingContainer);
