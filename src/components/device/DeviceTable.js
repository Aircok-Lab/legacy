import React, { Component } from "react";
import List from "./List";
import Add from "./Add";
import Update from "./Update";
import Delete from "./Delete";

class DeviceTable extends React.Component {
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
      <div className="">
        {
          {
            list: <List setMode={this.setMode} />,
            add: <Add style={{ width: "50%" }} setMode={this.setMode} />,
            update: <Update setMode={this.setMode} />,
            deleteConfirm: <Delete setMode={this.setMode} />
          }[this.state.mode]
        }
      </div>
    );
  }
}
// const mapStateToProps = state => ({
//   authUser: state.auth.authUser,
//   deviceList: state.device.list,
//   selectedNode: state.tree.selectedNode
// });

// const mapDispatchToProps = {
//   deviceListByBuildingIdRequest: deviceListByBuildingIdRequest,
//   deviceListByPositionIdRequest: deviceListByPositionIdRequest,
//   deviceDeleteRequest
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(DeviceTable);

export default DeviceTable;
