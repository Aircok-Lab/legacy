import React, { Component } from "react";
import { connect } from "react-redux";
import { userProfileRequest, userChangePasswordRequest } from "actions/User";
import { setViewMode, setShowModal } from "actions/Setting";
import { publicKeyRequest } from "actions/Auth";
import Modal from "react-modal";
import forge from "node-forge";

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
      ...this.props.authUser,
      plainTextPassword: "",
      password: "",
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: ""
    },
    showModal: false
  };

  static getDerivedStateFromProps(props, state) {
    if (props.newPassword) {
      return {
        postData: { ...state.postData, plainTextPassword: props.newPassword }
      };
    }
    return null;
  }

  openModal = param => e => {
    this.setState({
      postData: {
        ...this.state.postData,
        oldPassword: "",
        newPassword: "",
        newPasswordConfirm: ""
      }
    });
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
    if (!this.state.postData.name) {
      alert("사용자이름을 입력하세요");
    } else if (!this.state.postData.plainTextPassword) {
      alert("암호를 입력하세요");
    } else if (!this.state.postData.email) {
      alert("이메일을 입력하세요");
    } else if (!this.state.postData.department) {
      alert("부서를 입력하세요");
    } else if (!this.state.postData.phone) {
      alert("전화번호를 입력하세요");
    } else if (!this.state.postData.userType) {
      alert("사용자권한을 선택하세요");
    } else {
      let publicKey = forge.pki.publicKeyFromPem(
        forge.util.encodeUtf8(this.props.pkey)
      );
      let password = forge.util.encode64(
        publicKey.encrypt(
          forge.util.encodeUtf8(this.state.postData.plainTextPassword),
          "RSA-OAEP"
        )
      );
      this.setState(
        {
          postData: {
            ...this.state.postData,
            password
          }
        },
        () => {
          this.props.userProfileRequest(
            this.state.postData,
            this.props.authUser,
            this.props.pkey
          );
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
    this.props.publicKeyRequest();
  }

  render() {
    return (
      <div className="">
        <form className="text-blue w3-margin">
          <h2 className="text-center">프로파일 수정</h2>
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
                  name="plainTextPassword"
                  value={this.state.postData.plainTextPassword}
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
              전화
            </div>
            <div className="w3-rest">
              <input
                className="form-control"
                name="phone"
                value={this.state.postData.phone}
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
          <div className="w3-right">
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
  showModal: state.settings.showModal,
  newPassword: state.user.newPassword
});

const mapDispatchToProps = {
  publicKeyRequest,
  userProfileRequest,
  setViewMode,
  userChangePasswordRequest,
  setShowModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Update);
