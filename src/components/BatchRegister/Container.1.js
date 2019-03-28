import React, { Component } from "react";
import { connect } from "react-redux";
import { Steps } from "antd";
import "antd/dist/antd.css";
import BuildingContainer from "./BuildingContainer";
import PositionContainer from "./PositionContainer";
import DeviceContainer from "./DeviceContainer";
import UserContainer from "./UserContainer";
import DoneContainer from "./DoneContainer";

const Step = Steps.Step;

class Container extends React.Component {
  state = {
    step: 1,
    buildingList: ""
  };

  componentDidMount() {
    // const steps = JSON.parse(localStorage.getItem("steps"));
    // console.log("steps : ", steps);
    // this.setState({
    //   step: steps.step,
    //   buildingList: steps.buildingList
    // });
  }

  // Proceed to next step
  handleStepChange = step => {
    let nextStep;
    if (step === "next") {
      nextStep = this.state.step + 1;
    } else if (step === "prev") {
      nextStep = this.state.step - 1;
    } else {
      nextStep = step;
    }
    console.log(`step: ${step}, nextStep: `, nextStep);

    // const steps = JSON.parse(localStorage.getItem("steps"));
    // const nextStep = step ? step : this.state.step + 1;

    // if (nextStep === 2 && steps.buildingList == "") {
    //   alert("건물을 먼저 추가하여야 합니다.");
    // } else {
    //   console.log(`step: ${steps.step}, buildingList: ${steps.buildingList}`);
    //   // const { step } = this.state;
    //   // const data = {
    //   //   step: this.state.step,
    //   //   buildingList: "210,216" // this.props.authUser.buildingList
    //   // };
    //   steps.step = nextStep;
    //   localStorage.setItem("steps", JSON.stringify(steps));
    //   this.setState({
    //     step: nextStep
    //   });
    // }
  };

  // // Proceed to next step
  // nextStep = () => {
  //   const { step } = this.state;
  //   this.setState({
  //     step: step + 1
  //   });
  // };

  // // Go back to prev step
  // prevStep = () => {
  //   const { step } = this.state;
  //   this.setState({
  //     step: step - 1
  //   });
  // };

  // // Handle fields change
  // handleChange = input => e => {
  //   this.setState({ [input]: e.target.value });
  // };

  render() {
    const { step } = this.state;
    let buildingList = this.props.authUser.buildingList;
    let oldBuildingList = buildingList.substr(0, buildingList.lastIndexOf(","));
    console.log("111", buildingList, oldBuildingList);

    let stepData = null;
    if (step === 1) {
      stepData = (
        <BuildingContainer
          oldBuildingList={oldBuildingList}
          // nextStep={this.nextStep}
        />
      );
    } else if (step === 2) {
      stepData = (
        <PositionContainer
          oldBuildingList={oldBuildingList}
          // nextStep={this.nextStep}
        />
      );
    } else if (step === 3) {
      stepData = (
        <DeviceContainer
          oldBuildingList={oldBuildingList}
          // nextStep={this.nextStep}
        />
      );
    } else if (step === 4) {
      stepData = (
        <UserContainer
          oldBuildingList={oldBuildingList}
          // nextStep={this.nextStep}
        />
      );
    } else if (step === 5) {
      stepData = (
        <DoneContainer
        // oldBuildingList={oldBuildingList}
        // nextStep={this.nextStep}
        />
      );
    }

    return (
      <div className="border-top">
        <div className="">{stepData}</div>
        <div className="row border-top border-bottom py-4">
          <div className="col-2" />
          <div className="col-8 text-center">
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "150px" }}
              onClick={e => {
                this.handleStepChange("prev");
              }}
              disabled={this.state.step === 1}
            >
              이전
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "150px" }}
              onClick={e => {
                this.handleStepChange("next");
              }}
              disabled={this.state.step === 5}
            >
              다음
            </button>
          </div>
          <div className="col-2 text-right">
            {" "}
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100px" }}
              onClick={e => {
                console.log("리셋");
                localStorage.removeItem("steps");
              }}
            >
              리셋
            </button>
          </div>
        </div>

        <div>buildingList: {this.state.buildingList}</div>

        <div className="w3-row w3-margin">
          <div className="w3-col-12">
            <Steps size="small" current={this.state.step - 1}>
              <Step
                title="건물"
                className="cursor-pointer"
                onClick={() => this.handleStepChange(1)}
                description=""
              />
              <Step
                title="위치"
                className="cursor-pointer"
                onClick={() => this.handleStepChange(2)}
                description=""
              />
              <Step
                title="측정기"
                className="cursor-pointer"
                onClick={() => this.handleStepChange(3)}
                description=""
              />
              <Step
                title="사용자"
                className="cursor-pointer"
                onClick={() => this.handleStepChange(4)}
                description=""
              />
              <Step
                title="완료"
                className="cursor-pointer"
                onClick={() => this.handleStepChange(5)}
                description=""
              />
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
