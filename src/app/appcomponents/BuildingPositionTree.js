import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import AddBuilding from "app/appcomponents/AddBuilding";
import UpdateBuilding from "app/appcomponents/UpdateBuilding";
import AddPosition from "app/appcomponents/AddPosition";
import UpdatePosition from "app/appcomponents/UpdatePosition";
import AddDevice from "app/appcomponents/AddDevice";
import UpdateDevice from "app/appcomponents/UpdateDevice";
import { selectTreeNode } from "actions/Tree";
import { buildingListRequest, buildingAddRequest } from "actions/Building";
import { positionListRequest, positionAddRequest } from "actions/Position";

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

class BuildingPositionTree extends Component {
  state = {
    showModal: false,
    // modalMode: "addBuilding",
    modalMode: "updateBuilding",
    selectedNodeId: "",
    // selectedNodeId: "31-25"
    selectedNode: {},
    deviceList: []
  };
  componentDidMount() {
    // console.log("cdm this.props.authUser", this.props.authUser);
    this.props.buildingListRequest({ id: this.props.authUser.BuildingList });
    this.props.positionListRequest({ id: this.props.authUser.PositionList });
  }

  addBuilding = () => {
    this.props.buildingAddRequest({
      name: "빌딩",
      address: "여의도",
      latitude: 22,
      longitude: 2222,
      userID: this.props.authUser.id
    });
  };
  nodeClick = item => {
    console.log("node click");
    this.props.selectTreeNode(item);

    let nodeId = "";
    if (item.BuildingID) {
      // 층
      nodeId = "" + item.BuildingID + "-" + item.id;
      // this.props.deviceListByPositionIdRequest({ id: "" + item.id });
    } else {
      // 건물
      nodeId = "" + item.id;
      // this.props.deviceListByBuildingIdRequest({ id: item.id });
    }
    this.setState({
      selectedNodeId: nodeId
    });
  };

  render() {
    console.log("this.props.buildingList", this.props.buildingList);

    let buildingPositionList = [...this.props.buildingList];
    buildingPositionList.map(item => {
      const items = this.props.positionList.filter(
        position => position.BuildingID == item.id
      );
      if (items.length) {
        item.positions = items;
      }
    });

    return (
      <div>
        {/* {JSON.stringify(this.props.selectedNode)} */}
        <div
          className="w3-margin-bottom"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <div>
            <button
              style={{ marginLeft: "2px" }}
              onClick={this.props.openModal("addBuilding")}
            >
              건물등록
            </button>
            <button
              style={{ marginLeft: "2px" }}
              onClick={this.props.openModal("addPosition")}
              disabled={
                this.props.selectedNode.BuildingID ||
                !this.props.selectedNode.id
              }
            >
              층등록
            </button>
            {this.props.selectedNode.BuildingID && (
              <button
                style={{ marginLeft: "2px" }}
                onClick={this.props.openModal("updatePosition")}
              >
                수정
              </button>
            )}
            {this.props.selectedNode.id && !this.props.selectedNode.BuildingID && (
              <button
                style={{ marginLeft: "2px" }}
                onClick={this.props.openModal("updateBuilding")}
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
                (this.state.selectedNodeId === "" + item.id ? "w3-blue" : "")
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
                      {position.Name} {position.BuildingID + "-" + position.id}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ))}

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
              addPosition: (
                <AddPosition
                  node={this.state.selectedNode}
                  closeModal={this.closeModal}
                />
              ),
              updatePosition: <UpdatePosition node={this.state.selectedNode} />
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
  selectedNode: state.tree.selectedNode
});

const mapDispatchToProps = dispatch => ({
  buildingAddRequest: buildingAddRequest,
  buildingListRequest: buildingListRequest,
  positionAddRequest: positionAddRequest,
  positionListRequest: positionListRequest,
  selectTreeNode: node => dispatch({ type: "SELECT_TREE_NODE", payload: node })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuildingPositionTree);
