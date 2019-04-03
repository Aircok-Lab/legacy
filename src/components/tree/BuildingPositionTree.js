import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import AddBuilding from "components/Tree/AddBuilding";
import UpdateBuilding from "components/Tree/UpdateBuilding";
import AddPosition from "components/Tree/AddPosition";
import UpdatePosition from "components/Tree/UpdatePosition";
// import AddDevice from "components/AddDevice";
// import UpdateDevice from "components/UpdateDevice";
import { selectTreeNode, toggleTreeNode } from "actions/Tree";
import { buildingListRequest, buildingAddRequest } from "actions/Building";
import { positionListRequest, positionAddRequest } from "actions/Position";
import { setShowModal } from "actions/Setting";

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
    // showModal: false,
    // modalMode: "addBuilding",
    modalMode: "updateBuilding",
    selectedNodeId: "",
    // selectedNodeId: "31-25"
    selectedNode: {},
    deviceList: [],
    expandedNodes: []
  };
  componentDidMount() {
    this.props.buildingListRequest({
      id: "" + this.props.authUser.buildingList
    });
    this.props.positionListRequest({
      id: "" + this.props.authUser.positionList
    });
    const selectedNode = JSON.parse(localStorage.getItem("selectedNode"));
    if (selectedNode) {
      this.nodeClick(selectedNode);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 건물 추가/삭제시 건물데이터 요청
    if (this.props.authUser.buildingList != prevProps.authUser.buildingList) {
      this.props.buildingListRequest({
        id: this.props.authUser.buildingList
      });
    }

    // 층 추가/삭제시 층데이터 요청
    if (this.props.authUser.positionList != this.props.authUser.positionList) {
      this.props.positionListRequest({
        id: this.props.authUser.positionList
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    let arrayNodes = JSON.parse(localStorage.getItem("expandedNodes"));
    if (arrayNodes && props.buildingList) {
      const expandedObjects = props.buildingList.filter(building => {
        return arrayNodes.indexOf(building.id) > -1;
      });
      const expandedNodes = expandedObjects.map(building => building.id);
      return {
        expandedNodes
      };
    }
  }

  openModal = modalMode => e => {
    this.setState({ modalMode });
    this.props.setShowModal(true);
  };

  closeModal = () => {
    this.props.setShowModal(false);
  };
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
    this.props.selectTreeNode(item);
    localStorage.setItem("selectedNode", JSON.stringify(item));
  };
  // handleExpand = (id, e) => {
  //   e.stopPropagation();
  //   console.log("TODO: toggle show/hide", this.props.expandedNodes, id, e);
  //   let array = [...this.props.expandedNodes];
  //   const index = array.indexOf(id);
  //   index === -1 ? array.push(id) : array.splice(index, 1);
  //   this.props.toggleTreeNode(array);
  // };

  // isExpanded = id => {
  //   let array = [...this.props.expandedNodes];
  //   const index = array.indexOf(id);
  //   if (index === -1) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };

  handleExpand = (id, e) => {
    e.stopPropagation();
    console.log("TODO: toggle show/hide", this.state.expandedNodes, id, e);
    let array = [...this.state.expandedNodes];
    const index = array.indexOf(id);
    index === -1 ? array.push(id) : array.splice(index, 1);
    this.setState({ expandedNodes: array });
    localStorage.setItem("expandedNodes", JSON.stringify(array));
  };

  isExpanded = id => {
    let array = [...this.state.expandedNodes];
    const index = array.indexOf(id);
    if (index === -1) {
      return false;
    } else {
      return true;
    }
  };

  render() {
    // 중요 : Spread Operator는 Sharrow Copy만 하므로 JSON.stringify로 Deep Clone 해야 합니다.
    // let buildingPositionList = [...this.props.buildingList];

    const steps = JSON.parse(localStorage.getItem("steps"));

    let buildingPositionList = null;
    if (steps) {
      buildingPositionList = this.props.buildingList.filter(building => {
        return steps.prevBuildingList.indexOf("" + building.id) === -1;
      });
    } else {
      // filterOutList = this.props.buildingList;
      buildingPositionList = JSON.parse(
        JSON.stringify(this.props.buildingList)
      );
    }

    buildingPositionList.map(building => {
      let positions = this.props.positionList.filter(
        position => position.buildingID == building.id
      );
      if (positions.length) {
        positions = positions.map(position => {
          position.buildingName = building.name;
          return position;
        });

        building.positions = positions;
      }
    });

    return (
      <div>
        {/* <div>{JSON.stringify(this.props.buildingList)}</div>
        <hr />
        <div>{JSON.stringify(this.props.buildingList2)}</div> */}
        {/* <div>{JSON.stringify(this.props.expandedNodes)}</div> */}
        <div className="py-2">
          <div className="clearfix">
            {!this.props.hideButton && (
              <div className="float-right">
                <button
                  className="btn btn-primary"
                  style={{ marginLeft: "2px" }}
                  onClick={this.openModal("addBuilding")}
                >
                  건물등록
                </button>
                <button
                  className="btn btn-primary"
                  style={{ marginLeft: "2px" }}
                  onClick={this.openModal("addPosition")}
                  disabled={
                    this.props.selectedNode.buildingID ||
                    !this.props.selectedNode.id
                  }
                >
                  위치등록
                </button>
                {this.props.selectedNode.buildingID && (
                  <button
                    className="btn btn-primary"
                    style={{ marginLeft: "2px" }}
                    onClick={this.openModal("updatePosition")}
                  >
                    수정
                  </button>
                )}
                {this.props.selectedNode.id &&
                  !this.props.selectedNode.buildingID && (
                    <button
                      className="btn btn-primary"
                      style={{ marginLeft: "2px" }}
                      onClick={this.openModal("updateBuilding")}
                    >
                      수정
                    </button>
                  )}
              </div>
            )}
          </div>
        </div>

        {buildingPositionList.map(item => (
          <div key={item.id}>
            <div
              style={{
                cursor: "pointer",
                padding: "2px 10px",
                marginBottom: "2px",
                background:
                  this.props.selectedNode.id === item.id ? "#bae7ff" : ""
              }}
              className="w3-block"
              onClick={e => this.nodeClick(item)}
            >
              {item.positions ? (
                <i
                  className={
                    this.isExpanded(item.id)
                      ? "p-1 fa fa-caret-down"
                      : "p-1 fa fa-caret-right"
                  }
                  aria-hidden="true"
                  style={{
                    cursor: "pointer",
                    width: "16px"
                  }}
                  onClick={this.handleExpand.bind(this, item.id)}
                />
              ) : (
                <span style={{ paddingLeft: "20px" }} />
              )}
              <span> {item.name}</span>
            </div>

            {item.positions && this.isExpanded(item.id) && (
              <div className="">
                <ul className="w3-ul">
                  {item.positions.map(position => (
                    <li
                      key={position.id}
                      style={{
                        cursor: "pointer",
                        padding: "2px 10px 2px 25px",
                        margin: "0 0 2px 10px",
                        background:
                          "" +
                            this.props.selectedNode.buildingID +
                            "-" +
                            this.props.selectedNode.id ===
                          "" + position.buildingID + "-" + position.id
                            ? "#bae7ff"
                            : ""
                      }}
                      className="font-weight-light font-italic w3-border-0 w3-padding-left"
                      onClick={e => this.nodeClick(position)}
                    >
                      {this.props.checkable && (
                        <input
                          type="checkbox"
                          checked={item.isChecked}
                          value={item.id}
                          onClick={e => {
                            e.stopPropagation();
                          }}
                        />
                      )}
                      {position.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        <Modal
          isOpen={this.props.showModal}
          // onRequestClose={this.closeModal}
          contentLabel="측정기 관리 Modal"
          style={customStyles}
          // className="w3-display-container"
        >
          <button
            className="w3-display-topright w3-button w3-white w3-hover-text-white"
            onClick={this.closeModal}
          >
            X
          </button>
          <div className="" style={{ minWidth: "400px" }} />
          {
            {
              addBuilding: <AddBuilding />,
              updateBuilding: <UpdateBuilding />,
              addPosition: <AddPosition />,
              updatePosition: <UpdatePosition />
            }[this.state.modalMode]
          }
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  buildingList: state.building.list,
  positionList: state.position.list,
  selectedNode: state.tree.selectedNode,
  expandedNodes: state.tree.expandedNodes,
  showModal: state.settings.showModal
});

const mapDispatchToProps = {
  buildingAddRequest,
  buildingListRequest,
  positionAddRequest,
  positionListRequest,
  selectTreeNode,
  toggleTreeNode,
  setShowModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuildingPositionTree);
