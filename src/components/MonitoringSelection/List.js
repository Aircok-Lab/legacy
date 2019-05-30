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
                    <td>{row.name}</td>
                    <td>{row.buildingName}</td>
                    <td>{row.positionName}</td>
                    <td>{row.period} 분</td>
                    <td>{row.serialNumber}</td>
                    <td>{row.productName}</td>
                    <td>{row.phone}</td>
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
