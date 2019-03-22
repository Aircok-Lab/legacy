import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import AddBuilding from "components/Tree/AddBuilding";
import UpdateBuilding from "components/Tree/UpdateBuilding";
import AddPosition from "components/Tree/AddPosition";
import UpdatePosition from "components/Tree/UpdatePosition";
// import AddDevice from "components/AddDevice";
// import UpdateDevice from "components/UpdateDevice";
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
    console.log("auth", this.props.authUser);
    this.props.buildingListRequest({
      id: "" + this.props.authUser.buildingList
    });
    this.props.positionListRequest({
      id: "" + this.props.authUser.positionList
    });
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
  openModal = param => e => {
    let modalMode = param;
    this.setState({ showModal: true, modalMode });
  };

  closeModal = () => {
    this.setState({ showModal: false });
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
    console.log("item", item);
    this.props.selectTreeNode(item);
  };

  render() {
    let buildingPositionList = [...this.props.buildingList];
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
        <div className="pb-1">
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
                marginBottom: "2px"
              }}
              className={
                "w3-block w3-border " +
                (this.props.selectedNode.id === item.id ? "w3-blue" : "")
              }
              onClick={e => this.nodeClick(item)}
            >
              <i
                className="fa fa-caret-right p-1"
                aria-hidden="true"
                style={{
                  cursor: "pointer"
                }}
                onClick={e => {
                  e.stopPropagation();
                  console.log("TODO: toggle show/hide");
                }}
              />
              <span> {item.name}</span>
            </div>

            <div className="">
              <ul className="w3-ul">
                {item.positions &&
                  item.positions.map(position => (
                    <li
                      key={position.id}
                      style={{
                        cursor: "pointer",
                        padding: "2px 10px 2px 25px",
                        marginBottom: "2px"
                      }}
                      className={
                        "w3-border-0 w3-padding-left " +
                        ("" +
                          this.props.selectedNode.buildingID +
                          "-" +
                          this.props.selectedNode.id ===
                        "" + position.buildingID + "-" + position.id
                          ? "w3-blue"
                          : "")
                      }
                      onClick={e => this.nodeClick(position)}
                    >
                      {this.props.checkable && (
                        <input
                          className="w3-check"
                          type="checkbox"
                          checked={item.isChecked}
                          value={item.id}
                          onClick={e => {
                            e.stopPropagation();
                          }}
                          onChange={e => {
                            console.log(
                              "checkbox onChange ...",
                              e.target.checked
                            );
                          }}
                        />
                      )}
                      {position.name}
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
          <button
            className="w3-display-topright w3-button w3-white w3-hover-text-white"
            onClick={this.closeModal}
          >
            X
          </button>
          <div className="" style={{ minWidth: "400px" }} />
          {
            {
              addBuilding: (
                <AddBuilding
                  // node={this.props.selectedNode}
                  closeModal={this.closeModal}
                />
              ),
              updateBuilding: (
                <UpdateBuilding
                  // node={this.props.selectedNode}
                  closeModal={this.closeModal}
                />
              ),
              addPosition: (
                <AddPosition
                  // node={this.props.selectedNode}
                  closeModal={this.closeModal}
                />
              ),
              updatePosition: (
                <UpdatePosition
                  // node={this.props.selectedNode}
                  closeModal={this.closeModal}
                />
              )
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
  selectedNode: state.tree.selectedNode
});

const mapDispatchToProps = {
  buildingAddRequest: buildingAddRequest,
  buildingListRequest: buildingListRequest,
  positionAddRequest: positionAddRequest,
  positionListRequest: positionListRequest,
  selectTreeNode: selectTreeNode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuildingPositionTree);
