import React, { cloneElement, Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ContainerHeader from "components/ContainerHeader/index";
import CardBox from "components/CardBox/index";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FolderIcon from "@material-ui/icons/Folder";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Accordion from "components/Accordion/index";
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
import SaveBuildingPosition from "app/SaveBuildingPosition";

const Hello = ({ name }) => {
  return <div>Hello {name}</div>;
};

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
    selectedNode: {}
  };

  constructor(props) {
    super(props);
    console.log("*** constructor ");
  }

  openModal = param => e => {
    let modalMode = param;
    this.setState({ showModal: true, modalMode });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  componentDidMount() {
    console.log("*** componentDidMount");
    this.props.buildingListRequest({ id: this.props.authUser.BuildingList });
    this.props.positionListRequest({ id: this.props.authUser.PositionList });
  }

  componentWillReceiveProps() {
    // console.log("componentWillReceiveProps() 호출");
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // if (!this.props.buildingList.length) {
  //   //   return false;
  //   // }
  //   console.log("000000");

  //   // 건물 추가 또는 삭제시 노드데이터 요청
  //   if (this.props.authUser.BuildingList != nextProps.authUser.BuildingList) {
  //     console.log("111111");
  //     this.props.buildingListRequest({
  //       id: nextProps.authUser.BuildingList
  //     });
  //   }

  //   // 층 추가 또는 삭제시 노드데이터 요청
  //   if (this.props.authUser.PositionList != nextProps.authUser.PositionList) {
  //     console.log("22222");
  //     this.props.positionListRequest({
  //       id: nextProps.authUser.PositionList
  //     });
  //   }

  //   buildingPositionList = [...this.props.buildingList];
  //   buildingPositionList.map(item => {
  //     const items = nextProps.positionList.filter(
  //       position => position.BuildingID == item.id
  //     );
  //     if (items.length) {
  //       item.positions = items;
  //     }
  //   });
  //   console.log("buildingPositionList : ", buildingPositionList);

  //   return true;
  // }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // if (!this.state.selectedNodeId && this.props.buildingList.length > 0) {
    //   this.nodeClick(this.props.buildingList[0]);
    // }
    // console.log("*** componentDidUpdate");
    // console.log(
    //   "*** componentDidUpdate buildingList :",
    //   this.props.authUser.BuildingList,
    //   prevProps.authUser.BuildingList
    // );

    // 건물 추가 또는 삭제시 노드데이터 요청
    if (this.props.authUser.BuildingList != prevProps.authUser.BuildingList) {
      // console.log("*** componentDidUpdate buildingListRequest ********");
      this.props.buildingListRequest({
        id: this.props.authUser.BuildingList
      });
    }

    // 층 추가 또는 삭제시 노드데이터 요청
    if (this.props.authUser.PositionList != this.props.authUser.PositionList) {
      this.props.positionListRequest({
        id: this.props.authUser.PositionList
      });
    }
  }

  nodeClick = item => {
    // bound arrow function handler
    // this.setState({ item: item });
    console.log("nodeClick ", item);

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

  render() {
    console.log("*** render");

    buildingPositionList = [...this.props.buildingList];
    buildingPositionList.map(item => {
      const items = this.props.positionList.filter(
        position => position.BuildingID == item.id
      );
      if (items.length) {
        item.positions = items;
      }
    });
    console.log(
      "*** this.props.authUser.BuildingList : ",
      this.props.authUser.BuildingList
    );
    console.log("*** this.props.buildingList : ", this.props.buildingList);
    console.log("*** buildingPositionList : ", buildingPositionList);
    console.log("*** buildingPositionList : ", buildingPositionList);

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
                  className="w3-small w3-padding-small"
                  style={{ marginLeft: "2px" }}
                  onClick={this.openModal("addBuilding")}
                >
                  건물등록
                </button>
                <button
                  className="w3-small w3-padding-small"
                  style={{ marginLeft: "2px" }}
                  onClick={this.openModal("addPosition")}
                >
                  층등록
                </button>
                {!this.state.selectedNode.BuildingID ? (
                  <button
                    className="w3-small w3-padding-small"
                    style={{ marginLeft: "2px" }}
                    onClick={this.openModal("updateBuilding")}
                  >
                    건물수정
                  </button>
                ) : (
                  <button
                    className="w3-small w3-padding-small"
                    style={{ marginLeft: "2px" }}
                    onClick={this.openModal("updatePosition")}
                  >
                    층수정
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
                  {/* <i
                    className="fa fa-minus-square-o w3-large"
                    aria-hidden="true"
                  /> */}
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
                          // className="w3-border-0 w3-padding-left"
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

                {/* {item.positions &&
                  item.positions.map(position => (
                    <div key={position.id} className="w3-border">
                      <ul className="w3-ul">
                        {item.positions &&
                          item.positions.map(position => (
                            <li key={position.id}>
                              <i
                                className="fa fa-caret-right w3-large"
                                aria-hidden="true"
                              />{" "}
                              {position.Name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))} */}
              </div>
            ))}
            {/* {JSON.stringify(this.state.selectedNode)} */}
          </div>
          <div className="col-md-9">
            <div className="animated slideInUpTiny animation-duration-3">
              <div className="text-right w3-margin-bottom">
                <button onClick={this.openModal("addDevice")}>등록</button>
                <button onClick={this.openModal("updateDevice")}>수정</button>
                <button onClick={this.openModal("deleteConfirmDevice")}>
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
                  {this.props.deviceList &&
                    this.props.deviceList.map((row, index) => (
                      <tr key={row.SerialNumber}>
                        <td>
                          <input
                            className="w3-check"
                            type="checkbox"
                            onChange={() => {}}
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

              {/* {JSON.stringify(this.props.deviceList)} */}
              <Hello name="FOX" />
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
                <SaveBuildingPosition
                  node={this.state.selectedNode}
                  isAdd={true}
                />
              ),
              addPosition: (
                <form className="w3-text-blue w3-margin">
                  <h2 className="w3-center">층등록</h2>
                  <div className="w3-row w3-section">
                    <div
                      className="w3-col w3-padding-right"
                      style={{ width: "80px" }}
                    >
                      건물명
                    </div>
                    <div className="w3-rest">
                      <input
                        className="w3-input w3-border"
                        name="first"
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="w3-row w3-section">
                    <div
                      className="w3-col w3-padding-right"
                      style={{ width: "80px" }}
                    >
                      층
                    </div>
                    <div className="w3-rest">
                      <input
                        className="w3-input w3-border"
                        name="first"
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w3-button w3-right w3-blue w3-padding"
                    onClick={e => this.addBuilding()}
                  >
                    OK
                  </button>
                </form>
              ),
              updateBuilding: (
                <SaveBuildingPosition
                  node={this.state.selectedNode}
                  mode="update"
                />
              ),
              updatePosition: <div>updatePosition</div>,
              addDevice: <div>addDevice</div>,
              updateDevice: <div>updateDevice</div>,
              deleteConfirmDevice: (
                <div>
                  deleteConfirmDevice
                  <button onClick={this.openModal("deleteNoticeDevice")}>
                    삭제
                  </button>
                </div>
              ),
              deleteNoticeDevice: <div>deleteNoticeDevice</div>
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
