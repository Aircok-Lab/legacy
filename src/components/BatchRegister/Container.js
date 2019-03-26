import React, { Component } from "react";
import { connect } from "react-redux";
import { Steps } from "antd";
import "antd/dist/antd.css";
import BuildingContainer from "./BuildingContainer";
import PositionContainer from "./PositionContainer";
import DeviceContainer from "./DeviceContainer";
import UserContainer from "./UserContainer";

const Step = Steps.Step;

class Container extends React.Component {
  state = {
    step: 0
    // oldBuildingList: this.props.authUser.buildingList
  };

  componentDidMount() {}

  // Proceed to next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  // Go back to prev step
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  // Handle fields change
  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  render() {
    const { step } = this.state;
    let buildingList = this.props.authUser.buildingList;
    buildingList = buildingList.substr(0, buildingList.lastIndexOf(","));

    let stepData = null;
    if (step === 0) {
      stepData = (
        <BuildingContainer
          oldBuildingList={this.state.oldBuildingList}
          nextStep={this.nextStep}
        />
      );
    } else if (step === 1) {
      stepData = (
        <PositionContainer
          oldBuildingList={buildingList}
          nextStep={this.nextStep}
        />
      );
    } else if (step === 2) {
      stepData = (
        <DeviceContainer
          oldBuildingList={buildingList}
          nextStep={this.nextStep}
        />
      );
    } else if (step === 3) {
      stepData = (
        <UserContainer
          oldBuildingList={buildingList}
          nextStep={this.nextStep}
        />
      );
    }

    return (
      <div className="col-6 mx-auto">
        <div>{stepData}</div>
        <div className="w3-row w3-margin">
          <div className="w3-col-12">
            <Steps size="small" current={this.state.step}>
              <Step title="건물" description="" />
              <Step title="위치" description="" />
              <Step title="측정기" description="" />
              <Step title="사용자" description="" />
            </Steps>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
