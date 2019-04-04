import React, { cloneElement, Component } from "react";
import { connect } from "react-redux";
import {
  deviceListByBuildingIdRequest,
  deviceListByPositionIdRequest,
  deviceDeleteRequest,
  deviceSetItem
} from "actions/Device";
import { setViewMode } from "actions/Setting";

class List extends React.Component {
  state = {
    showModal: false,
    selectedNode: {},
    deviceList: []
  };

  delete = () => {
    if (confirm("선택항목을 삭제하시겠습니까?")) {
      const selectedDevices = this.state.deviceList.filter(device => {
        return device.isChecked;
      });
      const ids = selectedDevices.map(({ serialNumber }) => serialNumber);
      this.props.deviceDeleteRequest({
        node: this.props.selectedNode,
        ids: ids.join()
      });
    }
  };

  componentDidMount() {
    if (this.props.selectedNode.buildingID) {
      // 층
      this.props.deviceListByPositionIdRequest({
        id: this.props.selectedNode.id
      });
    } else if (this.props.selectedNode.id) {
      // 건물
      this.props.deviceListByBuildingIdRequest({
        id: this.props.selectedNode.id
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(state.deviceList) != JSON.stringify(props.deviceList)) {
      return {
        deviceList: props.deviceList
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      JSON.stringify(prevProps.selectedNode) !=
        JSON.stringify(this.props.selectedNode) &&
      this.props.selectedNode.id
    ) {
      if (this.props.selectedNode.buildingID) {
        // 층
        this.props.deviceListByPositionIdRequest({
          id: this.props.selectedNode.id
        });
      } else {
        // 건물
        this.props.deviceListByBuildingIdRequest({
          id: this.props.selectedNode.id
        });
      }
    }
  }

  render() {
    return (
      <div className="">
        <div className="animated slideInUpTiny animation-duration-3">
          {!this.props.hideButton && (
            <div className="clearfix pb-1">
              <div className="float-left" />
              <div className="float-right">
                <button
                  className="btn btn-primary"
                  onClick={e => this.props.setViewMode("add")}
                  style={{ marginLeft: "2px" }}
                  disabled={!this.props.selectedNode.buildingID}
                >
                  등록
                </button>
                <button
                  className="btn btn-primary"
                  onClick={e => {
                    const selectedDevices = this.state.deviceList.filter(
                      device => device.isChecked
                    );
                    this.props.setViewMode("update", selectedDevices[0]);
                  }}
                  style={{ marginLeft: "2px" }}
                  disabled={
                    this.state.deviceList.filter(device => device.isChecked)
                      .length != 1
                  }
                >
                  수정
                </button>
                <button
                  className="btn btn-primary"
                  onClick={e => {
                    this.delete();
                  }}
                  style={{ marginLeft: "2px" }}
                  disabled={
                    this.state.deviceList.filter(device => device.isChecked)
                      .length == 0
                  }
                >
                  삭제
                </button>
              </div>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-bordered text-center text-nowrap">
              <thead>
                <tr>
                  {!this.props.hideButton && (
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
                  )}
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
                    <tr key={row.serialNumber}>
                      {!this.props.hideButton && (
                        <td>
                          <input
                            type="checkbox"
                            checked={row.isChecked}
                            value={row.serialNumber}
                            onChange={event => {
                              let deviceList = this.state.deviceList;
                              deviceList.forEach(device => {
                                if (
                                  device.serialNumber === event.target.value
                                ) {
                                  device.isChecked = event.target.checked;
                                }
                              });
                              this.setState({ deviceList: deviceList });
                            }}
                          />
                        </td>
                      )}

                      <td>{index + 1}</td>
                      <td>{row.name}</td>
                      <td>{row.period} 분</td>
                      <td>{row.serialNumber}</td>
                      <td>{row.productName}</td>
                      <td>{row.phone}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
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
  deviceSetItem
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
