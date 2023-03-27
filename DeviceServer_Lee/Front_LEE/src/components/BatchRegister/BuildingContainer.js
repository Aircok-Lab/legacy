import React, { Component } from "react";
import { connect } from "react-redux";
import AddBuilding from "../Tree/AddBuilding";
import ListBuilding from "../Tree/ListBuilding";

class BuildingContainer extends React.Component {
  render() {
    return (
      <div className="col-8 mx-auto">
        <div className="row">
          <div className="col-6 border-right">
            <AddBuilding />
          </div>
          <div className="col-6 py-3">
            <ListBuilding prevBuildingList={this.props.prevBuildingList} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuildingContainer);
