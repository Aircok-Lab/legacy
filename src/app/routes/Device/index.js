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
import BuildingPositionTree from "app/appcomponents/BuildingPositionTree";
import DeviceTable from "app/appcomponents/DeviceTable";
import AddBuilding from "app/appcomponents/AddBuilding";
import UpdateBuilding from "app/appcomponents/UpdateBuilding";
import AddPosition from "app/appcomponents/AddPosition";
import UpdatePosition from "app/appcomponents/UpdatePosition";
import AddDevice from "app/appcomponents/AddDevice";
import UpdateDevice from "app/appcomponents/UpdateDevice";
// import DeleteConfirmDevice from "app/appcomponents/DeleteConfirmDevice";
// import DeleteNoticeDevice from "app/appcomponents/DeleteNoticeDevice";
// import DeviceList from "app/appcomponents/DeviceList";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: "9999"
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: "9999"
  }
};

Modal.setAppElement("#body");

let buildingPositionList = [];

class DevicePage extends React.Component {
  state = {
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

  openModal = param => e => {
    let modalMode = param;
    this.setState({ showModal: true, modalMode });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  componentDidMount() {
    // console.log("cdm this.props.authUser", this.props.authUser);
    this.props.buildingListRequest({ id: this.props.authUser.BuildingList });
    this.props.positionListRequest({ id: this.props.authUser.PositionList });
  }

  componentDidUpdate111(prevProps, prevState, snapshot) {
    // // 건물 추가 또는 삭제시 노드데이터 요청
    // if (this.props.authUser.BuildingList != prevProps.authUser.BuildingList) {
    //   this.props.buildingListRequest({
    //     id: this.props.authUser.BuildingList
    //   });
    // }

    // // 층 추가 또는 삭제시 노드데이터 요청
    // if (this.props.authUser.PositionList != prevProps.authUser.PositionList) {
    //   this.props.positionListRequest({
    //     id: this.props.authUser.PositionList
    //   });
    // }

    if (
      JSON.stringify(prevProps.deviceList) !=
      JSON.stringify(this.props.deviceList)
    ) {
      console.log(
        "DevicePage componentDidUpdate 호출됨",
        prevProps,
        this.props
      );
      this.setState({ deviceList: this.props.deviceList });
    }
  }

  render() {
    // buildingPositionList = [...this.props.buildingList];
    // buildingPositionList.map(item => {
    //   const items = this.props.positionList.filter(
    //     position => position.BuildingID == item.id
    //   );
    //   if (items.length) {
    //     item.positions = items;
    //   }
    // });

    return (
      <div className="app-wrapper">
        <div className="w3-panel w3-white w3-card w3-padding">
          <h2>측정기 관리</h2>
        </div>

        <div className="row">
          <div className="col-md-3">
            <BuildingPositionTree openModal={this.openModal} />
          </div>
          <div className="col-md-9">
            <div className="animated slideInUpTiny animation-duration-3">
              {/* <div>{JSON.stringify(this.state.deviceList)}</div> */}

              <DeviceTable />

              {/* <div className="text-right w3-margin-bottom">
                <button
                  onClick={this.openModal("addDevice")}
                  style={{ marginLeft: "2px" }}
                  disabled={!this.state.selectedNode.BuildingID}
                >
                  등록
                </button>

                <button
                  onClick={this.openModal("updateDevice")}
                  style={{ marginLeft: "2px" }}
                  disabled={
                    this.state.deviceList.filter(device => device.isChecked)
                      .length != 1
                  }
                >
                  수정
                </button>
                <button
                  onClick={this.openModal("deleteConfirmDevice")}
                  style={{ marginLeft: "2px" }}
                  disabled={
                    this.state.deviceList.filter(device => device.isChecked)
                      .length == 0
                  }
                >
                  삭제
                </button>
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
                    <th>Phone번호</th>
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
                                if (
                                  device.SerialNumber === event.target.value
                                ) {
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
              </table>
             */}
            </div>
          </div>
        </div>

        <Modal
          isOpen={this.state.showModal}
          // onRequestClose={this.closeModal}
          contentLabel="측정기 관리 Modal"
          style={customStyles}
          // className="w3-display-container"
        >
          <button className="w3-display-topright" onClick={this.closeModal}>
            X
          </button>
          <div className="" style={{ minWidth: "400px" }} />
          {
            {
              addBuilding: (
                <AddBuilding
                  node={this.state.selectedNode}
                  closeModal={this.closeModal}
                />
              ),
              updateBuilding: <UpdateBuilding node={this.state.selectedNode} />,
              addPosition: <AddPosition node={this.state.selectedNode} />,
              updatePosition: <UpdatePosition node={this.state.selectedNode} />,
              addDevice: (
                <AddDevice
                  node={this.state.selectedNode}
                  closeModal={this.closeModal}
                />
              ),
              updateDevice: <UpdateDevice node={this.state.selectedNode} />,
              deleteConfirmDevice: (
                <div>
                  선택항목을 삭제하시겠습니까?
                  <br />
                  <div className="w3-right">
                    <button
                      type="button"
                      className="w3-button w3-blue w3-padding"
                      onClick={() => {
                        const selectedDevices = this.state.deviceList.filter(
                          device => device.isChecked
                        );

                        const ids = selectedDevices.map(
                          ({ SerialNumber }) => SerialNumber
                        );
                        console.log(
                          "deleteDevices:",
                          selectedDevices,
                          ids.join()
                        );
                        // this.openModal("deleteNoticeDevice");
                        this.props.deviceDeleteRequest({
                          positionID: this.state.selectedNode.id,
                          ids: ids.join()
                        });

                        this.closeModal();
                      }}
                    >
                      OK
                    </button>
                  </div>
                </div>
              ),
              deleteNoticeDevice: (
                <div>
                  선택항목이 삭제되었습니다.
                  <br />
                  <div className="w3-right">
                    <button
                      type="button"
                      className="w3-button w3-blue w3-padding"
                      onClick={this.closeModal}
                    >
                      OK
                    </button>
                  </div>
                </div>
              )
            }[this.state.modalMode]
          }

          {/*
           */}
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  buildingList: state.building.list,
  positionList: state.position.list,
  deviceList: state.device.list
});

const mapDispatchToProps = {
  buildingListRequest: buildingListRequest,
  // buildingSaveRequest: buildingSaveRequest,
  // buildingDeleteRequest: buildingDeleteRequest,
  positionListRequest: positionListRequest,
  deviceListByBuildingIdRequest: deviceListByBuildingIdRequest,
  deviceListByPositionIdRequest: deviceListByPositionIdRequest,
  deviceDeleteRequest,
  deviceDeleteRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicePage);
