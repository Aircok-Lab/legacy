import React, { Component } from "react";
import { connect } from "react-redux";
import { deviceUpdateRequest } from "actions/Device";
import { productListRequest } from "actions/Product";
import { setViewMode } from "actions/Setting";

class Update extends Component {
  state = {
    oldPositionId: this.props.item.positionID,
    postData: {
      name: this.props.item.name,
      serialNumber: this.props.item.serialNumber,
      positionID: "" + this.props.item.positionID,
      productID: "" + this.props.item.productID,
      imei: this.props.item.imei,
      networkType: this.props.item.networkType, // cellular | ethernet
      phone: this.props.item.phone,
      ip: this.props.item.ip,
      gateway: this.props.item.gateway,
      subnet: this.props.item.subnet
    }
  };
  update = () => {
    const positionId = this.props.selectedNode.buildingID
      ? this.props.selectedNode.id
      : "";
    if (!positionId) {
      alert("위치를 선택하세요");
    } else if (!this.state.postData.name) {
      alert("측정기명을 입력하세요");
    } else if (!this.state.postData.serialNumber) {
      alert("S/N을 입력하세요");
    } else if (!this.state.postData.phone) {
      alert("전화번호를 입력하세요");
    } else if (!this.state.postData.productID) {
      alert("제품군을 선택하세요");
    } else {
      let goAhed = true;
      if (positionId != this.state.postData.positionID) {
        if (!confirm("위치가 변경되었습니다. 이동하시겠습니까?")) {
          goAhed = false;
        }
      }

      if (goAhed) {
        // 변경된 포지션을 저장
        this.setState(
          {
            postData: {
              ...this.state.postData,
              positionID: positionId
            }
          },
          () => {
            //포지션 저장완료 후, 서버에 데이터 전송
            this.props.deviceUpdateRequest(this.state.postData);
          }
        );
      }
    }
  };
  handleChange = e => {
    console.log("handleChange", e.target.value);
    this.setState({
      postData: {
        ...this.state.postData,
        [e.target.name]: e.target.value
      }
    });
  };

  componentDidMount() {
    this.props.productListRequest();
  }

  render() {
    return (
      <div className="col-6 mx-auto">
        <form className="text-blue w3-margin">
          {/* {JSON.stringify(this.props.item)} */}
          <h2 className="text-center">측정기 수정</h2>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              건물명
            </div>
            <div className="w3-rest">
              <div className="form-control" style={{ background: "#eee" }}>
                {this.props.selectedNode.buildingID
                  ? this.props.selectedNode.buildingName
                  : this.props.selectedNode.name}{" "}
                &nbsp;
              </div>
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              위치
            </div>
            <div className="w3-rest">
              <div className="form-control" style={{ background: "#eee" }}>
                {this.props.selectedNode.buildingID
                  ? this.props.selectedNode.name
                  : ""}{" "}
                &nbsp;
              </div>
              {/* <input
                className="form-control"
                style={{ background: "#eee" }}
                type="text"
                disabled
                value={
                  this.props.selectedNode.buildingID
                    ? this.props.selectedNode.name
                    : ""
                }
              /> */}
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              측정기명
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
              제품군
            </div>
            <div className="w3-rest">
              <select
                className="form-control"
                name="productID"
                value={this.state.postData.productID}
                onChange={this.handleChange}
              >
                <option value="" />
                {this.props.productList.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              S/N
            </div>
            <div className="w3-rest">
              <input
                className="form-control"
                name="serialNumber"
                value={this.state.postData.serialNumber}
                type="text"
                placeholder=""
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              전화 번호
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
                // this.props.setViewMode("list");
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
  authUser: state.auth.authUser,
  selectedNode: state.tree.selectedNode,
  productList: state.product.list,
  viewMode: state.settings.viewMode,
  item: state.settings.item
});

const mapDispatchToProps = {
  deviceUpdateRequest,
  productListRequest,
  setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Update);
