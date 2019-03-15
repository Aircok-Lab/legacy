import React, { Component } from "react";
import { connect } from "react-redux";
import { deviceAddRequest } from "actions/Device";
import { productListRequest } from "actions/Product";
import { setViewMode } from "actions/Setting";

class Add extends Component {
  state = {
    postData: {
      name: "" + new Date().getTime(),
      serialNumber: "" + new Date().getTime(),
      // serialNumber: "",
      phone: "010-555-5555",
      positionID: this.props.selectedNode.id,
      productID: 1
      // name: "",
      // serialNumber: "",
      // phone: "",
      // productID: "",
      // positionID: ""
    }
  };
  add = () => {
    const positionId = this.props.selectedNode.BuildingID
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
          <h2 className="text-center">측정기 등록</h2>
          <div className="w3-row w3-section">
            <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
              건물명
            </div>
            <div className="w3-rest">
              <div className="form-control" style={{ background: "#eee" }}>
                {this.props.selectedNode.BuildingID
                  ? this.props.selectedNode.BuildingName
                  : this.props.selectedNode.Name}{" "}
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
                {this.props.selectedNode.BuildingID
                  ? this.props.selectedNode.Name
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
                    {product.Name}
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
                this.add();
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
