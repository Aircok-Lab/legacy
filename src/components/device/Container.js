import React, { Component } from "react";
import List from "./List";
import Add from "./Add";
import Update from "./Update";
import Delete from "./Delete";

class Container extends React.Component {
  state = {
    mode: "list",
    isEditing: false
  };

  setMode = param => {
    console.log("setMode : ", param);
    this.setState({ mode: param });
  };

  render() {
    return (
      <React.Fragment>
        {
          {
            list: <List setMode={this.setMode} />,
            add: <Add style={{ width: "50%" }} setMode={this.setMode} />,
            update: <Update setMode={this.setMode} />
          }[this.state.mode]
        }
      </React.Fragment>
    );
  }
}

export default Container;
