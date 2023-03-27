import React, { Component } from "react";
import { connect } from "react-redux";
import { deviceAddRequest, deviceAddRequest1 } from "actions/Device";
import { productListRequest } from "actions/Product";
import { setViewMode } from "actions/Setting";
import setInitValue from "util/setInitValue";
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
      subnet: "",
      send_period:"",
      upload_url:"",
      fota_url:"",
      dns:"",
      dhcp:"",
      reset_info:"",
      version:"",
      firmware:"",
      checksum:"",
      upload_ip:"",
      fota_ip:"",
      window_open:"",
      param1:"",
      param2:"",
      param3:"",
      param4:"",
      param5:"",
      param6:"",
      param7:"",
      param8:"",
      param9:"",
      param10:"",
      param11:"",
      param12:"",
      param13:"",
      param14:"",
      param15:"",
      param16:"",
      param17:"",
      param18:"",
      param19:"",
      param20:"",
      param21:"",
      param22:"",
      param23:"",
      param24:"",
      param25:"",
      param26:"",
      param27:"",
      param28:"",
      param29:"",
      param30:"",
    
    },
  
  };
  add = () => {
    const positionId = this.props.selectedNode && this.props.selectedNode.buildingID
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
  add1 = () => {
    const positionId = this.props.selectedNode && this.props.selectedNode.buildingID
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
    }  else {
      // 변경된 포지션을 저장
      this.setState(
        {
          postData1: {
            ...this.state.postData,
            positionID: positionId
          }
        },
        () => {
          //포지션 저장완료 후, 서버에 데이터 전송
          this.props.deviceAddRequest1(this.state.postData);
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
    const steps = JSON.parse(localStorage.getItem("steps"));
    return (
      <form className="text-blue w3-margin" style={{width:"144%"}}>
        <h2 className="text-left"  style={{marginLeft: "258px" ,color:"white",fontFamily:"Noto Sans KR"}}>측정기 등록</h2>
         <div className="w3-row w3-section" style={{marginLeft: "100px" }}>
          <div className="w3-col w3-padding-right" style={{ width: "80px", marginright: "100px" }}>
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
            <div className="form-check form-check-inline">
              <label className="form-check-label" style={{color:"white"}}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="networkType"
                  value="Test"
                  checked={this.state.postData.networkType === "Test"}
                  onChange={this.handleChange}
                />
                Test
              </label>
            </div>
          </div>
        </div>
        <div class='left-box' style={{position:"absolute",top:"74px",left:"-234px"}}>
      
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" ,color:"white",fontFamily:"Noto Sans KR"}}>
            건물명
          </div>
          <div className="w3-rest">
            <div className="form-control" style={{ background: "#eee",height:"28px",width:"342px",backgroundColor:"azure" }}>
              {this.props.selectedNode && this.props.selectedNode.buildingID
                ? this.props.selectedNode.buildingName
                : this.props.selectedNode.name}{" "}
              &nbsp;
            </div>
            {steps && (
              <div className="small">
                건물목록에서 건물명을 선택할 수 있습니다.
              </div>
            )}
          </div>
        </div>
        
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" ,color:"white",fontFamily:"Noto Sans KR"}}>
            위치
          </div>
          <div className="w3-rest">
            <div className="form-control" style={{ background: "#eee",backgroundColor:"azure" }}>
              {this.props.selectedNode && this.props.selectedNode.buildingID
                ? this.props.selectedNode.name
                : ""}{" "}
              &nbsp;
            </div>
            {steps && (
              <div className="small">
                건물목록에서 위치명을 선택할 수 있습니다.
              </div>
            )}
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" ,color:"white",fontFamily:"Noto Sans KR"}}>
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
          <div className="w3-col w3-padding-right" style={{ width: "80px" ,color:"white",fontFamily:"Noto Sans KR"}}>
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
              <option value="" style={{fontSize:"10px"}}/>
              {this.props.productList.map(product => (
                <option style={{fontSize:"10px"}} key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w3-row w3-section">
          <div className="w3-col w3-padding-right" style={{ width: "80px" ,color:"white",fontFamily:"Noto Sans KR"}}>
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
          <div className="w3-col w3-padding-right" style={{ width: "80px" ,color:"white",fontFamily:"Noto Sans KR" }}>
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
              style={{fontSize:"10px",backgroundColor:"azure"}}
            />
          </div>
        </div>
        </div>
        {this.state.postData.networkType === "cellular" && (
          <React.Fragment>
            <div className="w3-row w3-section" style={{ marginLeft: "185px",color:"white",fontFamily:"Noto Sans KR" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px"}}
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
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px" ,color:"white",fontFamily:"Noto Sans KR"}}>
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
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px",color:"white",fontFamily:"Noto Sans KR" }}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" }}
              >
                DNS
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="dns"
                  value={this.state.postData.dns}
                  type="text"
                  placeholder=""
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          
            <div className="w3-row w3-section" style={{ marginLeft: "185px" ,color:"white",fontFamily:"Noto Sans KR"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px"}}
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
            <div className="w3-row w3-section" style={{ marginLeft: "185px" ,color:"white",fontFamily:"Noto Sans KR"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px"}}
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
            <div className="w3-row w3-section" style={{ marginLeft: "185px" ,color:"white",fontFamily:"Noto Sans KR"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px"}}
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
            <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",marginLeft: "185px" ,color:"white",fontFamily:"Noto Sans KR"}}
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
            <div className="w3-row w3-section" style={{ marginLeft: "185px" ,color:"white",fontFamily:"Noto Sans KR"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px"}}
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
                style={{ width: "80px",marginLeft: "185px",color:"white",fontFamily:"Noto Sans KR"}}
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
              <option style={{fontSize:"10px",fontFamily:"Noto Sans KR"}} value="">Null</option>
              <option style={{fontSize:"10px",fontFamily:"Noto Sans KR"}} value="0">수동</option>
              <option style={{fontSize:"10px",fontFamily:"Noto Sans KR"}} value="1">자동</option>
            </select>
              </div>
              <div className="w3-row w3-section"  style={{ marginLeft: "185px",color:"white",fontFamily:"Noto Sans KR"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px"}}
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
              <div className="w3-row w3-section" style={{ marginLeft: "185px",color:"white",fontFamily:"Noto Sans KR"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px"}}
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
              <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR"}}
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
              <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR"}}
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
              <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR"}}
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
              <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR"}}
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
                style={{ width: "80px",fontSize:"10px",color:"white",fontFamily:"Noto Sans KR"}}
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
            <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" ,color:"white",fontFamily:"Noto Sans KR"}}
              >
                IP address
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="ip"
                  value={this.state.postData.ip}
                  type="text"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" ,color:"white",fontFamily:"Noto Sans KR"}}
              >
                Subnet mask
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="subnet"
                  value={this.state.postData.subnet}
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  type="text"
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR"}}
              >
                Gateway
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="gateway"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  value={this.state.postData.gateway}
                  type="text"
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR"}}
              >
                전송 주기
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="send_period"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  value={this.state.postData.send_period}
                  type="text"
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR"}}
              >
                FOTA URL
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="fota_url"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  value={this.state.postData.fota_url}
                  type="text"
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR"}}
              >
                로그전송 URL
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="upload_url"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  value={this.state.postData.upload_url}
                  type="text"
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR" }}
              >
                DNS
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="dns"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  value={this.state.postData.dns}
                  type="text"
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR"}}
              >
                DHCP
              </div>
              <div className="w3-rest">
            <select
              className="form-control"
              name="dhcp"
              style={{fontSize:"10px" ,height:"28px",backgroundColor:"azure"}}
              value={this.state.postData.dhcp}
              onChange={this.handleChange}
            >
              <option value="">Null</option>
              <option value="0">수동</option>
              <option value="1">자동</option>
            </select>
          </div>
            </div>
            <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
            <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR"}}
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
              <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" ,color:"white",fontFamily:"Noto Sans KR"}}
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
              <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" ,color:"white",fontFamily:"Noto Sans KR"}}
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
              <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" ,color:"white",fontFamily:"Noto Sans KR"}}
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
              <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" ,color:"white",fontFamily:"Noto Sans KR"}}
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
              <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px" ,color:"white",fontFamily:"Noto Sans KR"}}
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
                style={{ width: "80px",fontSize:"10px" ,color:"white",fontFamily:"Noto Sans KR"}}
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
        {this.state.postData.networkType === "Test" && (
          <React.Fragment>
             {/* <div className="w3-row w3-section" style={{ marginLeft: "185px"}}>
              <div
                className="w3-col w3-padding-right"
                style={{ width: "80px",color:"white",fontFamily:"Noto Sans KR"}}
              >
                param1
              </div>
              <div className="w3-rest">
                <input
                  className="form-control"
                  name="param1"
                  style={{fontSize:"10px",backgroundColor:"azure"}}
                  value={this.state.postData.param1}
                  type="text"
                  placeholder=""
                  onChange={this.handleChange}
                />
              </div>
            </div> */}
              
              
          </React.Fragment>
        )}
        <div className="clearfix" >
        
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
                 if(this.state.postData.networkType === "Test"){

                  this.add1();
                 }else{
                   this.add();
                 }
              }}
            >
              OK
            </button>
            {/* <button
              type="button"
              className="btn btn-primary"
              onClick={e => {
                  this.add1();
              }}
            >
              Test
            </button> */}
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
  deviceAddRequest1,
  productListRequest,
  setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Add);
