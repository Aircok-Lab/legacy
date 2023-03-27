import React, { Component } from "react";
import { connect } from "react-redux";
import { deviceUpdateRequest } from "actions/Device";
import { productListRequest } from "actions/Product";
import { setViewMode } from "actions/Setting";

class Update extends Component {
  state = {
    oldPositionId: this.props.selectedItem.positionID,
    postData: {
      name: this.props.selectedItem.name,
      serialNumber: this.props.selectedItem.serialNumber,
      positionID: "" + this.props.selectedItem.positionID,
      productID: "" + this.props.selectedItem.productID,
      reportType: "" + this.props.selectedItem.reportType,
      imei: this.props.selectedItem.imei,
      networkType: this.props.selectedItem.networkType, // cellular | ethernet
      phone: this.props.selectedItem.phone || "",
      ip: this.props.selectedItem.ip || "",
      gateway: this.props.selectedItem.gateway || "",
      subnet: this.props.selectedItem.subnet || "",
      send_period: this.props.selectedItem.send_period || "",
      upload_url:this.props.selectedItem.upload_url || "",
      fota_url:this.props.selectedItem.fota_url || "",
      dns:this.props.selectedItem.dns || "",
      dhcp:this.props.selectedItem.dhcp || "",
      reset_info:this.props.selectedItem.reset_info || "",

      version:this.props.selectedItem.version || "",
      firmware:this.props.selectedItem.firmware || "",
      checksum:this.props.selectedItem.checksum || "",
      upload_ip:this.props.selectedItem.upload_ip || "",
      fota_ip:this.props.selectedItem.fota_ip || "",
      window_open:this.props.selectedItem.window_open || "",
    }
  };
  update = () => {
    const positionId = this.props.selectedNode.buildingID
      ? this.props.selectedNode.id
      : "";
    if (!positionId) {
      alert("측정기관리 목록에서 위치를 선택하세요");
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
    //   alert("IMEI 번호를 입력하세요");
    // } else if (
    //   this.state.postData.networkType === "ethernet" &&
    //   !this.state.postData.ip
    // ) {
    //   alert("IP address를 입력하세요");
    // } else if (
    //   this.state.postData.networkType === "ethernet" &&
    //   !this.state.postData.subnet
    // ) {
    //   alert("Subnet mask를 입력하세요");
    // } else if (
    //   this.state.postData.networkType === "ethernet" &&
    //   !this.state.postData.gateway
    // ) {
    //   alert("Gateway를 입력하세요");
    // } else if (
    //   this.state.postData.networkType === "ethernet" &&
    //   !this.state.postData.send_period
    // ) {
    //   alert("전송 주기를 입력하세요");
    // } else if (
    //   this.state.postData.networkType === "ethernet" &&
    //   !this.state.postData.fota_url
    // ) {
    //   alert("FOTA URL 을 입력하세요");
    // } else if (
    //   this.state.postData.networkType === "ethernet" &&
    //   !this.state.postData.upload_url
    // ) {
    //   alert("로그전송 URL을 입력하세요");
    // } else if (
    //   this.state.postData.networkType === "ethernet" &&
    //   !this.state.postData.dns
    // ) {
    //   alert("DNS 를 입력하세요");
    // } else if (
    //   this.state.postData.networkType === "ethernet" &&
    //   !this.state.postData.dhcp
    // ) {
    //   alert("DHCP 를 입력하세요");   
    // } else if (
    //   this.state.postData.networkType === "ethernet" &&
    //   !this.state.postData.reset_info
    // ) {
    //   alert("reset_info 를 입력하세요");   
    // } else if (
    //   this.state.postData.networkType === "ethernet" &&
    //   !this.state.postData.version
    // ) {
    //   alert("version 을 입력하세요");
    // } else if (
    //   this.state.postData.networkType === "ethernet" &&
    //   !this.state.postData.firmware
    // ) {
    //   alert("firmware 을 입력하세요");
    // } else if (
    //   this.state.postData.networkType === "ethernet" &&
    //   !this.state.postData.checksum
    // ) {
    //   alert("checksum 을 입력하세요");
    // } else if (
    //   this.state.postData.networkType === "ethernet" &&
    //   !this.state.postData.upload_ip
    // ) {
    //   alert("upload_ip 을 입력하세요");
    // } else if (
    //   this.state.postData.networkType === "ethernet" &&
    //   !this.state.postData.fota_ip
    // ) {
    //   alert("fota_ip 을 입력하세요");
    }
    else {
      let goAhed = true;
      if (positionId != this.state.postData.positionID) {
        // if (!confirm("위치가 변경되었습니다. 이동하시겠습니까?")) {
        if (!confirm("확인을 누르시면 위치가 변경됩니다.")) {
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
      <form className="text-blue w3-margin" style={{width:"144%"}}>
        <h2 className="text-left" style={{marginLeft: "258px" ,color:"white"}}>측정기 수정</h2>
        <div className="w3-row w3-section" style={{marginLeft: "100px" }}>
          <div className="w3-col w3-padding-right" style={{ width: "80px",color:"white" ,marginright: "100px"}}>
            &nbsp;
          </div>
          <div className="w3-rest pl-1">
            <div className="form-check form-check-inline">
              <label className="form-check-label" style={{color:"white"}}>
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
              <label className="form-check-label" style={{color:"white"}}>
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
        <div class='left-box' style={{position:"absolute",top:"74px",left:"-234px"}}>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px",color:"white",color:"white" }}>
            건물명
          </div>
          <div className="w3-rest">
            <div className="form-control" style={{ background: "#eee" ,height:"28px",width:"342px",backgroundColor:"azure"}}>
              {this.props.selectedNode.buildingID
                ? this.props.selectedNode.buildingName
                : this.props.selectedNode.name}{" "}
              &nbsp;
            </div>
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px",color:"white" ,color:"white"}}>
            위치
          </div>
          <div className="w3-rest">
            <div className="form-control" style={{ background: "#eee" ,height:"28px",backgroundColor:"azure"}}>
              {this.props.selectedNode.buildingID
                ? this.props.selectedNode.name
                : ""}{" "}
              &nbsp;
            </div>
            <div className="small" style={{color:"white"}}>건물목록에서 위치를 변경할 수 있습니다.</div>
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px",color:"white" ,color:"white"}}>
            측정기명
          </div>
          <div className="w3-rest">
            <input
              className="form-control"
              name="name"
              style={{fontSize:"10px",backgroundColor:"azure"}}
              value={this.state.postData.name}
              type="text"
              placeholder=""
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px",color:"white",color:"white" }}>
            제품군
          </div>
          <div className="w3-rest">
            <select
              className="form-control"
              name="productID"
              value={this.state.postData.productID}
              onChange={this.handleChange}
              style={{fontSize:"10px",height:"28px",backgroundColor:"azure"}}
            >
              {this.props.productList.map(product => (
                <option key={product.id} value={product.id} style={{fontSize:"10px"}}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px",color:"white" }}>
            보고서
          </div>
          <div className="w3-rest">
            <select
              className="form-control"
              name="reportType"
              value={this.state.postData.reportType}
              onChange={this.handleChange}
              style={{fontSize:"10px",height:"28px",backgroundColor:"azure"}}
            >
              <option value="1" style={{fontSize:"10px"}}>1주</option>
              <option value="2" style={{fontSize:"10px"}}>1달</option>
              <option value="3" style={{fontSize:"10px"}}>프리미엄</option>
            </select>
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px",color:"white" }}>
            S/N
          </div>
          <div className="w3-rest">
            <div className="form-control" style={{ background: "#eee" ,fontSize:"10px",backgroundColor:"azure"}}>
              {this.state.postData.serialNumber}
              &nbsp;
            </div>
          </div>
        </div>
        </div>
        {this.state.postData.networkType === "cellular" && (
          <React.Fragment>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white"}}
              >
                개통 번호
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="phone"
                  value={this.state.postData.phone}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                IMEI 번호
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="imei"
                  value={this.state.postData.imei}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white"}}
              >
                DNS
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="dns"
                  value={this.state.postData.dns}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
         
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white"}}
              >
                Gateway
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="gateway"
                  value={this.state.postData.gateway}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white"}}
              >
                전송 주기
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="send_period"
                  value={this.state.postData.send_period}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                Subnet mask
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="subnet"
                  value={this.state.postData.subnet}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white"}}
              >
                FOTA URL
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="fota_url"
                  value={this.state.postData.fota_url}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                로그전송 URL
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="upload_url"
                  value={this.state.postData.upload_url}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white",marginLeft: "185px" }}
              >
                DHCP
              </div>
              <div className="w3-rest">
              <select
              className="form-control"
              name="dhcp"
              style={{fontSize:"10px",height:"28px",backgroundColor:"azure"}}
              value={this.state.postData.dhcp}
              onChange={this.handleChange}
            >
              <option value="">Null</option>
              <option value="0">수동</option>
              <option value="1">자동</option>
            </select>
              </div>
              <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white"}}
              >
                H/W Reset 
              </div>
              <div className="w3-rest">
              <select
              className="form-control"
              name="reset_info"
              style={{fontSize:"10px",height:"28px",backgroundColor:"azure"}}
              value={this.state.postData.reset_info}
              onChange={this.handleChange}
            >
              <option value="0">처리안함</option>
              <option value="1">리셋처리</option>
            </select>
              </div>
              </div>
              <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                version
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="version"
                  value={this.state.postData.version}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                firmware
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="firmware"
                  value={this.state.postData.firmware}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                checksum
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="checksum"
                  value={this.state.postData.checksum}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
               upload_ip
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="upload_ip"
                  value={this.state.postData.upload_ip}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                fota_ip
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="fota_ip"
                  value={this.state.postData.fota_ip}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section"  style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white",fontSize:"10px"}}
              >
                창문개폐 여부
              </div>
              <div className="w3-rest">
              <select
              className="form-control"
              name="window_open"
              style={{fontSize:"10px",height:"28px",backgroundColor:"azure"}}
              value={this.state.postData.window_open}
              onChange={this.handleChange}
            >
              <option value="0">미적용</option>
              <option value="1">닫힘</option>
              <option value="2">열림</option>
            </select>
              </div>
              </div>
          </React.Fragment>
        )}
        {this.state.postData.networkType === "ethernet" && (
          <React.Fragment>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                IP address
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="ip"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  value={this.state.postData.ip}
                  type="text"
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white"}}
              >
                Subnet mask
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="subnet"
                  value={this.state.postData.subnet}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                Gateway
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="gateway"
                  value={this.state.postData.gateway}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                전송 주기
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="send_period"
                  value={this.state.postData.send_period}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                FOTA URL
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="fota_url"
                  value={this.state.postData.fota_url}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                로그전송 URL
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="upload_url"
                  value={this.state.postData.upload_url}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                DNS
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="dns"
                  value={this.state.postData.dns}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white"}}
              >
                DHCP
              </div>
              <div className="w3-rest">
              <select
              className="form-control"
              name="dhcp"
              style={{fontSize:"10px",height:"28px",backgroundColor:"azure"}}
              value={this.state.postData.dhcp}
              onChange={this.handleChange}
            >
              <option value="">Null</option>
              <option value="0">수동</option>
              <option value="1">자동</option>
            </select>
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white"}}
              >
                H/W Reset 
              </div>
              <div className="w3-rest">
              <select
              className="form-control"
              name="reset_info"
              style={{fontSize:"10px",height:"28px",backgroundColor:"azure"}}
              value={this.state.postData.reset_info}
              onChange={this.handleChange}
            >
              <option value="0">처리안함</option>
              <option value="1">리셋처리</option>
            </select>
              </div>
              </div>
              <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                version
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="version"
                  value={this.state.postData.version}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                firmware
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="firmware"
                  value={this.state.postData.firmware}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                checksum
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="checksum"
                  value={this.state.postData.checksum}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
               upload_ip
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="upload_ip"
                  value={this.state.postData.upload_ip}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" }}
              >
                fota_ip
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="fota_ip"
                  value={this.state.postData.fota_ip}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section"  style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white" ,fontSize:"10px"}}
              >
                창문개폐 여부
              </div>
              <div className="w3-rest">
              <select
              className="form-control" 
              name="window_open"
              style={{fontSize:"10px",height:"28px",backgroundColor:"azure"}}
              value={this.state.postData.window_open}
              onChange={this.handleChange}
            >
              <option value="0">미적용</option>
              <option value="1">닫힘</option>
              <option value="2">열림</option>
            </select>
              </div>
              </div>
          </React.Fragment>
        )}
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
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.auth.authUser,
  selectedNode: state.tree.selectedNode,
  productList: state.product.list,
  viewMode: state.settings.viewMode,
  selectedItem: state.settings.selectedItem
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
