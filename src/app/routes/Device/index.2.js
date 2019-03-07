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
  deviceListByPositionIdRequest
} from "actions/Device";
import AddBuilding from "app/appcomponents/AddBuilding";
import UpdateBuilding from "app/appcomponents/UpdateBuilding";
import AddPosition from "app/appcomponents/AddPosition";
import UpdatePosition from "app/appcomponents/UpdatePosition";
import AddDevice from "app/appcomponents/AddDevice";
import UpdateDevice from "app/appcomponents/UpdateDevice";
import DeleteConfirmDevice from "app/appcomponents/DeleteConfirmDevice";
import DeleteNoticeDevice from "app/appcomponents/DeleteNoticeDevice";

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

const CheckBox = props => {
  return (
    <li>
      <input
        key={props.id}
        onChange={props.handleCheckChieldElement}
        type="checkbox"
        checked={props.isChecked}
        value={props.value}
      />{" "}
      {props.value}
    </li>
  );
};

class DevicePage extends React.Component {
  state = {
    showModal: false,
    // modalMode: "addBuilding",
    modalMode: "updateBuilding",
    selectedNodeId: "",
    // selectedNodeId: "31-25"
    selectedNode: {},
    deviceList: [],
    fruites: [
      { id: 1, value: "banana", isChecked: false },
      { id: 2, value: "apple", isChecked: false },
      { id: 3, value: "mango", isChecked: false },
      { id: 4, value: "grap", isChecked: false }
    ]
  };

  handleAllChecked = event => {
    let fruites = this.state.fruites;
    fruites.forEach(fruite => (fruite.isChecked = event.target.checked));
    this.setState({ fruites: fruites });
  };

  handleCheckChieldElement = event => {
    let fruites = this.state.fruites;
    fruites.forEach(fruite => {
      if (fruite.value === event.target.value)
        fruite.isChecked = event.target.checked;
    });
    this.setState({ fruites: fruites });
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
    this.props.buildingListRequest({ id: this.props.authUser.BuildingList });
    this.props.positionListRequest({ id: this.props.authUser.PositionList });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 건물 추가 또는 삭제시 노드데이터 요청
    if (this.props.authUser.BuildingList != prevProps.authUser.BuildingList) {
      this.props.buildingListRequest({
        id: this.props.authUser.BuildingList
      });
    }

    // 층 추가 또는 삭제시 노드데이터 요청
    if (this.props.authUser.PositionList != prevProps.authUser.PositionList) {
      this.props.positionListRequest({
        id: this.props.authUser.PositionList
      });
    }

    // deviceList props가 변경되면, deviceList state로 복제
    console.log(
      "deviceList : ",
      this.props.deviceList,
      prevProps.deviceList,
      prevState.deviceList,
      this.state.deviceList
    );

    if (this.props.deviceList != prevState.deviceList) {
      console.log(
        "deviceList changed.",
        this.props.deviceList,
        prevState.deviceList
      );
      this.setState({ deviceList: this.props.deviceList });
    }
  }

  // shouldComponentUpdate = (nextProps, nextState) => {
  //   console.log("shouldComponentUpdate", nextProps, nextState);

  //   if (nextProps.deviceList.length > 0) {
  //     const deviceCopy = nextProps.deviceList.map(device => {
  //       return {
  //         ...device,
  //         isChecked: false
  //       };
  //     });
  //     this.setState({ deviceList: deviceCopy });
  //   }

  //   return true;
  // };

  nodeClick = item => {
    let nodeId = "";
    if (item.BuildingID) {
      // 층
      nodeId = "" + item.BuildingID + "-" + item.id;
      this.props.deviceListByPositionIdRequest({ id: "" + item.id });
    } else {
      // 건물
      nodeId = "" + item.id;
      this.props.deviceListByBuildingIdRequest({ id: item.id });
    }
    this.setState({
      selectedNodeId: nodeId,
      selectedNode: item
    });
  };

  toggleChecked = () => {
    console.log("toggleChecked.....");
  };

  render() {
    buildingPositionList = [...this.props.buildingList];
    buildingPositionList.map(item => {
      const items = this.props.positionList.filter(
        position => position.BuildingID == item.id
      );
      if (items.length) {
        item.positions = items;
      }
    });
    return (
      <div className="app-wrapper">
        <div className="w3-panel w3-white w3-card w3-padding">
          <h2>측정기 관리</h2>
        </div>

        <div className="row">
          <div className="col-md-3">
            <div
              className="w3-margin-bottom"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <div>
                <button
                  style={{ marginLeft: "2px" }}
                  onClick={this.openModal("addBuilding")}
                >
                  건물등록
                </button>
                <button
                  style={{ marginLeft: "2px" }}
                  onClick={this.openModal("addPosition")}
                  disabled={
                    this.state.selectedNode.BuildingID ||
                    !this.state.selectedNode.id
                  }
                >
                  층등록
                </button>
                {this.state.selectedNode.BuildingID && (
                  <button
                    style={{ marginLeft: "2px" }}
                    onClick={this.openModal("updatePosition")}
                  >
                    수정
                  </button>
                )}
                {this.state.selectedNode.id &&
                  !this.state.selectedNode.BuildingID && (
                    <button
                      style={{ marginLeft: "2px" }}
                      onClick={this.openModal("updateBuilding")}
                    >
                      수정
                    </button>
                  )}
              </div>
            </div>
            {buildingPositionList.map(item => (
              <div key={item.id}>
                <div
                  style={{ cursor: "pointer" }}
                  className={
                    "w3-block w3-padding w3-border " +
                    (this.state.selectedNodeId === "" + item.id
                      ? "w3-blue"
                      : "")
                  }
                  onClick={e => this.nodeClick(item)}
                >
                  <i className="fa fa-plus-square-o" aria-hidden="true" />
                  <span>
                    {" "}
                    {item.Name} {item.id}
                  </span>
                </div>

                <div className="">
                  <ul className="w3-ul">
                    {item.positions &&
                      item.positions.map(position => (
                        <li
                          key={position.id}
                          style={{ cursor: "pointer" }}
                          className={
                            "w3-border-0 w3-padding-left " +
                            (this.state.selectedNodeId ===
                            "" + position.BuildingID + "-" + position.id
                              ? "w3-blue"
                              : "")
                          }
                          onClick={e => this.nodeClick(position)}
                        >
                          <i
                            className="fa fa-caret-right w3-large"
                            aria-hidden="true"
                          />{" "}
                          {position.Name}{" "}
                          {position.BuildingID + "-" + position.id}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-9">
            <div className="animated slideInUpTiny animation-duration-3">
              <div className="App">
                <h1> Check and Uncheck All Example </h1>
                <input
                  type="checkbox"
                  onChange={this.handleAllChecked}
                  value="checkedall"
                />{" "}
                Check / Uncheck All
                <ul>
                  {this.state.fruites.map((fruite, index) => {
                    return (
                      <li>
                        {/* <CheckBox
                        key={index}
                        handleCheckChieldElement={this.handleCheckChieldElement}
                        {...fruite}
                      /> */}

                        <input
                          key={index}
                          onChange={this.handleCheckChieldElement}
                          type="checkbox"
                          checked={fruite.isChecked}
                          value={fruite.value}
                        />
                        {fruite.value}
                      </li>
                    );
                  })}
                </ul>
                <div>{JSON.stringify(this.state.fruites)}</div>
              </div>

              <div className="text-right w3-margin-bottom">
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
                >
                  수정
                </button>
                <button
                  onClick={this.openModal("deleteConfirmDevice")}
                  style={{ marginLeft: "2px" }}
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
                        checked="checked"
                        onChange={() => {}}
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
                            // onChange={() => { this.setState({row.isChecked != row.isChecked}}
                            // onChange={this.toggleChecked}
                            onChange={() => {
                              const deviceCopy = this.state.deviceList.map(
                                device => {
                                  if (
                                    device.SerialNumber === row.SerialNumber
                                  ) {
                                    return {
                                      ...device,
                                      isChecked: !device.isChecked
                                    };
                                  } else {
                                    return device;
                                  }
                                }
                              );
                              console.log("deviceCopy....", deviceCopy);
                              this.setState({
                                deviceList: deviceCopy
                              });
                            }}
                            // onClick={e => {
                            //   console.log(
                            //     "e.target.checked : ",
                            //     e.target.checked
                            //   );
                            //   this.state.deviceList.map(device => {
                            //     console.log("onChange", device);
                            //   });
                            // }}
                            checked={row.isChecked}
                          />
                        </td>
                        <td>
                          {index + 1} . {row.isChecked}
                        </td>
                        <td>{row.Name}</td>
                        <td>{row.Period}</td>
                        <td>{row.SerialNumber}</td>
                        <td>{row.ProductName}</td>
                        <td>{row.Phone}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
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
              addBuilding: <AddBuilding node={this.state.selectedNode} />,
              updateBuilding: <UpdateBuilding node={this.state.selectedNode} />,
              addPosition: <AddPosition node={this.state.selectedNode} />,
              updatePosition: <UpdatePosition node={this.state.selectedNode} />,
              addDevice: <AddDevice node={this.state.selectedNode} />,
              updateDevice: <UpdateDevice node={this.state.selectedNode} />,
              deleteConfirmDevice1: (
                <DeleteConfirmDevice node={this.state.selectedNode} />
              ),
              deleteConfirmDevice: (
                <div>
                  선택항목을 삭제하시겠습니까?
                  <br />
                  <div className="w3-right">
                    <button
                      type="button"
                      className="w3-button w3-blue w3-padding"
                      onClick={this.openModal("deleteNoticeDevice")}
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
  deviceListByPositionIdRequest: deviceListByPositionIdRequest
  //deviceListByBuildingIdRequest, deviceListByPositionIdRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicePage);
