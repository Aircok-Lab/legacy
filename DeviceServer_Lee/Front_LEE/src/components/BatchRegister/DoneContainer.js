import React, { Component } from "react";
import { connect } from "react-redux";
import { setViewMode } from "actions/Setting";

class DoneContainer extends React.Component {
  componentDidMount() {
    localStorage.removeItem("steps");
    this.props.setViewMode("list");

  }

  render() {
    return (
      <div className="m-4">
        <h2 className="text-center">완료했습니다.</h2>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoneContainer);
