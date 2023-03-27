import React, { Component } from "react";
import { connect } from "react-redux";
import { Steps } from "antd";
import "antd/dist/antd.css";
import BuildingContainer from "./BuildingContainer";
import PositionContainer from "./PositionContainer";
import DeviceContainer from "./DeviceContainer";
import UserContainer from "./UserContainer";
import DoneContainer from "./DoneContainer";
import { Prompt } from "react-router-dom";
import { selectTreeNode, toggleTreeNode } from "actions/Tree";
import { positionListSuccess } from "actions/Position";
import { deviceListSet } from "actions/Device";
import { userListSet } from "actions/User";
import { setViewMode } from "actions/Setting";

const Step = Steps.Step;

class Container extends React.Component {
  state = {
    step: 1,
    prevBuildingList: ""
  };

  componentDidMount() {
    this.props.selectTreeNode(null);
    localStorage.removeItem("selectedNode");

    // Position List 초기화
    this.props.positionListSuccess(null);

    // Device List 초기화
    this.props.deviceListSet(null);

    // User List 초기화
    this.props.userListSet(null);
    this.props.setViewMode("steps");

    const steps = JSON.parse(localStorage.getItem("steps"));
    if (steps) {
      this.setState({
        step: steps.step,
        prevBuildingList: steps.prevBuildingList
      });
    } else {
      const data = {
        step: 1,
        prevBuildingList: this.props.authUser.buildingList
      };
      localStorage.setItem("steps", JSON.stringify(data));
      this.setState(data);
    }
  }

  componentWillUnmount() {
    localStorage.removeItem("steps");
  }

  handleStepChange = step => {
    let nextStep;
    if (step === "next") {
      nextStep = this.state.step + 1;
    } else if (step === "prev") {
      nextStep = this.state.step - 1;
    } else {
      nextStep = step;
    }
    let steps = JSON.parse(localStorage.getItem("steps"));
    steps.step = nextStep;
    this.setState(steps);
    localStorage.setItem("steps", JSON.stringify(steps));
  };

  isNextDisabled = () => {
    const steps = JSON.parse(localStorage.getItem("steps"));
    if (
      this.state.step === 1 &&
      steps.prevBuildingList === this.props.authUser.buildingList
    ) {
      return true;
    }
    if (
      this.state.step === 2 &&
      this.props.positionListByBuildingId &&
      this.props.positionListByBuildingId.length === 0
    ) {
      return true;
    }

    if (
      this.state.step === 3 &&
      this.props.deviceList &&
      this.props.deviceList.length === 0
    ) {
      return true;
    }

    if (
      this.state.step === 4 &&
      this.props.userList &&
      this.props.userList.length === 1
    ) {
      return true;
    }

    if (steps.step == 5) return true;

    return false;
  };

  render() {
    const steps = JSON.parse(localStorage.getItem("steps"));
    if (!steps) {
      return null;
    }

    let stepData = null;
    if (this.state.step === 1) {
      stepData = (
        <BuildingContainer prevBuildingList={this.state.prevBuildingList} />
      );
    } else if (this.state.step === 2) {
      stepData = <PositionContainer />;
    } else if (this.state.step === 3) {
      stepData = <DeviceContainer />;
    } else if (this.state.step === 4) {
      stepData = <UserContainer />;
    } else if (this.state.step === 5) {
      stepData = <DoneContainer />;
    }

    return (
      <div className="col-12 border-top" style={{backgroundColor:"rgb(23, 24, 29)"}}>
        <div className="">{stepData}</div>
        <div className="row border-top border-bottom py-4">
          <div className="col-2" />

          <div className="col-8 text-center">
            {this.state.step < 5 && (
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "100px" }}
                onClick={e => {
                  this.handleStepChange("next");
                }}
                disabled={this.isNextDisabled()}
                style={{
                  cursor: this.isNextDisabled() ? "not-allowed" : "pointer"
                }}
              >
                다음
              </button>
            )}
          </div>
          <div className="col-2 text-right"> </div>
        </div>
        <div className="w3-row w3-margin">
          <div className="w3-col-12" style={{color:"white"}}>
            <Steps  size="small" current={this.state.step - 1}>
              <Step title="건물" />
              <Step title="위치" />
              <Step title="측정기" />
              <Step title="사용자" />
              <Step title="완료" />
            </Steps>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  positionListByBuildingId: state.position.positionListByBuildingId,
  deviceList: state.device.list,
  userList: state.user.list
});

const mapDispatchToProps = {
  selectTreeNode,
  positionListSuccess,
  deviceListSet,
  userListSet,
  setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
