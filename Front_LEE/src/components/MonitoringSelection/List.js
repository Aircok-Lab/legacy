import React, { cloneElement, Component } from "react";
import { connect } from "react-redux";
import { deviceGetAllByPositionIdRequest } from "actions/Device";
import { userUpdateRequest } from "actions/User";

class List extends React.Component {
  state = {
    deviceList: []
  };

  update = () => {
    const selectedDevices = this.state.deviceList.filter(device => {
      return device.isChecked;
    });
    const ids = selectedDevices.map(({ serialNumber }) => serialNumber);
    let user = { ...this.props.authUser, deviceList: ids.join() };
    this.props.userUpdateRequest(user, true);
  };

  componentDidMount() {
    console.log(
      "1111 comoponentDidMount",
      this.props.authUser.positionList,
      this.props.authUser.deviceList
    );
    this.setState({ deviceList: this.props.deviceList });
    this.props.deviceGetAllByPositionIdRequest({
      id: this.props.authUser.positionList,
      deviceList: this.props.authUser.deviceList
        ? this.props.authUser.deviceList
        : []
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(
      "2222 comoponentDidUpdate",
      prevProps.deviceList,
      this.props.deviceList
    );
    if (
      JSON.stringify(prevProps.deviceList) !=
      JSON.stringify(this.props.deviceList)
    ) {
      console.log("3333 setState.... ");
      this.setState({ deviceList: this.props.deviceList });
    }
  }

  render() {
    return (
      <div className="h-100 d-flex flex-column">
        <div className="text-right mt-2">
          <button
            className="btn btn-primary"
            onClick={e => {
              this.update();
            }}
            style={{ marginLeft: "2px" }}
            disabled={
              this.state.deviceList.filter(device => device.isChecked).length ==
              0
            }
          >
            모니터링 측정기 적용
          </button>
        </div>
        <div className="flex-grow-1 overflow-auto">
          <table className="w3-table-all w3-centered">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={event => {
                      let deviceList = this.state.deviceList;
                      deviceList.forEach(device => {
                        device.isChecked = event.target.checked;
                      });
                      this.setState({ deviceList: deviceList });
                    }}
                  />
                </th>
                <th>번호</th>
                <th style={{ width: "444px" }}>측정기명</th>
                <th style={{ width: "218px" }}>건물</th>
                <th style={{ width: "218px" }}>위치</th>
                <th style={{ width: "218px" }}>측정주기</th>
                <th style={{ width: "218px" }}>S/N</th>
                <th style={{ width: "218px" }}>제품군</th>
                <th style={{ width: "218px" }}>전화번호</th>
              </tr>
            </thead>
            <tbody style={{width:"100%"}}>
              {this.state.deviceList &&
                this.state.deviceList.map((row, index) => (
                  <tr key={row.serialNumber}>
                    <td>
                      <input
                        type="checkbox"
                        checked={row.isChecked}
                        value={row.serialNumber}
                        onChange={event => {
                          let deviceList = this.state.deviceList;
                          deviceList.forEach(device => {
                            if (device.serialNumber === event.target.value) {
                              device.isChecked = event.target.checked;
                            }
                          });
                          this.setState({ deviceList: deviceList });
                        }}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td style={{ width: "444px" }}>{row.name}</td>
                    <td style={{ width: "218px" }}>{row.buildingName}</td>
                    <td style={{ width: "218px" }}>{row.positionName}</td>
                    <td style={{ width: "218px" }}>{row.period} 분</td>
                    <td style={{ width: "218px" }}>{row.serialNumber}</td>
                    <td style={{ width: "218px" }}>{row.productName}</td>
                    <td style={{ width: "218px" }}>{row.phone}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  deviceList: state.device.list,
  selectedNode: state.tree.selectedNode,
  viewMode: state.settings.viewMode
});

const mapDispatchToProps = {
  userUpdateRequest,
  deviceGetAllByPositionIdRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
