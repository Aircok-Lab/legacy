import React, { Component } from "react";
import { connect } from "react-redux";

class DoneContainer extends React.Component {
  componentDidMount() {
    localStorage.removeItem("steps");
    const steps = {
      step: 1,
      prevBuildingList: "" // this.props.authUser.prevBuildingList
    };
    this.setState(steps);
  }

  render() {
    return (
      <div className="jumbotron">
        <h2 className="text-center">일괄등록 작업을 완료했습니다.</h2>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoneContainer);
