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

const Step = Steps.Step;

class Container extends React.Component {
  state = {
    step: 1,
    prevBuildingList: ""
  };

  componentDidMount() {
    const steps = JSON.parse(localStorage.getItem("steps"));
    // console.log("steps : ", steps);
    if (steps) {
      this.setState({
        step: steps.step,
        prevBuildingList: steps.prevBuildingList
      });
    } else {
      this.setState({
        step: 1,
        prevBuildingList: this.props.authUser.buildingList
      });
    }
  }

  componentWillUnmount() {
    localStorage.removeItem("steps");
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
    const steps = {
      step: nextStep,
      this.props.authUser.prevBuildingList
    };

    if (nextStep === 2 && steps.prevBuildingList == "") {
      alert("건물을 먼저 추가하여야 합니다.");
    } else {
      localStorage.setItem("steps", JSON.stringify(steps));
      this.setState(steps);
    }
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
    // const { step } = this.state;
    // let prevBuildingList = this.props.authUser.prevBuildingList;
    // let oldBuildingList = prevBuildingList.substr(0, prevBuildingList.lastIndexOf(","));
    // console.log("111", prevBuildingList, oldBuildingList);

    let stepData = null;
    if (this.state.step === 1) {
      stepData = (
        <BuildingContainer
          prevBuildingList={this.state.prevBuildingList}
          // nextStep={this.nextStep}
        />
      );
    } else if (this.state.step === 2) {
      stepData = (
        <PositionContainer
          prevBuildingList={this.state.prevBuildingList}
          // nextStep={this.nextStep}
        />
      );
    } else if (this.state.step === 3) {
      stepData = (
        <DeviceContainer
          prevBuildingList={this.state.prevBuildingList}
          // nextStep={this.nextStep}
        />
      );
    } else if (this.state.step === 4) {
      stepData = (
        <UserContainer
          prevBuildingList={this.state.prevBuildingList}
          // nextStep={this.nextStep}
        />
      );
    } else if (this.state.step === 5) {
      stepData = (
        <DoneContainer
        // prevBuildingList={this.state.prevBuildingList}
        // nextStep={this.nextStep}
        />
      );
    }

    return (
      <div className="border-top">
        <Prompt
          // when={!!this.state.name}
          when={true}
          message={location =>
            // `Are you sure you want to go to ${location.pathname}`
            // true

            // if (localStorage.getItem("steps") === null) {
            //   return true
            // } else {
            //   return
            // }
            localStorage.getItem("steps") ? "페이지를 이동하시겠습니까?" : true
          }
        />
        <div className="">{stepData}</div>
        <div className="row border-top border-bottom py-4">
          <div className="col-2" />
          <div className="col-8 text-center">
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100px" }}
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
              style={{ width: "100px" }}
              onClick={e => {
                this.handleStepChange("next");
              }}
              disabled={this.state.step === 5}
            >
              다음
            </button>
            {/* <button
              type="button"
              className="btn btn-secondary"
              style={{ width: "100px" }}
              onClick={e => {
                localStorage.removeItem("steps");
                const steps = {
                  step: 1,
                  prevBuildingList: "" // this.props.authUser.prevBuildingList
                };
                this.setState(steps);
              }}
            >
              리셋
            </button> */}
          </div>
          <div className="col-2 text-right"> </div>
        </div>

        <div>prevBuildingList: {this.state.prevBuildingList}</div>

        <div className="w3-row w3-margin">
          <div className="w3-col-12">
            <Steps size="small" current={this.state.step - 1}>
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
  authUser: state.auth.authUser
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
