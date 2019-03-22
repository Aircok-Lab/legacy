import React, { Component } from "react";
import { connect } from "react-redux";
import List from "./List";
import Add from "./Add";
import Update from "./Update";
import { setViewMode } from "actions/Setting";

import { Steps, Button, message } from "antd";
import "antd/dist/antd.css";

const Step = Steps.Step;

const steps = [
  {
    title: "First",
    content: "First-content"
  },
  {
    title: "Second",
    content: "Second-content"
  },
  {
    title: "Last",
    content: "Last-content"
  }
];

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  componentDidMount() {
    this.props.setViewMode("list");
  }

  render() {
    const { current } = this.state;
    return (
      <div>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success("Processing complete!")}
            >
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              Previous
            </Button>
          )}
        </div>
      </div>
    );

    // return (
    //   <React.Fragment>
    //     {
    //       {
    //         list: <List />,
    //         add: <Add />,
    //         update: <Update />
    //       }[this.props.viewMode]
    //     }
    //   </React.Fragment>
    // );
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
