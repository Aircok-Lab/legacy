import React, { Component } from "react";
import { connect } from "react-redux";
import List from "./List";
import Add from "./Add";
import Update from "./Update";
import { setViewMode } from "actions/Setting";

class Container extends React.Component {
  componentDidMount() {
    const item2 = {
      id: 83,
      loginID: "1552957879207",
      name: "test",
      email: "test@test.com",
      department: "Sales Departmentaa",
      approval: 1,
      userType: "manager",
      phone: "010-555-5555",
      buildingList: "210",
      positionList: "80",
      deviceList: null
    };
    const item = {
      id: 22,
      loginID: "linkit",
      name: "김영국",
      email: "sbwoo87@gmail.com",
      department: "UI 개발 3팀22",
      approval: 1,
      userType: "master",
      phone: "010-555-5555",
      buildingList: "210,216,233,256,257,258,259",
      positionList: "80,137,139,144,145",
      deviceList: "1552708341550"
    };
    // this.props.setViewMode("update", item);
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
