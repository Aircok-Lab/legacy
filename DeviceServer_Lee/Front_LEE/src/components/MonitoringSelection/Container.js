import React, { Component } from "react";
import { connect } from "react-redux";
import List from "./List";
import { setViewMode } from "actions/Setting";

class Container extends React.Component {
  componentDidMount() {
    localStorage.removeItem("steps");
    this.props.setViewMode("list");
  }

  render() {
    return <List />;
  }
}

const mapStateToProps = state => ({
  viewMode: state.settings.viewMode
});

const mapDispatchToProps = {
  setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
