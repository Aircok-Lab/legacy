import React, { Component } from "react";
import Modal from "react-modal";
import Add from "./Add";
import Delete from "./Delete";

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

class UserModalContainer extends Component {
  state = {
    // showModal: false,
    // modalMode: "updateBuilding",
    // userList: []
  };

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.showModal}
          // onRequestClose={this.closeModal}
          contentLabel="측정기 관리 Modal"
          style={customStyles}
          // className="w3-display-container"
        >
          <button
            className="w3-display-topright w3-button w3-white w3-hover-text-white"
            onClick={this.props.closeModal}
          >
            X
          </button>
          <div className="" style={{ minWidth: "400px" }} />
          {
            {
              addUser: <Add closeModal={this.props.closeModal} />,
              updateUser: <div node={this.state.selectedNode} />,
              deleteConfirmUser: (
                <Delete
                  closeModal={this.props.closeModal}
                  userList={this.props.userList}
                />
              )
            }[this.props.modalMode]
          }
        </Modal>
      </div>
    );
  }
}

export default UserModalContainer;
