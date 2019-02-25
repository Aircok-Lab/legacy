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
import { buildingListRequest } from "actions/Building";
import { positionListRequest } from "actions/Position";
import {
  deviceListByBuildingIdRequest,
  deviceListByPositionIdRequest
} from "actions/Device";

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

class DevicePage extends React.Component {
  state = {
    showModal: false,
    modalMode: "",
    selectedNode: ""
    // selectedNode: "31-25"
  };

  constructor(props) {
    super(props);
    this.nodeClick = this.nodeClick.bind(this);
  }

  openModal = param => e => {
    let modalMode = param;
    this.setState({ showModal: true, modalMode });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  componentDidMount() {
    // console.log("componentDidMount() 호출");
    this.props.buildingListRequest({ id: this.props.authUser.BuildingList });
    this.props.positionListRequest({ id: this.props.authUser.PositionList });
    // this.props.deviceListByBuildingIdRequest({ id: 1 });
  }

  componentWillReceiveProps() {
    // console.log("componentWillReceiveProps() 호출");
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log("shouldComponentUpdate() 호출");
    // console.log("this.props, nextProps", this.props, nextProps);
    // console.log("this.state, nextState", this.state, nextState);
    return true;
  }

  nodeClick = item => {
    // bound arrow function handler
    // this.setState({ item: item });
    console.log("nodeClick ", item);

    let nodeId = "";
    if (item.BuildingID) {
      // 층의 경우
      nodeId = "" + item.BuildingID + "-" + item.id;
      this.props.deviceListByPositionIdRequest({ id: "" + item.id });
    } else {
      // 건물의 경우
      nodeId = "" + item.id;
      this.props.deviceListByBuildingIdRequest({ id: item.id });
    }
    this.setState({
      selectedNode: nodeId
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log("componentDidUpdate() 호출", prevProps, prevState, snapshot);
    // console.log(
    //   "this.props.buildingList .... ",
    //   this.state.selectedNode,
    //   prevProps.buildingList,
    //   this.props.buildingList
    // );

    // if (
    //   prevProps.buildingList.length == 0 &&
    //   this.props.buildingList.length > 0
    // ) {
    //   this.setState({
    //     selectedNode: "" + this.props.buildingList[0].id
    //   });
    // }

    if (!this.state.selectedNode && this.props.buildingList.length > 0) {
      // this.setState({
      //   selectedNode: "" + this.props.buildingList[0].id
      // });
      // console.log(
      //   "this.state.selectedNode.... call nodeChage >>>> ",
      //   this.state.selectedNode,
      //   this.props.buildingList[0].id
      // );
      // this.nodeClick("" + this.props.buildingList[0].id, null);
      // this.nodeClick(1, null);
      // this.testChange(55, 77);
      this.nodeClick(this.props.buildingList[0]);
    }
  }

  render() {
    let buildingPositionList = [...this.props.buildingList];
    buildingPositionList.map(item => {
      const items = this.props.positionList.filter(
        position => position.BuildingID == item.id
      );
      if (items.length) {
        item.positions = items;
      }
    });
    // console.log("buildingPositionList : ", buildingPositionList);
    if (!buildingPositionList) return null;

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
                <button
                  className="w3-small w3-padding-small"
                  style={{ marginLeft: "2px" }}
                  onClick={this.openModal("updateBuilding")}
                >
                  건물수정
                </button>
                <button
                  className="w3-small w3-padding-small"
                  style={{ marginLeft: "2px" }}
                  onClick={this.openModal("updatePosition")}
                >
                  층수정
                </button>
              </div>
            </div>

            {buildingPositionList.map(item => (
              <div key={item.id}>
                <div
                  style={{ cursor: "pointer" }}
                  className={
                    "w3-block w3-padding w3-border " +
                    (this.state.selectedNode === "" + item.id ? "w3-blue" : "")
                  }
                  // onClick={this.nodeClick(item.id, null)}
                  // onClick={this.nodeClick}
                  onClick={e => this.nodeClick(item)}
                >
                  <i className="fa fa-plus-square-o" aria-hidden="true" />
                  {/* <i
                    className="fa fa-minus-square-o w3-large"
                    aria-hidden="true"
                  /> */}
                  <span>
                    {" "}
                    {item.Name} {item.id}{" "}
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
                            (this.state.selectedNode ===
                            "" + position.BuildingID + "-" + position.id
                              ? "w3-blue"
                              : "")
                          }
                          // onClick={this.nodeClick(
                          //   position.BuildingID,
                          //   position.id
                          // )}
                          onClick={this.nodeClick}
                          onClick={e => this.nodeClick(position)}
                        >
                          <i
                            className="fa fa-caret-right w3-large"
                            aria-hidden="true"
                          />{" "}
                          {position.Name} {position.id} |{" "}
                          {"" + position.BuildingID + "-" + position.id}
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
            {/* 
            <div>
              <p>
                <button onClick={() => this.setState({ selectedIndex: 0 })}>
                  Open #0
                </button>
                <button onClick={() => this.setState({ selectedIndex: 1 })}>
                  Open #1
                </button>
                <button onClick={() => this.setState({ selectedIndex: 2 })}>
                  Open #2
                </button>
                <button onClick={() => this.setState({ selectedIndex: -1 })}>
                  Close
                </button>
              </p>

              <Accordion
                className="accordion"
                selectedIndex={this.state.selectedIndex}
                onChange={(index, expanded, selectedIndex) => {}}
              >
                <div data-header="Super simple" className="accordion-item">
                  <p>One</p>
                </div>
                <div data-header="Fully responsive" className="accordion-item">
                  <p>two</p>
                </div>
                <div data-header="accordion" className="accordion-item">
                  <p>three</p>
                </div>
              </Accordion>
            </div>
            <List dense={false}>
              <ListItem button>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText>대전오류사옥</ListItemText>
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText>광천사옥</ListItemText>
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText>강서사옥</ListItemText>
              </ListItem>
            </List>
            <div style={{ marginTop: "0px" }}>
              <Button
                variant="raised"
                color="primary"
                className="jr-btn text-white"
                onClick={this.handleClickOpen}
              >
                건물 등록
              </Button>
              <Button
                variant="raised"
                color="primary"
                className="jr-btn text-white"
              >
                층 등록
              </Button>
              <Button variant="raised" className="jr-btn bg-info text-white">
                수정
              </Button>
            </div> */}
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
                        <td>{row.Interbal}</td>
                        <td>{row.SerialNumber}</td>
                        <td>{row.Product}</td>
                        <td>{row.Phone}</td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {/* {JSON.stringify(this.props.deviceList)} */}
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

          {
            {
              addBuilding: (
                <div>
                  addBuilding
                  <DialogTitle>건물 등록</DialogTitle>
                  <DialogContent>
                    <DialogContentText />
                    <div className="container">
                      <div className="row">
                        <div
                          className="col-md-3"
                          style={{ lineHeight: "40px" }}
                        >
                          <label>건물명</label>
                        </div>
                        <div className="col-md-9">
                          <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label=""
                            type="email"
                            fullWidth
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className="col-md-3"
                          style={{ lineHeight: "40px" }}
                        >
                          <label>주소</label>
                        </div>
                        <div className="col-md-9">
                          <div className="row">
                            <div className="col-md-8">
                              <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label=""
                                type="email"
                                fullWidth
                              />
                            </div>
                            <div
                              className="col-md-4"
                              style={{ lineHeight: "40px" }}
                            >
                              <Button
                                variant="raised"
                                className="jr-btn jr-btn-xs bg-white text-black"
                              >
                                좌표검색
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className="col-md-3"
                          style={{ lineHeight: "40px" }}
                        >
                          <label>위도</label>
                        </div>
                        <div className="col-md-9">
                          <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label=""
                            type="email"
                            fullWidth
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className="col-md-3"
                          style={{ lineHeight: "40px" }}
                        >
                          <label>경도</label>
                        </div>
                        <div className="col-md-9">
                          <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label=""
                            type="email"
                            fullWidth
                          />
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="raised"
                      color="primary"
                      className="jr-btn text-white"
                    >
                      OK
                    </Button>
                  </DialogActions>
                </div>
              ),
              addPosition: <div>addPosition</div>,
              updateBuilding: <div>updateBuilding</div>,
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
  positionListRequest: positionListRequest,
  deviceListByBuildingIdRequest: deviceListByBuildingIdRequest,
  deviceListByPositionIdRequest: deviceListByPositionIdRequest
  //deviceListByBuildingIdRequest, deviceListByPositionIdRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicePage);
