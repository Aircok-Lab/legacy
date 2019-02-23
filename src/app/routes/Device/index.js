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
    transform: "translate(-50%, -50%)"
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)"
  }
};

Modal.setAppElement("#app-site");

class DevicePage extends React.Component {
  state = {
    showModal: false
  };

  constructor() {
    super();

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  componentDidMount() {
    this.props.buildingListRequest({ id: this.props.authUser.BuildingList });
    this.props.positionListRequest({ id: this.props.authUser.PositionList });
    this.props.deviceListByBuildingIdRequest({ id: 1 });
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
    console.log("buildingPositionList : ", buildingPositionList);
    if (!buildingPositionList) return null;

    return (
      <div className="app-wrapper">
        <div className="w3-panel w3-white w3-card w3-padding">
          <h2>측정기 관리</h2>
        </div>

        <div className="row">
          <div className="col-md-3">
            <button onClick={this.handleOpenModal}>Trigger Modal</button>

            <Modal
              isOpen={this.state.showModal}
              onRequestClose={this.handleCloseModal}
              contentLabel="측정기 관리 Modal"
              style={customStyles}
            >
              <button onClick={this.handleCloseModal}>Close Modal</button>
              <DialogTitle>건물 등록</DialogTitle>
              <DialogContent>
                <DialogContentText />
                <div className="container">
                  <div className="row">
                    <div className="col-md-3" style={{ lineHeight: "40px" }}>
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
                    <div className="col-md-3" style={{ lineHeight: "40px" }}>
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
                    <div className="col-md-3" style={{ lineHeight: "40px" }}>
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
                    <div className="col-md-3" style={{ lineHeight: "40px" }}>
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
            </Modal>

            <div>건물목록 </div>

            {buildingPositionList.map(item => (
              <div key={item.id}>
                <div className="w3-button w3-light-grey w3-block w3-left-align w3-dark-grey">
                  {item.Name} : {item.id}
                </div>
                {item.positions &&
                  item.positions.map(position => (
                    <div key={position.id} className="w3-border">
                      <ul className="w3-ul">
                        {item.positions &&
                          item.positions.map(position => (
                            <li key={position.id}>{position.Name}</li>
                          ))}
                      </ul>
                    </div>
                  ))}
              </div>
            ))}
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
            </div>
          </div>
          <div className="col-md-9">
            <div className="animated slideInUpTiny animation-duration-3">
              <div className="text-right">
                <Button
                  variant="raised"
                  color="primary"
                  className="jr-btn text-white"
                >
                  등록
                </Button>
                <Button variant="raised" className="jr-btn bg-info text-white">
                  수정
                </Button>
                <Button
                  variant="raised"
                  className="jr-btn bg-danger text-white"
                >
                  삭제
                </Button>
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
