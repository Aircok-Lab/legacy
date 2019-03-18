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
      const ids = selectedDevices.map(({ SerialNumber }) => SerialNumber);
      this.props.deviceDeleteRequest({
        node: this.props.selectedNode,
        ids: ids.join()
      });
    }
  };

  componentDidMount() {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    if (this.props.selectedNode.BuildingID) {
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

    // this.setState({ deviceList: this.props.deviceList });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("update 요청....................");
    if (
      JSON.stringify(prevProps.deviceList) !=
      JSON.stringify(this.props.deviceList)
    ) {
      this.setState({ deviceList: this.props.deviceList });
    }

    // if (
    //   JSON.stringify(prevProps.selectedNode) !=
    //   JSON.stringify(this.props.selectedNode)
    // ) {
    //   console.log("list 요청함....");
    //   if (this.props.selectedNode.BuildingID) {
    //     // 층
    //     this.props.deviceListByPositionIdRequest({
    //       id: this.props.selectedNode.id
    //     });
    //   } else {
    //     // 건물
    //     this.props.deviceListByBuildingIdRequest({
    //       id: this.props.selectedNode.id
    //     });
    //   }
    // }

    console.log("***** list 요청함....");
    if (this.props.selectedNode.BuildingID) {
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

  render() {
    return (
      <div className="">
        <div className="animated slideInUpTiny animation-duration-3">
          <div className="clearfix pb-1">
            <div className="float-left" />
            <div className="float-right">
              <button
                className="btn btn-primary"
                onClick={e => this.props.setViewMode("add")}
                style={{ marginLeft: "2px" }}
                disabled={!this.props.selectedNode.BuildingID}
              >
                등록
              </button>
              <button
                className="btn btn-primary"
                onClick={e => {
                  this.props.deviceSetItem(this.state.deviceList[0]);
                  // console.log("test....");
                  this.props.setViewMode("update");
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
  deviceSetItem
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
