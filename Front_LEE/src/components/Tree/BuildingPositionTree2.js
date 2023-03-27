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
  state = {
    // showModal: false,
    // modalMode: "addBuilding",
    modalMode: "updateBuilding",
    selectedNodeId: "",
    // selectedNodeId: "31-25"
    selectedNode: {},
    deviceList: [],
    expandedNodes: [],
    userPositionList: "",
    positionList : [],
    // buildingList : []
  };
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

  static getDerivedStateFromProps(props, state) {
    let update = {};
    
    let arrayNodes = JSON.parse(localStorage.getItem("expandedNodes"));
    if (arrayNodes && props.buildingList) {
      const expandedObjects = props.buildingList.filter(building => {
        return arrayNodes.indexOf(building.id) > -1;
      });
      const expandedNodes = expandedObjects.map(building => building.id);
      update.expandedNodes = expandedNodes;
    }    

    let userPositionListArr = [];
    let positionList = JSON.parse(JSON.stringify(props.positionList));
    if (props.userPositionList != undefined) {
      if (props.userPositionList) {
        userPositionListArr = props.userPositionList.split(",");
      }
      positionList.map(
        p =>
          (p.checked =
            userPositionListArr.indexOf("" + p.id) > -1 ? true : false)
      );
    };
    positionList.forEach(function(p) {
      const building = props.buildingList.find(x => x.id === p.buildingID)
      if (building) {
        p.buildingName = building.name;
      }
    })
    if (JSON.stringify(positionList) !== JSON.stringify(state.positionListCopy)) {
      update.positionList = positionList;
      update.positionListCopy = positionList;
      // 중요 : checked item을 initialize
      props.positionToggleChecked(positionList);
    }

    return update;
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
      // return true;
    } else {
      return true;
    }
  };

  __toggleChecked = item => {
    this.props.positionToggleChecked(item);
  };

  toggleChecked = item => {

    let positionList = JSON.parse(JSON.stringify(this.state.positionList)); // state를 읽어와야 한다.
    positionList.map(p => {
      if (event.target.value === "" + p.id) {
        p.checked = event.target.checked;
      }
    });

    this.setState({ positionList: positionList },() => {
      this.props.positionToggleChecked(this.state.positionList);
    });
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

    

    return (
      <React.Fragment>
       
        
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
  showModal: state.settings.showModal,
  userPositionList: state.user.userPositionList,
  viewMode: state.settings.viewMode
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
