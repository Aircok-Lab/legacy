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

class DeviceModalContainer extends Component {
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
          {/* <i className="fas fa-times-circle" /> */}
          <div className="" style={{ minWidth: "400px" }} />
          {
            {
              addDevice: <Add closeModal={this.props.closeModal} />,
              updateDevice: <div node={this.state.selectedNode} />,
              deleteConfirmDevice: (
                <Delete
                  closeModal={this.props.closeModal}
                  deviceList={this.props.deviceList}
                />
              )
            }[this.props.modalMode]
          }
        </Modal>
      </div>
    );
  }
}

export default DeviceModalContainer;
