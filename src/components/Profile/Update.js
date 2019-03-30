import React, { Component } from "react";
import { connect } from "react-redux";
import { userUpdateRequest, userChangePasswordRequest } from "actions/User";
import { setViewMode, setShowModal } from "actions/Setting";
import { publicKeyRequest } from "actions/Auth";
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
      ...this.props.item,
      password: "",
      oldPassword: "123456",
      newPassword: "123",
      newPasswordConfirm: "123"
    },
    showModal: false
  };

  static getDerivedStateFromProps(props, state) {
    console.log(
      "getDerivedStateFromProps",
      props.newPassword,
      props.showModal,
      props,
      state
    );
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
    console.log(this.state);
    if (!this.state.postData.name) {
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
      this.props.userUpdateRequest(
        this.state.postData,
        this.props.authUser,
        this.props.pkey
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
    this.props.publicKeyRequest();
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
              암호
            </div>
            <div className="w3-rest">
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  aria-label="password"
                  aria-describedby="button-addon2"
                  name="password"
                  value={this.state.postData.password}
                  onChange={this.handleChange}
                />
                <div className="input-group-append">
                  <button
                    className="form-control btn btn-primary mb-0"
                    type="button"
                    id="button-addon2"
                    onClick={this.openModal()}
                  >
                    암호변경
                  </button>
                </div>
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
            <div className="w3-rest">
              <input
                className="form-control"
                name="email"
                value={this.state.postData.email}
                type="text"
                placeholder=""
                onChange={this.handleChange}
              />
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
                <option value="master">Master</option>
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

        <Modal
          isOpen={this.props.showModal}
          contentLabel="Modal"
          style={customStyles}
        >
          <button
            className="w3-display-topright w3-button w3-white w3-hover-text-white"
            onClick={this.closeModal}
          >
            X
          </button>
          <div className="" style={{ minWidth: "400px" }} />

          <form className="text-blue w3-margin">
            <h2 className="text-center">암호 변경</h2>
            <div className="w3-row w3-section">
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
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
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
                현재 암호
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="oldPassword"
                  type="password"
                  placeholder=""
                  value={this.state.postData.oldPassword}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section">
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
                새 암호
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="newPassword"
                  type="password"
                  placeholder=""
                  value={this.state.postData.newPassword}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section">
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
                새 암호 확인
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="newPasswordConfirm"
                  type="password"
                  placeholder=""
                  value={this.state.postData.newPasswordConfirm}
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="w3-right">
              <button
                type="button"
                className="btn btn-primary"
                onClick={e => {
                  this.changePassword();
                }}
              >
                OK
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pkey: state.auth.pkey,
  authUser: state.auth.authUser,
  selectedNode: state.tree.selectedNode,
  productList: state.product.list,
  viewMode: state.settings.viewMode,
  item: state.settings.item,
  showModal: state.settings.showModal,
  newPassword: state.user.newPassword
});

const mapDispatchToProps = {
  publicKeyRequest,
  userUpdateRequest,
  setViewMode,
  userChangePasswordRequest,
  setShowModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Update);

// import React, { Component } from "react";
// import { connect } from "react-redux";
// import { userUpdateRequest } from "actions/User";
// // import { productListRequest } from "actions/Product";
// import { publicKeyRequest } from "actions/Auth";
// import Modal from "react-modal";

// class Update extends Component {
//   state = {
//     // postData: {
//     //   loginId: this.props.authUser.loginID,
//     //   name: this.props.authUser.name,
//     //   password: this.props.authUser.Password,
//     //   email: this.props.authUser.email,
//     //   department: this.props.authUser.department,
//     //   phone: this.props.authUser.phone,
//     //   userType: this.props.authUser.userType
//     // }
//     postData: { ...this.props.authUser, password: "" }
//   };
//   update = () => {
//     if (!this.state.postData.name) {
//       alert("사용자이름을 입력하세요");
//     } else if (!this.state.postData.email) {
//       alert("이메일을 입력하세요");
//     } else if (!this.state.postData.department) {
//       alert("부서를 입력하세요");
//     } else if (!this.state.postData.phone) {
//       alert("전화번호를 입력하세요");
//     } else if (!this.state.postData.userType) {
//       alert("사용자권한을 선택하세요");
//     } else {
//       this.setState(
//         {
//           postData: {
//             ...this.state.postData
//           }
//         },
//         () => {
//           this.props.userUpdateRequest(
//             this.state.postData,
//             this.props.authUser
//           );
//         }
//       );
//     }
//   };
//   handleChange = e => {
//     console.log("handleChange", e.target.value);
//     this.setState({
//       postData: {
//         ...this.state.postData,
//         [e.target.name]: e.target.value
//       }
//     });
//   };

//   // componentDidMount() {
//   //   this.props.productListRequest();
//   // }

//   render() {
//     return (
//       <div className="col-6 mx-auto">
//         <form className="text-blue w3-margin">
//           <h2 className="text-center">내 정보 수정</h2>
//           <div className="w3-row w3-section">
//             <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
//               아이디
//             </div>
//             <div className="w3-rest">
//               <div className="form-control" style={{ background: "#eee" }}>
//                 {this.state.postData.loginID}
//                 &nbsp;
//               </div>
//             </div>
//           </div>
//           <div className="w3-row w3-section">
//             <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
//               암호
//             </div>
//             <div className="w3-rest">
//               <input
//                 className="form-control"
//                 name="password"
//                 value={this.state.postData.password}
//                 type="text"
//                 placeholder=""
//                 onChange={this.handleChange}
//               />
//             </div>
//           </div>
//           <div className="w3-row w3-section">
//             <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
//               이름
//             </div>
//             <div className="w3-rest">
//               <input
//                 className="form-control"
//                 name="name"
//                 value={this.state.postData.name}
//                 type="text"
//                 placeholder=""
//                 onChange={this.handleChange}
//               />
//             </div>
//           </div>
//           <div className="w3-row w3-section">
//             <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
//               이메일
//             </div>
//             <div className="w3-rest">
//               <input
//                 className="form-control"
//                 name="email"
//                 value={this.state.postData.email}
//                 type="text"
//                 placeholder=""
//                 onChange={this.handleChange}
//               />
//             </div>
//           </div>
//           <div className="w3-row w3-section">
//             <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
//               소속(부서)
//             </div>
//             <div className="w3-rest">
//               <input
//                 className="form-control"
//                 name="department"
//                 value={this.state.postData.department}
//                 type="text"
//                 placeholder=""
//                 onChange={this.handleChange}
//               />
//             </div>
//           </div>
//           <div className="w3-row w3-section">
//             <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
//               권한
//             </div>
//             <div className="w3-rest">
//               <select
//                 className="form-control"
//                 name="userType"
//                 value={this.state.postData.userType}
//                 onChange={this.handleChange}
//               >
//                 <option value="master">Master</option>
//                 <option value="manager">Manager</option>
//                 <option value="user">User</option>
//                 <option value="monitoring">Monitoring</option>
//               </select>
//             </div>
//           </div>
//           <div className="w3-right">
//             <button
//               type="button"
//               className="btn btn-primary"
//               onClick={e => {
//                 this.update();
//               }}
//             >
//               OK
//             </button>
//           </div>
//         </form>{" "}
//       </div>
//     );
//   }
// }

// const mapStateToProps = state => ({
//   authUser: state.auth.authUser,
//   selectedNode: state.tree.selectedNode,
//   productList: state.product.list,
//   viewMode: state.settings.viewMode,
//   item: state.user.item
// });

// const mapDispatchToProps = {
//   userUpdateRequest
//   // productListRequest
//   // setViewMode
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Update);
