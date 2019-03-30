import React, { Component } from "react";
import { connect } from "react-redux";
import Update from "./Update";
import { setViewMode } from "actions/Setting";

class Container extends React.Component {
  componentDidMount() {
    console.log("this.props.authUser", this.props.authUser);
    this.props.setViewMode("update", this.props.authUser);
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
  authUser: state.auth.authUser,
  viewMode: state.settings.viewMode
});

const mapDispatchToProps = {
  setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
