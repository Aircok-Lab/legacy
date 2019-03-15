import React, { cloneElement, Component } from "react";
import { connect } from "react-redux";
import {
  deviceListByBuildingIdRequest,
  deviceListByPositionIdRequest,
  deviceDeleteRequest,
  deviceSetItem
} from "actions/Device";
import { userUpdateRequest } from "actions/User";
import { setViewMode } from "actions/Setting";

class List extends React.Component {
  state = {
    showModal: false,
    selectedNode: {},
    deviceList: []
  };

  update = () => {
    const selectedDevices = this.state.deviceList.filter(device => {
      return device.isChecked;
    });
    const ids = selectedDevices.map(({ SerialNumber }) => SerialNumber);
    this.props.userUpdateRequest({
      id: this.props.authUser.id,
      deviceList: ids.join()
    });

    console.log("모니터링 선택", ids);
    // if (confirm("선택항목을 삭제하시겠습니까?")) {
    //   const selectedDevices = this.state.deviceList.filter(device => {
    //     return device.isChecked;
    //   });
    //   const ids = selectedDevices.map(({ SerialNumber }) => SerialNumber);
    //   this.props.deviceDeleteRequest({
    //     node: this.props.selectedNode,
    //     ids: ids.join()
    //   });
    // }
  };

  componentDidMount() {
    this.setState({ deviceList: this.props.deviceList });
    this.props.deviceListByPositionIdRequest({
      id: this.props.authUser.PositionList
    });
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
    console.log("render", Date.now());
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
                <th>측정주기</th>
                <th>S/N</th>
                <th>제품군</th>
                <th>전화번호</th>
              </tr>
            </thead>
            <tbody>
              {this.state.deviceList &&
                this.state.deviceList.map((row, index) => (
                  <tr key={row.SerialNumber}>
                    <td>
                      <input
                        className="w3-check"
                        type="checkbox"
                        checked={row.isChecked}
                        value={row.SerialNumber}
                        onChange={event => {
                          console.log("onChange checkbox....");
                          let deviceList = this.state.deviceList;
                          deviceList.forEach(device => {
                            if (device.SerialNumber === event.target.value) {
                              device.isChecked = event.target.checked;
                            }
                          });
                          this.setState({ deviceList: deviceList });
                        }}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{row.Name}</td>
                    <td>{row.Period} 분</td>
                    <td>{row.SerialNumber}</td>
                    <td>{row.ProductName}</td>
                    <td>{row.Phone}</td>
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
  deviceListByBuildingIdRequest: deviceListByBuildingIdRequest,
  deviceListByPositionIdRequest: deviceListByPositionIdRequest,
  deviceDeleteRequest,
  setViewMode,
  deviceSetItem,
  userUpdateRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
