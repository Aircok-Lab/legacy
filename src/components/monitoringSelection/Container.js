// import React, { Component } from "react";
// import List from "./List";

// class Container extends React.Component {
//   render() {
//     return <List />;
//   }
// }

// export default Container;

import React, { Component } from "react";
import { connect } from "react-redux";
import List from "./List";
// import Add from "./Add";
// import Update from "./Update";
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
