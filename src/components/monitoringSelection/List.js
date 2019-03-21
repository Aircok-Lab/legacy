import React, { cloneElement, Component } from "react";
import { connect } from "react-redux";
import {
  deviceListByBuildingIdRequest,
  deviceListByPositionIdRequest,
  deviceDeleteRequest,
  deviceSetItem,
  deviceGetAllByPositionIdRequest
} from "actions/Device";
import { userUpdateRequest } from "actions/User";
import { setViewMode } from "actions/Setting";

class List extends React.Component {
  state = {
    // showModal: false,
    // selectedNode: {},
    deviceList: []
  };

  update = () => {
    const selectedDevices = this.state.deviceList.filter(device => {
      return device.isChecked;
    });
    const ids = selectedDevices.map(({ serialNumber }) => serialNumber);
    let authUser = { ...this.props.authUser, deviceList: ids.join() };
    this.props.userUpdateRequest(authUser);
  };

  componentDidMount() {
    this.props.deviceGetAllByPositionIdRequest({
      id: this.props.authUser.positionList,
      deviceList: this.props.authUser.deviceList
    });
    this.setState({ deviceList: this.props.deviceList });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      JSON.stringify(prevProps.deviceList) !=
      JSON.stringify(this.props.deviceList)
    ) {
      this.setState({ deviceList: this.props.deviceList });
    }

    if (
      JSON.stringify(prevProps.selectedNode) !=
      JSON.stringify(this.props.selectedNode)
    ) {
    }
  }

  render() {
    return (
      <div className="">
        <div className="animated slideInUpTiny animation-duration-3">
          <div className="clearfix pb-1">
            <div className="float-left" />
            <div className="float-right">
              <button
                className="btn btn-primary"
                onClick={e => {
                  this.update();
                }}
                style={{ marginLeft: "2px" }}
                disabled={
                  this.state.deviceList.filter(device => device.isChecked)
                    .length == 0
                }
              >
                모니터링 측정기 적용
              </button>
            </div>
          </div>

          <table className="w3-table-all w3-centered">
            <thead>
              <tr>
                <th style={{ paddingRight: "24px", width: "30px" }}>
                  <input
                    className="w3-check"
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
                <th>측정기명</th>
                <th>건물</th>
                <th>위치</th>
                <th>측정주기</th>
                <th>S/N</th>
                <th>제품군</th>
                <th>전화번호</th>
              </tr>
            </thead>
            <tbody>
              {this.state.deviceList &&
                this.state.deviceList.map((row, index) => (
                  <tr key={row.serialNumber}>
                    <td>
                      <input
                        className="w3-check"
                        type="checkbox"
                        checked={row.isChecked}
                        value={row.serialNumber}
                        onChange={event => {
                          console.log("onChange checkbox....");
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
                    <td>{row.name}</td>
                    <td>{row.buildingName}</td>
                    <td>{row.positionName}</td>
                    <td>{row.period} 분</td>
                    <td>{row.serialNumber}</td>
                    <td>{row.productID}</td>
                    <td>{row.phone}</td>
                  </tr>
                ))}
            </tbody>
          </table>
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
  deviceListByBuildingIdRequest,
  deviceListByPositionIdRequest,
  deviceDeleteRequest,
  setViewMode,
  deviceSetItem,
  userUpdateRequest,
  deviceGetAllByPositionIdRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
