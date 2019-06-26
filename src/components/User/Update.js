import React, { Component } from "react";
import { connect } from "react-redux";
import {
  userUpdateRequest,
  userChangePasswordRequest,
  userInfoRequest
} from "actions/User";
import { setViewMode, setShowModal } from "actions/Setting";
import { publicKeyRequest } from "actions/Auth";
import { positionClearChecked, positionToggleChecked } from "actions/Position";
import Modal from "react-modal";

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

class Update extends Component {
  state = {
    postData: {
      ...this.props.selectedItem,
      password: "",
      oldPassword: "123456",
      newPassword: "123",
      newPasswordConfirm: "123"
    },
    showModal: false
  };

  static getDerivedStateFromProps(props, state) {
    if (props.newPassword) {
      return { postData: { ...state.postData, password: props.newPassword } };
    }
    return null;
  }

  openModal = param => e => {
    this.props.setShowModal(true);
  };

  closeModal = () => {
    this.props.setShowModal(false);
  };

  changePassword = () => {
    const data = {
      id: this.state.postData.id,
      oldPassword: this.state.postData.oldPassword,
      newPassword: this.state.postData.newPassword,
      pkey: this.props.pkey
    };
    this.props.userChangePasswordRequest(data);
  };

  update = () => {
    const buildingListArray = this.props.buildingList.map(b => b.id);// [499, "null"]
    const checked = this.props.checked.filter(p => buildingListArray.indexOf(p.buildingID) > -1 && p.checked);
    let arr = checked.map(position => position.buildingID);
    const bildingIds = arr.filter(
      (value, idx, arr) => arr.indexOf(value) === idx
    ); 
    let positionIds = checked.map(position => position.id);
    const buildingList = bildingIds.join();
    const positionList = positionIds.join();

    if (!this.props.checked.length) {
      alert("위치를 선택하세요");
    } else if (!this.state.postData.name) {
      alert("사용자이름을 입력하세요");
    } else if (!this.state.postData.email) {
      alert("이메일을 입력하세요");
    } else if (!this.state.postData.department) {
      alert("부서를 입력하세요");
    } else if (!this.state.postData.phone) {
      alert("전화번호를 입력하세요");
    } else if (!this.state.postData.userType) {
      alert("사용자권한을 선택하세요");
    } else {
      // 변경된 포지션을 저장
      this.setState(
        {
          postData: {
            ...this.state.postData,
            buildingList,
            positionList
          }
        },
        () => {
          //포지션 저장완료 후, 서버에 데이터 전송
          // console.log(this.state.postData);
          this.props.userUpdateRequest(this.state.postData);
        }
      );
    }
  };

  handleChange = e => {
    this.setState({
      postData: {
        ...this.state.postData,
        [e.target.name]: e.target.value
      }
    });
  };

  componentDidMount() {
    //console.log("this.props.selectedItem .....", this.props.selectedItem.id)
    // userId로 호출
    const userId = this.props.selectedItem.id;
    this.props.userInfoRequest(userId);

    this.props.publicKeyRequest();
    // this.props.positionClearChecked();
    // this.props.positionList.map(p => {
    //   if (this.state.postData.positionList.indexOf("" + p.id) > -1) {
    //     this.props.positionToggleChecked(p);
    //   }
    // });
  }

  render() {
    return (
      <div className="">
        <form className="text-blue w3-margin">
          <h2 className="text-center">사용자 수정</h2>

          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              아이디
            </div>
            <div className="w3-rest">
              <div className="form-control" style={{ background: "#eee" }}>
                {this.state.postData.loginID}
                &nbsp;
              </div>
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              이름
            </div>
            <div className="w3-rest">
              <input
                className="form-control"
                name="name"
                value={this.state.postData.name}
                type="text"
                placeholder=""
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              이메일
            </div>
            {/* <div className="w3-rest">
              <input
                className="form-control"
                name="email"
                value={this.state.postData.email}
                type="text"
                placeholder=""
                onChange={this.handleChange}
              />
            </div> */}
            <div className="w3-rest">
              <div className="form-control" style={{ background: "#eee" }}>
                {this.state.postData.email}
              </div>
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              소속(부서)
            </div>
            <div className="w3-rest">
              <input
                className="form-control"
                name="department"
                value={this.state.postData.department}
                type="text"
                placeholder=""
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              권한
            </div>
            <div className="w3-rest">
              <select
                className="form-control"
                name="userType"
                value={this.state.postData.userType}
                onChange={this.handleChange}
              >
                {this.props.authUser.userType === "master" && (
                  <option value="master">Master</option>
                )}
                <option value="manager">Manager</option>
                <option value="user">User</option>
                <option value="monitoring">Monitoring</option>
              </select>
            </div>
          </div>
          <div className="w3-right">
            <button
              type="button"
              className="btn btn-primary"
              onClick={e => {
                this.props.setViewMode("list");
              }}
            >
              List
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={e => {
                this.update();
              }}
            >
              OK
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pkey: state.auth.pkey,
  authUser: state.auth.authUser,
  selectedNode: state.tree.selectedNode,
  productList: state.product.list,

  checked: state.position.checked,
  positionList: state.position.list,
  buildingList: state.building.list,
  viewMode: state.settings.viewMode,
  selectedItem: state.settings.selectedItem,
  showModal: state.settings.showModal,
  newPassword: state.user.newPassword
});

const mapDispatchToProps = {
  publicKeyRequest,
  userUpdateRequest,
  userInfoRequest,
  setViewMode,
  userChangePasswordRequest,
  setShowModal,
  positionClearChecked,
  positionToggleChecked
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Update);
