import React, { Component } from "react";
import { connect } from "react-redux";
import { deviceAddRequest } from "actions/Device";
import { productListRequest } from "actions/Product";
import { setViewMode } from "actions/Setting";
import setInitValue from "../../util/setInitValue";

class Add extends Component {
  state = {
    postData: {
      name: setInitValue("" + new Date().getTime()),
      serialNumber: setInitValue("" + new Date().getTime()),
      positionID: this.props.selectedNode ? this.props.selectedNode.id : "",
      productID: 1,
      reportType: 1,
      imei: setInitValue("" + new Date().getTime()),
      networkType: "cellular", // cellular | ethernet
      phone: setInitValue("" + new Date().getTime()),
      ip: "",
      gateway: "",
      subnet: ""
    }
  };
  add = () => {
    const positionId = this.props.selectedNode.buildingID
      ? this.props.selectedNode.id
      : "";
    if (!positionId) {
      alert("건물목록에서 위치를 선택하세요");
    } else if (!this.state.postData.name) {
      alert("측정기명을 입력하세요");
    } else if (!this.state.postData.serialNumber) {
      alert("S/N을 입력하세요");
    } else if (!this.state.postData.productID) {
      alert("제품군을 선택하세요");
    } else if (
      this.state.postData.networkType === "cellular" &&
      !this.state.postData.phone
    ) {
      alert("개통번호를 입력하세요");
    } else if (
      this.state.postData.networkType === "cellular" &&
      !this.state.postData.imei
    ) {
      alert("IMEI 번호를 입력하세요");
    } else if (
      this.state.postData.networkType === "ethernet" &&
      !this.state.postData.ip
    ) {
      alert("IP address를 입력하세요");
    } else if (
      this.state.postData.networkType === "ethernet" &&
      !this.state.postData.subnet
    ) {
      alert("Subnet mask를 입력하세요");
    } else if (
      this.state.postData.networkType === "ethernet" &&
      !this.state.postData.gateway
    ) {
      alert("Gateway를 입력하세요");
    } else {
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
          this.props.deviceAddRequest(this.state.postData);
        }
      );
    }
  };
  handleChange = e => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
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
      <form className="text-blue w3-margin">
        <h2 className="text-center">측정기 등록</h2>
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
            보고서
          </div>
          <div className="w3-rest">
            <select
              className="form-control"
              name="reportType"
              value={this.state.postData.reportType}
              onChange={this.handleChange}
            >
              <option value="1">1주</option>
              <option value="2">1달</option>
              <option value="3">프리미엄</option>
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
            &nbsp;
          </div>
          <div className="w3-rest pl-1">
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  name="networkType"
                  value="cellular"
                  checked={this.state.postData.networkType === "cellular"}
                  onChange={this.handleChange}
                />
                LTE
              </label>
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  name="networkType"
                  value="ethernet"
                  checked={this.state.postData.networkType === "ethernet"}
                  onChange={this.handleChange}
                />
                Ethernet
              </label>
            </div>
          </div>
        </div>
        {this.state.postData.networkType === "cellular" && (
          <React.Fragment>
            <div className="w3-row w3-section">
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
                개통 번호
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
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
                IMEI 번호
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="imei"
                  value={this.state.postData.imei}
                  type="text"
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </React.Fragment>
        )}

        {this.state.postData.networkType === "ethernet" && (
          <React.Fragment>
            <div className="w3-row w3-section">
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
                IP address
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="ip"
                  value={this.state.postData.ip}
                  type="text"
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section">
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
                Subnet mask
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="subnet"
                  value={this.state.postData.subnet}
                  type="text"
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section">
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
                Gateway
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="gateway"
                  value={this.state.postData.gateway}
                  type="text"
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </React.Fragment>
        )}
        <div className="clearfix">
          <div className="float-right">
            {!this.props.hideButton && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={e => {
                  this.props.setViewMode("list");
                }}
              >
                List
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={e => {
                this.add();
              }}
            >
              OK
            </button>
          </div>
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  selectedNode: state.tree.selectedNode,
  productList: state.product.list,
  viewMode: state.settings.viewMode
});

const mapDispatchToProps = {
  deviceAddRequest,
  productListRequest,
  setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Add);
