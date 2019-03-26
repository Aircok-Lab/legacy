import React, { Component } from "react";
import { connect } from "react-redux";
import List from "./List";
import Add from "./Add";
import Update from "./Update";
import { setViewMode } from "actions/Setting";

class Container extends React.Component {
  componentDidMount() {
    this.props.setViewMode("list");
  }

  render() {
    switch (this.props.viewMode) {
      case "list":
        return <List />;
        break;

      case "add":
        return (
          <div className="col-6 mx-auto">
            <Add />
          </div>
        );
        break;

      case "update":
        return (
          <div className="col-6 mx-auto">
            <Update />
          </div>
        );
        break;

      default:
        break;
    }
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
