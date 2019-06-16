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
import {
  positionListRequest,
  positionAddRequest,
  positionToggleChecked
} from "actions/Position";
// import { userListByBuildingIdRequest } from "actions/User";
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
  // state = {
  //   forceUpdate: true,
  //   // showModal: false,
  //   // modalMode: "addBuilding",
  //   modalMode: "updateBuilding",
  //   selectedNodeId: "",
  //   // selectedNodeId: "31-25"
  //   selectedNode: {},
  //   deviceList: [],
  //   expandedNodes: [],
  //   buildingList: this.props.buildingList,
  //   positionList: this.props.positionList,
  //   arrList: [
  //     {"id":386,"name":"a연습1","position":"1","buildingID":476, "checked": true},
  //     {"id":387,"name":"a연습2","position":"1","buildingID":476, "checked": false},
  //     {"id":393,"name":"a연습3","position":"1","buildingID":476, "checked": true},
  //     {"id":399,"name":"a테스트1","position":"1","buildingID":496, "checked": false},
  //     {"id":400,"name":"a테스트2","position":"1","buildingID":496, "checked": false}]
  // };

  constructor(props) {
    super(props);

    this.state = {
      updateCount: 0,
      forceUpdate: true,
      // showModal: false,
      // modalMode: "addBuilding",
      modalMode: "updateBuilding",
      selectedNodeId: "",
      // selectedNodeId: "31-25"
      selectedNode: {},
      deviceList: [],
      expandedNodes: [],
      buildingList: props.buildingList,
      positionList: props.positionList,
      arrList: [
        {
          id: 386,
          name: "a연습1",
          position: "1",
          buildingID: 476,
          checked: true
        },
        {
          id: 387,
          name: "a연습2",
          position: "1",
          buildingID: 476,
          checked: false
        },
        {
          id: 393,
          name: "a연습3",
          position: "1",
          buildingID: 476,
          checked: true
        },
        {
          id: 399,
          name: "a테스트1",
          position: "1",
          buildingID: 496,
          checked: false
        },
        {
          id: 400,
          name: "a테스트2",
          position: "1",
          buildingID: 496,
          checked: false
        }
      ]
    };
  }

  componentDidMount() {
    const steps = JSON.parse(localStorage.getItem("steps"));
    this.props.buildingListRequest({
      // 일괄등록이면, 추가된 buildingList로 호출
      id: steps
        ? this.props.authUser.buildingList.replace(
            steps.prevBuildingList + ",",
            ""
          )
        : "" + this.props.authUser.buildingList,
      showExtraNode:
        this.props.isUserMenu && this.props.authUser.userType === "master"
          ? true
          : false
    });
    this.props.positionListRequest({
      id: "" + this.props.authUser.positionList
    });
    const selectedNode = JSON.parse(localStorage.getItem("selectedNode"));
    if (steps) {
      if (steps.step != 4) {
        this.nodeClick(selectedNode);
      }
    } else {
      this.nodeClick(selectedNode);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("componentDidUpdate");
    // console.log("update", prevProps.buildingList, prevState.buildingList);
    // if (prevProps.buildingList != prevState.buildingList) {
    //   this.setState({})
    // }

    if (!prevState.selectedNode.id && prevProps.buildingList.length) {
      const selectedNode = prevProps.buildingList[0];
      this.setState({ selectedNode }, () => {
        this.nodeClick(selectedNode);
      });
    }

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

  handleCheckboxChange = event => {
    console.log(event.target.value);

    // let positionList = JSON.parse(JSON.stringify(this.state.positionList)) // state를 읽어와야 한다.
    // // let positions = this.props.selectedItem.positionList.split(",");
    // positionList.map(p => {
    //   console.log(p.id, p.checked, event.target.checked);
    //   if (event.target.value === ""+p.id) {
    //     // console.log(p.checked);
    //     // p.checked = (event.target.checked === 'true') ? true : false;

    //     p.checked = event.target.checked;
    //   }
    //   // console.log(p);
    //   // return p;
    // })

    // this.setState({positionList: positionList});

    // const target = event.target;
    // const value = target.type === 'checkbox' ? target.checked : target.value;
    // const name = target.name;

    // this.setState({
    //   [name]: value
    // });
  };

  componentWillReceiveProps(nextProps) {
    // nextProps.selectedItem &&
    //   console.log(
    //     "componentWillReceiveProps",
    //     nextProps.selectedItem.positionList
    //   );

    // if (nextProps.selected !== this.props.selected) {
    //   this.setState({ selected: nextProps.selected });
    //   this.selectNew();
    // }

    if (nextProps.selectedItem && this.props.selectedItem) {
      if (
        JSON.stringify(nextProps.selectedItem.positionList) !==
        JSON.stringify(this.props.selectedItem.positionList)
      ) {
        console.log(
          "componentWillReceiveProps",
          nextProps.selectedItem.positionList
        );
        this.setState({
          positionList: nextProps.selectedItem.positionList
        });
      }
    }
  }

  // static getDerivedStateFromProps(props, state) {
  //   console.log("getDerivedStateFromProps");
  //   return null;
  // }

  static __getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps");
    return null;
    // console.log("state.updateCount", state.updateCount);
    // // if (state.updateCount > 1) {
    // //   return null;
    // // }
    // let update = {};

    // let arrayNodes = JSON.parse(localStorage.getItem("expandedNodes"));
    // if (arrayNodes && props.buildingList) {
    //   const expandedObjects = props.buildingList.filter(building => {
    //     return arrayNodes.indexOf(building.id) > -1;
    //   });
    //   const expandedNodes = expandedObjects.map(building => building.id);
    //   update.expandedNodes = expandedNodes;
    // }

    // if (props.buildingList !== state.buildingList) {
    //   update.buildingList = props.buildingList;
    // }

    // if (props.positionList) {
    //   let positionList;
    //   if (props.selectedItem && props.selectedItem.positionList) {
    //     console.log("333333", props.selectedItem.positionList);
    //     positionList = JSON.parse(JSON.stringify(props.positionList));
    //     let positions = props.selectedItem.positionList.split(",");
    //     positionList.map(p => {
    //       if (positions.indexOf("" + p.id) > -1) {
    //         p.checked = true;
    //         return p;
    //       } else {
    //         p.checked = false;
    //         return p;
    //       }
    //     });
    //     update.updateCount = state.updateCount + 1;
    //     update.positionList = positionList;
    //   } else {
    //     update.positionList = props.positionList;
    //   }
    // }

    // return update;
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

  handleExpand = (id, e) => {
    e.stopPropagation();
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

  toggleChecked = item => {
    this.props.positionToggleChecked(item);
  };

  // handleCheckboxChange =
  __handleCheckboxChange = event => {
    console.log(event.target.value);

    // let positionList = JSON.parse(JSON.stringify(this.state.positionList)) // state를 읽어와야 한다.
    // // let positions = this.props.selectedItem.positionList.split(",");
    // positionList.map(p => {
    //   console.log(p.id, p.checked, event.target.checked);
    //   if (event.target.value === ""+p.id) {
    //     // console.log(p.checked);
    //     // p.checked = (event.target.checked === 'true') ? true : false;

    //     p.checked = event.target.checked;
    //   }
    //   // console.log(p);
    //   // return p;
    // })

    // this.setState({positionList: positionList});

    // const target = event.target;
    // const value = target.type === 'checkbox' ? target.checked : target.value;
    // const name = target.name;

    // this.setState({
    //   [name]: value
    // });
  };

  handleCheckboxChangeArr = event => {
    console.log(event.target.value);
    let arrList = JSON.parse(JSON.stringify(this.state.arrList));
    arrList.map(p => {
      // console.log(p.id, p.checked, event.target.checked);
      if (event.target.value === "" + p.id) {
        p.checked = event.target.checked;
      }
    });

    this.setState({ arrList: arrList });
    // this.setState({ arrList: [] });
  };

  render() {
    // 중요 : Spread Operator는 Sharrow Copy만 하므로 JSON.stringify로 Deep Clone 해야 합니다.
    // let buildingPositionList = [...this.props.buildingList];

    const steps = JSON.parse(localStorage.getItem("steps"));

    let buildingPositionList = null;
    if (steps) {
      buildingPositionList = this.state.buildingList.filter(building => {
        return steps.prevBuildingList.indexOf("" + building.id) === -1;
      });
    } else {
      // filterOutList = this.state.buildingList;
      buildingPositionList = JSON.parse(
        JSON.stringify(this.state.buildingList)
      );
    }

    buildingPositionList.map(building => {
      let positions = this.state.positionList.filter(
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
    // console.log("buildingPositionList", buildingPositionList);
    // this.state.selectedItem && console.log("this.state.selectedItem.positionList", this.state.selectedItem.positionList)

    return (
      <React.Fragment>
        <div className="flex-shrink-0 pt-2">
          version{React.version}
          {/* <div>this.state.buildingList { JSON.stringify(this.state.buildingList) }</div>
          <div>this.state.positionList { JSON.stringify(this.state.positionList) }</div> */}
          {this.state.arrList.map(position => (
            <div key={position.id}>
              <input
                type="checkbox"
                value={position.id}
                checked={position.checked}
                onChange={this.handleCheckboxChangeArr}
              />
              {position.name}
            </div>
          ))}
          <div className="clearfix">
            {!this.props.hideButton && (
              <div className="float-right">
                {this.props.authUser.userType === "master" && (
                  <button
                    className="btn btn-primary"
                    style={{ marginLeft: "2px" }}
                    onClick={this.openModal("addBuilding")}
                  >
                    건물등록
                  </button>
                )}

                <button
                  className="btn btn-primary"
                  style={{ marginLeft: "2px" }}
                  onClick={this.openModal("addPosition")}
                  disabled={
                    (this.props.selectedNode &&
                      this.props.selectedNode.buildingID) ||
                    (this.props.selectedNode && !this.props.selectedNode.id) ||
                    (this.props.selectedNode &&
                      this.props.selectedNode.id === "null")
                  }
                >
                  위치등록
                </button>
                {this.props.selectedNode && this.props.selectedNode.buildingID && (
                  <button
                    className="btn btn-primary"
                    style={{ marginLeft: "2px" }}
                    onClick={this.openModal("updatePosition")}
                  >
                    수정
                  </button>
                )}
                {this.props.selectedNode &&
                  this.props.selectedNode.id &&
                  !this.props.selectedNode.buildingID && (
                    <button
                      className="btn btn-primary"
                      style={{ marginLeft: "2px" }}
                      onClick={this.openModal("updateBuilding")}
                      disabled={
                        this.props.selectedNode &&
                        this.props.selectedNode.id === "null"
                      }
                    >
                      수정
                    </button>
                  )}
              </div>
            )}
          </div>
        </div>
        <div className="flex-fill overflow-auto">
          {buildingPositionList.map(item => (
            <div key={item.id}>
              <div
                style={{
                  cursor: "pointer",
                  padding: "2px 10px",
                  marginBottom: "2px",
                  background:
                    this.props.selectedNode &&
                    !this.props.selectedNode.buildingID &&
                    this.props.selectedNode.id === item.id
                      ? "#bae7ff"
                      : ""
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
                            this.props.selectedNode &&
                            this.props.selectedNode.buildingID &&
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
                          // <input type="checkbox" value={position.id} defaultChecked={position.checked} onChange={this.handleCheckboxChange}/>
                          <input
                            type="checkbox"
                            value={position.id}
                            defaultChecked={position.checked}
                            onChange={this.handleCheckboxChange}
                          />
                          // <input type="checkbox" checked={position.checked} />
                          // <input
                          //   type="checkbox"
                          //   checked={position.isChecked}
                          //   value={position.id}
                          //   defaultChecked={
                          //     this.props.selectedItem &&
                          //     this.props.selectedItem.positionList.indexOf(
                          //       "" + position.id
                          //     ) > -1
                          //       ? true
                          //       : false
                          //   }
                          //   onClick={e => {
                          //     e.stopPropagation();
                          //     this.toggleChecked(position);
                          //   }}
                          // />
                        )}
                        {position.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>

          <Modal
            isOpen={this.props.showModal}
            contentLabel="측정기 관리 Modal"
            style={customStyles}
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  buildingList: state.building.list,
  positionList: state.position.list,
  selectedNode: state.tree.selectedNode,
  expandedNodes: state.tree.expandedNodes,
  selectedItem: state.settings.selectedItem,
  showModal: state.settings.showModal
});

const mapDispatchToProps = {
  buildingAddRequest,
  buildingListRequest,
  positionAddRequest,
  positionListRequest,
  positionToggleChecked,
  selectTreeNode,
  toggleTreeNode,
  setShowModal
  // userListByBuildingIdRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuildingPositionTree);
