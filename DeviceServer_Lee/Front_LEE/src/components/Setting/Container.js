import React from "react";
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

const mapDispatchToProps = {
  setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
