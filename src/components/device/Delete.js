import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import { deviceDeleteRequest } from "actions/Device";
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

class Delete extends Component {
  // state={
  //   showModal: false
  // }
  render() {
    return (
      <Modal
        isOpen={this.props.showModal}
        // onRequestClose={this.closeModal}
        contentLabel="측정기 관리 Modal"
        style={customStyles}
        // className="w3-display-container"
      >
        <div>
          선택항목을 삭제하시겠습니까?
          <br />
          <div className="w3-right">
            <button
              type="button"
              className="w3-button w3-blue w3-padding"
              onClick={() => {
                const selectedDevices = this.props.deviceList.filter(
                  device => device.isChecked
                );
                const ids = selectedDevices.map(
                  ({ SerialNumber }) => SerialNumber
                );
                this.props.deviceDeleteRequest({
                  node: this.props.selectedNode,
                  ids: ids.join()
                });
                this.props.closeModal();
              }}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  selectedNode: state.tree.selectedNode
});

const mapDispatchToProps = {
  deviceDeleteRequest: deviceDeleteRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Delete);
