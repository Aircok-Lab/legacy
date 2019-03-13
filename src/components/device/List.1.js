import React, { cloneElement, Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import {
  buildingListRequest,
  buildingSaveRequest,
  buildingDeleteRequest
} from "actions/Building";
import { positionListRequest } from "actions/Position";
import {
  deviceListByBuildingIdRequest,
  deviceListByPositionIdRequest,
  deviceDeleteRequest
} from "actions/Device";
import DeviceModalContainer from "components/device/DeviceContainer";
import AddDevice from "components/device/Add";
import UpdateDevice from "components/device/Update";

class DeviceTable extends React.Component {
  state = {
    // mode: "list",
    isEditing: false,
    showModal: false,
    // modalMode: "addBuilding",
    modalMode: "updateBuilding",
    selectedNodeId: "",
    // selectedNodeId: "31-25"
    selectedNode: {},
    deviceList: []
  };

  constructor(props) {
    super(props);
  }

  // setMode = param => e => {
  //   let modalMode = param;
  //   this.setState({ showModal: true, modalMode });
  // };

  // closeModal = () => {
  //   this.setState({ showModal: false });
  // };

  componentDidMount() {
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
  }

  render() {
    return (
      <div className="">
        <div className="animated slideInUpTiny animation-duration-3">
          <div className="clearfix pb-1">
            <span className="float-left" />
            <span className="float-right">
              {this.state.isEditing ? (
                <button>Back</button>
              ) : (
                <React.Fragment>
                  <button
                    onClick={this.props.setMode("add")}
                    style={{ marginLeft: "2px" }}
                    disabled={!this.props.selectedNode.BuildingID}
                  >
                    등록
                  </button>

                  {/* <button
                    onClick={this.props.setMode("update")}
                    style={{ marginLeft: "2px" }}
                    disabled={
                      this.state.deviceList.filter(device => device.isChecked)
                        .length != 1
                    }
                  >
                    수정
                  </button>
                  <button
                    onClick={this.props.setMode("deleteConfirm")}
                    style={{ marginLeft: "2px" }}
                    disabled={
                      this.state.deviceList.filter(device => device.isChecked)
                        .length == 0
                    }
                  >
                    삭제
                  </button> */}
                </React.Fragment>
              )}
            </span>
          </div>

          {/* <table className="w3-table-all w3-centered">
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
                    <td>{row.Period}</td>
                    <td>{row.SerialNumber}</td>
                    <td>{row.ProductName}</td>
                    <td>{row.Phone}</td>
                  </tr>
                ))}
            </tbody>
          </table> */}
        </div>

        {/* <DeviceModalContainer
          showModal={this.state.showModal}
          modalMode={this.state.modalMode}
          closeModal={this.closeModal}
          deviceList={this.state.deviceList}
        /> */}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  deviceList: state.device.list,
  selectedNode: state.tree.selectedNode
});

const mapDispatchToProps = {
  deviceListByBuildingIdRequest: deviceListByBuildingIdRequest,
  deviceListByPositionIdRequest: deviceListByPositionIdRequest,
  deviceDeleteRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceTable);
