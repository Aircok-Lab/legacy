import React, { Component } from "react";
import { connect } from "react-redux";
import List from "./List";
import Add from "./Add";
import Update from "./Update";

class Container extends React.Component {
  render() {
    return (
      <React.Fragment>
        {
          {
            list: <List />,
            add: <Add />,
            update: <Update />
          }[this.props.viewMode]
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  viewMode: state.settings.viewMode
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
