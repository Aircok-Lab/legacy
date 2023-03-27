import React, { Component } from "react";
import { connect } from "react-redux";
import { updateIrSetting } from "actions/System";
import { setViewMode } from "actions/Setting";

class Update extends Component {
  state = {
    postData: {
      serialNumber:""+ this.props.selectedItem.serialNumber,
      pm10_gang_start: ""+ this.props.selectedItem.pm10_gang_start,
      pm10_gang_end: ""+ this.props.selectedItem.pm10_gang_end,
      pm10_jung_start: ""+ this.props.selectedItem.pm10_jung_start,
      pm10_jung_end: ""+ this.props.selectedItem.pm10_jung_end,
      pm10_yag_start:""+ this.props.selectedItem.pm10_yag_start,
      pm10_yag_end: ""+ this.props.selectedItem.pm10_yag_end,
      pm25_gang_start:""+ this.props.selectedItem.pm25_gang_start,
      pm25_gang_end:""+ this.props.selectedItem.pm25_gang_end,
      pm25_jung_start:""+ this.props.selectedItem.pm25_jung_start,
      pm25_jung_end:""+ this.props.selectedItem.pm25_jung_end,
      pm25_yag_start:""+ this.props.selectedItem.pm25_yag_start,
      pm25_yag_end:""+ this.props.selectedItem.pm25_yag_end,
      temperature:""+ this.props.selectedItem.temperature,
      co2:""+ this.props.selectedItem.co2,
    }
  };
  update = () => {
    if (!this.state.postData.serialNumber) {
      alert("시리얼 넘버를 입력하세요");
    } else if (!this.state.postData.pm10_gang_start) {
      alert("PM10(강) 최소값을 입력하세요");
    } else if (!this.state.postData.pm10_gang_end) {
      alert("PM10(강) 최대값을 입력하세요");
    } else if (!this.state.postData.pm10_jung_start) {
      alert("PM10(중) 최소값을 입력하세요");
    } else if (!this.state.postData.pm10_jung_end) {
      alert("PM10(중) 최대값을 입력하세요");
    } else if (!this.state.postData.pm10_yag_start) {
      alert("PM10(약) 최소값을 입력하세요");
    }  else if (!this.state.postData.pm10_yag_end) {
      alert("PM10(약) 최대값을 입력하세요");
    }  else if (!this.state.postData.pm25_gang_start) {
      alert("PM2.5(강) 최소값을 입력하세요");
    }  else if (!this.state.postData.pm25_gang_end) {
      alert("PM2.5(강) 최대값을 입력하세요");
    }  else if (!this.state.postData.pm25_jung_start) {
      alert("PM2.5(중) 최소값을 입력하세요");
    }  else if (!this.state.postData.pm25_jung_end) {
      alert("PM2.5(중) 최대값을 입력하세요");
    }  else if (!this.state.postData.pm25_yag_start) {
      alert("PM2.5(약) 최소값을 입력하세요");
    }  else if (!this.state.postData.pm25_yag_end) {
      alert("PM2.5(약) 최대	값을 입력하세요");
    }  else if (!this.state.postData.temperature) {
      alert("에어컨 가동온도 설정 온도값을 입력하세요");
    }  else if (!this.state.postData.co2) {
      alert("CO2 설정값을 입력하세요");
    }   else {
      this.props.updateIrSetting(this.state.postData);
    }
  };
  handleChange = e => {
    const target = e.target;
    let value;
    if (target.type === "checkbox") {
      value = target.checked ? "1" : "0";
    } else if (target.type === "file") {
      value = e.target.files[0];
    } else {
      value = target.value;
    }
    const name = target.name;
    this.setState({
      postData: {
        ...this.state.postData,
        [name]: value
      }
    });
  };

  render() {
    return (
      <form className="text-blue w3-margin">
      {/* <form className="text-blue w3-margin" style={{height:"84%",border: "1px solid rgb(189, 177, 177)" ,height: "93%"}}> */}
      <h3 className="text-center" 
          style={{borderBottom: "1px solid rgb(189, 177, 177)" ,
          borderTop: "1px solid rgb(189, 177, 177)" ,
          marginTop: "26px" ,
          padding: "14px",
          color:"white",fontFamily:"Noto Sans KR",
          fontSize:"20px",
          fontFamily:"Noto Sans KR"}}>IR 디바이스 수정</h3>
      <div className="float-left" style={{marginleft: "517px",marginBottom:"30px"}}>
      <div className="form-control" style={{ background: "#eee" ,fontSize:"17px",marginLeft:"543px",marginBottom:"-32px"}}>
              {this.state.postData.serialNumber}
              &nbsp;
            </div>

        <h1><span class="badge badge-secondary" style={{backgroundColor: "rgb(115, 113, 114",marginLeft:"440px",fontFamily:"Noto Sans KR"}}>
          기기 번호</span></h1>
    </div>

    <div className="w3-row w3-section" 
         style={{marginLeft:"438px"}}>
      <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
      </div>
    <div 
      style={{marginLeft:"50px"}}>
      <p style={{marginLeft:"-48px",fontSize:"20px",marginBottom:"50px",
          fontFamily:"Noto Sans KR"}}>공기청정기 가동범위 설정</p>
      <div className="float-left" style={{marginLeft:"-48px"}}>
      <h1><span class="badge badge-secondary" style={{backgroundColor: "rgb(115, 113, 114)",fontFamily:"Noto Sans KR"}}>최소</span></h1>
      <h1><span class="badge badge-secondary" style={{backgroundColor: "rgb(115, 113, 114)",fontFamily:"Noto Sans KR"}}>최대</span></h1>
      </div>
     
      <div className="float-left" style={{marginLeft:"20px",marginTop:"-29px",color:"white",fontFamily:"Noto Sans KR"}}>
      <h3 style={{color:"white",fontFamily:"Noto Sans KR"}}>PM10(강)</h3>
        <input
          className="form-control"
          name="pm10_gang_start"
          type="number"
          placeholder=""
          value={this.state.postData.pm10_gang_start} 
          onChange={this.handleChange}
          style={{width:"280px",fontSize:"20px"}}
        />
        <input
          className="form-control"
          name="pm10_gang_end"
          placeholder=""
          type="number"
          value={this.state.postData.pm10_gang_end} 
          onChange={this.handleChange}
          style={{width:"280px" ,fontSize:"20px",marginTop:"6px"}}
          />
      </div>
      <div className="float-left" style={{marginLeft:"17px",marginTop:"-29px"}}>
      <h3 style={{color:"white",fontFamily:"Noto Sans KR"}}>PM10(중)</h3>
        <input
          className="form-control"
          name="pm10_jung_start"
          placeholder=""
          type="number"
          value={this.state.postData.pm10_jung_start} 
          onChange={this.handleChange}
          style={{width:"280px" ,fontSize:"20px"}}
        />
        <input
          className="form-control"
          name="pm10_jung_end"
          placeholder=""
          type="number"
          value={this.state.postData.pm10_jung_end}  
          onChange={this.handleChange}
          style={{width:"280px" ,fontSize:"20px",marginTop:"6px"}}
          />
      </div>
      <div className="float-left" style={{marginLeft:"17px",marginTop: "-29px"}}>
      <h3 style={{color:"white",fontFamily:"Noto Sans KR"}}>PM10(약)</h3>
        <input
          className="form-control"
          name="pm10_yag_start"
          placeholder=""
          type="number"
          value={this.state.postData.pm10_yag_start}  
          onChange={this.handleChange}
          style={{width:"280px" ,fontSize:"20px"}}
        />
        <input
          className="form-control"
          name="pm10_yag_end"
          placeholder=""
          type="number"
          value={this.state.postData.pm10_yag_end}  
          onChange={this.handleChange}
          style={{width:"280px" ,fontSize:"20px",marginTop:"6px"}}
        />
          </div>
          </div>
          <br></br>
    <div className="w3-row w3-section" >
    <br></br>
      <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
        
      </div>
      <div className="float-left" style={{marginTop:"28px"}}>
      <h1><span class="badge badge-secondary" style={{backgroundColor: "rgb(115, 113, 114"}}>최소</span></h1>
      <h1><span class="badge badge-secondary" style={{backgroundColor: "rgb(115, 113, 114"}}>최대</span></h1>
      </div>
      <div className="float-left" style={{marginLeft:"20px"}}>
      <h3 style={{color:"white",fontFamily:"Noto Sans KR"}}>PM2.5(강)</h3>
        <input
          className="form-control"
          name="pm25_gang_start"
          placeholder=""
          type="number"
          value={this.state.postData.pm25_gang_start}
          onChange={this.handleChange} 
          style={{width:"280px" ,fontSize:"20px"}}
        />
        <input
          className="form-control"
          name="pm25_gang_end"
          placeholder=""
          type="number"
          value={this.state.postData.pm25_gang_end} 
          onChange={this.handleChange}
          style={{width:"280px" ,fontSize:"20px",marginTop:"6px"}}
          />
      </div>
      <div className="float-left" style={{marginLeft:"17px"}}>
      <h3 style={{color:"white",fontFamily:"Noto Sans KR"}}> PM2.5(중)</h3>
        <input
          className="form-control"
          name="pm25_jung_start"
          placeholder=""
          type="number"
          value={this.state.postData.pm25_jung_start} 
          onChange={this.handleChange}
          style={{width:"280px" ,fontSize:"20px"}}
        />
        <input
          className="form-control"
          name="pm25_jung_end"
          placeholder=""
          type="number"
          value={this.state.postData.pm25_jung_end} 
          onChange={this.handleChange}
          style={{width:"280px" ,fontSize:"20px",marginTop:"6px"}}
          />
      </div>
      <div className="float-left" style={{marginLeft:"17px"}}>
      <h3 style={{color:"white",fontFamily:"Noto Sans KR"}}>PM2.5(약)</h3>
        <input
          className="form-control"
          name="pm25_yag_start"
          value={this.state.postData.pm25_yag_start} 
          placeholder=""
          type="number"
          onChange={this.handleChange}
          style={{width:"280px" ,fontSize:"20px"}}
        />
        <input
          className="form-control"
          name="pm25_yag_end"
          placeholder=""
          type="number"
          value={this.state.postData.pm25_yag_end} 
          onChange={this.handleChange}
          style={{width:"280px" ,fontSize:"20px",marginTop:"6px"}}
        />
          </div>
          </div>
          </div>
      <div className="float-left">
      <h3 style={{marginLeft:"510px" ,color:"white"}}>CO2 설정</h3>
      <h1 style={{marginLeft:"438px"}}><span class="badge badge-secondary" style={{backgroundColor: "rgb(115, 113, 114"}}>
        CO2
        </span></h1>
      <input
          className="form-control"
          name="co2"
          placeholder=""
          type="number"
          value={this.state.postData.co2} 
          onChange={this.handleChange}
          style={{width:"278px",marginLeft:"510px",fontSize:"20px",marginTop:"-49px"}}
        />
    </div>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <div className="w3-row w3-section" style={{marginLeft:"438px"}}>
      <div className="float-left" style={{marginLeft:"50px"}}>
      <p style={{marginLeft:"-50px",fontSize:"20px",fontFamily:"Noto Sans KR"}}>에어컨 가동온도 설정</p>
      <div className="w3-col w3-padding-right" style={{ width: "80px" }}>
      </div>
      <div className="float-left">
      <h1 style={{marginLeft:"-49px"}}><span class="badge badge-secondary" style={{backgroundColor: "rgb(115, 113, 114"}}>
        온도
        </span></h1>
      </div>
      <div className="float-left">
        <input
          className="form-control"
          name="temperature"
          placeholder=""
          type="number"
          value={this.state.postData.temperature} 
          onChange={this.handleChange}
          style={{width:"278px",marginLeft:"20px",fontSize:"20px"}}
        />
      </div>
    </div>
    </div>
  
    <div className="clearfix" style={{marginLeft:"1267px"}}>
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
          저장
        </button>
    </div>
    </form>
    );
  }
}

const mapStateToProps = state => ({
  selectedItem: state.settings.selectedItem
});

const mapDispatchToProps = {
  updateIrSetting,
  setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Update);
