import React from "react";
import { connect } from "react-redux";
import { showAuthLoader } from "actions/Auth";
import {
  allTimeRecentDataRequest,
  timeMonitoringRecentDataRequest
} from "actions/RecentData";
import { systemListRequest } from "actions/System";
import SensorData from "./sensorData";
import { Button ,Form , Table } from "reactstrap";


  const qualityType = {
    1: "좋음",
    2: "보통",
    3: "약간나쁨",
    4: "나쁨",
    5: "매우나쁨",
    6: "최악"
  };

  const tableLineHeight = 55;

  class MonitoringPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.showAuthLoader();
    this.props.systemListRequest({ id: "1" });
    if (this.props.authUser.userType === "monitoring")
      this.props.timeMonitoringRecentDataRequest(this.props.authUser.buildingId);
    else 
    this.props.allTimeRecentDataRequest(this.props.authUser.buildingList);
    this.pageScroll = this.pageScroll.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleSortingChange = this.handleSortingChange.bind(this);
    this.state = {
      uniqBuildingName: [],
      sorting: "all",
      height: window.innerHeight,
      width: window.innerWidth,
      measureCycle: "60"
    };
  }

  componentDidMount() {
    this.loadDataintervalLoadDataHandle = setInterval(this.loadData, 300000);
    this.intervalScrollHandle = setInterval(
      this.pageScroll,
      this.props.data.scrollTime * 1000
      );
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    clearInterval(this.intervalScrollHandle);
    clearInterval(this.loadDataintervalLoadDataHandle);
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data.scrollTime !== nextProps.data.scrollTime) {
      if (this.intervalScrollHandle) clearInterval(this.intervalScrollHandle);
      this.intervalScrollHandle = setInterval(
        this.pageScroll,
        nextProps.data.scrollTime * 1000
      );
    }

    if (this.props.allTimeRecentData !== nextProps.allTimeRecentData) {
      var uniqBuildingName = nextProps.allTimeRecentData.reduce(function(a, b) {
        if (a.indexOf(b.branchName) < 0) a.push(b.branchName);
        return a;
      }, []);

      // console.log(uniqBuildingName);
      this.setState({ uniqBuildingName: uniqBuildingName });
    }
  }
    
  updateDimensions() {
      this.setState({
        height: window.innerHeight - 265, // Heder : 70, padding : 24, form : 36, TableHeader : 111, padding : 24
        width: window.innerWidth
      });
    }

  handleSortingChange(event) {
    console.log(event.target.name);
    console.log(event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  }

  pageScroll() {
    var objDiv = document.getElementById("contain");
    var scrollHeight = tableLineHeight * this.props.data.scrollRow; // tableHeight
    if (
      objDiv.scrollHeight - objDiv.scrollTop - objDiv.clientHeight >
      scrollHeight
    )
      objDiv.scrollTop = objDiv.scrollTop + scrollHeight;
    else if (objDiv.scrollHeight - objDiv.scrollTop - objDiv.clientHeight > 0)
      objDiv.scrollTop =
        objDiv.scrollTop + (objDiv.scrollHeight - objDiv.clientHeight);
    else if (objDiv.scrollTop == objDiv.scrollHeight - objDiv.clientHeight) {
      objDiv.scrollTop = 0;
    }
  }

  loadData() {
    if (this.props.authUser.userType === "monitoring")
      this.props.timeMonitoringRecentDataRequest(this.props.authUser.buildingId);
    else if (this.props.allTimeRecentDataRequest(this.props.authUser.buildingList));
  }
  
  onDetailView4Jelly = (deviceCode ,param_deviceId) => {
    console.log(deviceCode); 
    console.log(param_deviceId);
    window.open("/newjelly/index.html?devId="+param_deviceId+"&sn="+deviceCode);
  };



  fnExcelReport(id, title) {
  var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
  tab_text = tab_text + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
  tab_text = tab_text + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
  tab_text = tab_text + '<x:Name>실시간 디바이스 현황 파일</x:Name>';
  tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
  tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
  tab_text = tab_text + "<table border='1px'>";
  var exportTable = $('#' + id).clone();
  exportTable.find('input').each(function (index, elem) { $(elem).remove(); });
  tab_text = tab_text + exportTable.html();
  tab_text = tab_text + '</table></body></html>';
  var data_type = 'data:application/vnd.ms-excel';
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");
  var title = '실시간 디바이스 현황 파일';
  var fileName = title + '.xls';

  //Explorer 환경에서 다운로드
  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
  if (window.navigator.msSaveBlob) {
  var blob = new Blob([tab_text], {
  type: "application/csv;charset=utf-8;"
  });
  navigator.msSaveBlob(blob, fileName);
  }
  } else {
  var blob2 = new Blob([tab_text], {
  type: "application/csv;charset=utf-8;"
  });
  var filename = fileName;
  var elem = window.document.createElement('a');
  elem.href = window.URL.createObjectURL(blob2);
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
    }
  }
  render() {
  const formWidth = "130px";
  const nameTabWidth = "145px";
  const indexTabWidth = "250px";

  return (
    <div 
    class="page-content"
    // className="app-wrapper" 
    style={{
    backgroundColor:"#2a2c34",
    overflowY:'auto',
    display:'block',
    marginLeft: "auto",
    marginRight: "auto",
    // marginTop: "26px"
  }}
    >
    <div type="text" 
      style={{color: "white", backgroundColor:"rgb(31, 32, 37)", border: "1px solid white",
              width: "10%",padding: "7px" , marginLeft: "294px",
              borderRadius: "6px", height:"70px", marginBottom: "-65px",
              textAlign:"left",marginTop:"23px",fontFamily:"Noto Sans KR"}}>

      <p style={{color: "#4ce682"}}>★ : 중점관리 장비</p>
      <p style={{color: "#d9712b"}}>주황색 : 이상치 발생장비</p>
      </div>
      <div type="text" 
      style={{color: "white", backgroundColor:"rgb(31, 32, 37)", border: "1px solid white",
              width: "32%",padding: "15px" , marginLeft: "1266px", marginBottom: "-55px",
              borderRadius: "6px",fontFamily:"Noto Sans KR"}}>
      <strong>※ 경과시간은 최종 데이터 시간을 최종 데이터 수집 후 분,시간,일 단위로 표시합니다. </strong>
      <br></br>
      <strong>※ 이 화면은 5분단위로 조회하여 갱신 됩니다. </strong>
      </div>
      <div className="col-2 pl-0 building-filter">
          {this.state.uniqBuildingName.length ? (
            <form style={{ width: `${nameTabWidth}`}}>
              <select
                className="form-control"
                name="sorting"
                value={this.state.sorting}
                onChange={this.handleSortingChange}
                style={{ backgroundColor: 'rgb(90, 87, 87)',
                color: 'rgb(251 251 251)'
                ,marginTop:'10px'
                ,fontWeight:"bold"
                ,fontSize:"12px"
                ,marginLeft:"5px"
                ,border:"rgb(90, 87, 87)"
              }}
              >
                <option value="all" style={{fontFamily:"Noto Sans KR"}}>==지점선택==</option>
                {this.state.uniqBuildingName.map(name => {
                  return (
                    <option key={name} value={name} style={{width: `${nameTabWidth}`}}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </form>
          ) : null}
        </div>
        <Button type="button" style={{
        left:"159px",bottom:"28px",border:"1px solid #1f2025" ,backgroundColor:"#1f2025", color:"white",fontFamily:"Noto Sans KR",fontSize:"8px"}} 
        onClick={() => this.fnExcelReport('table','title')}>Excel Download</Button>
      
        <table
        id="table" 
        style={{ height: '787px',
                 marginLeft:"13px",
                 display:'block'
        }}>
          <thead 
        style={{backgroundColor:""}}>
         {/* ,marginLeft:"13px" */}
      <tr>
      <th
        colSpan={1}
        style={{ minWidth:"98px",border: "1px solid rgb(72, 68, 68)",color:"white",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
        >
        No.
        </th>
        <th
        colSpan={1}
        style={{minWidth:"122px",border: "1px solid rgb(72, 68, 68)",color:"white",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
          >
        구분
        </th>
        <th
        colSpan={1}
        style={{minWidth:"270px",border: "1px solid rgb(72, 68, 68)",color:"white",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR" }}
        >
        측정기명
        </th>        
        <th
        colSpan={1}
        style={{border: "1px solid rgb(72, 68, 68)",minWidth:"70px" ,color:"white",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
        >
        엑셀 자료
        </th>  
        <th
        colSpan={1}
        style={{ minWidth:"72px",border: "1px solid rgb(72, 68, 68)",color:"white",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
        >
        서버 구분
        </th>      
        <th
        colSpan={1}
        style={{minWidth:"80px",border: "1px solid rgb(72, 68, 68)",color:"white",fontSize:"16px",fontFamily:"Noto Sans KR",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
        >
        PM10
        </th>
        <th
        colSpan={1}
        style={{minWidth:"80px",border: "1px solid rgb(72, 68, 68)",color:"white",fontSize:"16px",fontFamily:"Noto Sans KR",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
          >
        PM2.5
        </th>
        <th
        colSpan={1}
        style={{minWidth:"80px", border: "1px solid rgb(72, 68, 68)",color:"white",fontSize:"16px",fontFamily:"Noto Sans KR",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
          >
        CO2
        </th>
        <th
        colSpan={1}
        style={{minWidth:"80px",border: "1px solid rgb(72, 68, 68)",color:"white",fontSize:"16px",fontFamily:"Noto Sans KR",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
        >
        HCHO
        </th>
        <th
        colSpan={1}
        style={{minWidth:"80px", border: "1px solid rgb(72, 68, 68)",color:"white",fontSize:"16px",fontFamily:"Noto Sans KR",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
        >
        VOCS
        </th>
        <th
        colSpan={1}
        style={{minWidth:"80px", border: "1px solid rgb(72, 68, 68)",color:"white",fontSize:"16px",fontFamily:"Noto Sans KR",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
        >
        온도
        </th>
        <th
        colSpan={1}
        style={{minWidth:"80px", border: "1px solid rgb(72, 68, 68)",color:"white",fontSize:"16px",fontFamily:"Noto Sans KR",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
        >
        습도
        </th>
        <th
        colSpan={1}
        style={{ minWidth:"80px",border: "1px solid rgb(72, 68, 68)",color:"white",fontSize:"16px",fontFamily:"Noto Sans KR",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
        >
        소음
        </th>
        <th
        colSpan={1}
        style={{ minWidth:"80px",border: "1px solid rgb(72, 68, 68)",color:"white",fontSize:"16px",fontFamily:"Noto Sans KR",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
        >
        CO
        </th>
        <th
        colSpan={1}
        style={{minWidth:"179px",border: "1px solid rgb(72, 68, 68)",color:"white",fontSize:"16px",fontFamily:"Noto Sans KR",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
        >
        최종 측정시간
        </th>
        <th
        colSpan={1}
        style={{minWidth:"109px",border: "1px solid rgb(72, 68, 68)",color:"white",fontSize:"16px",fontFamily:"Noto Sans KR",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
        >
        분
        </th>
        <th
        colSpan={1}
        style={{minWidth:"133px",border: "1px solid rgb(72, 68, 68)",color:"white",fontSize:"16px",fontFamily:"Noto Sans KR",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
        >
        시간
        </th>
        <th
        colSpan={1}
        style={{minWidth:"123px",border: "1px solid rgb(72, 68, 68)",color:"white",fontSize:"16px",fontFamily:"Noto Sans KR",backgroundColor: "rgb(37, 36, 36)",fontFamily:"Noto Sans KR"}}
        >
        일
        </th>
        </tr>
        
    </thead>
        <tbody
          style={{ height: this.state.height,backgroundColor:'#1f2025',width:"100%"}}>
          {this.props.allTimeRecentData &&
            this.props.allTimeRecentData.map((contact, i) => {
              if (
                this.state.sorting === "all" || 
                this.state.sorting === contact.branchName
              ) {
                var deviceCode = this.props.authUser.deviceCode;
                var param_deviceId = this.props.authUser.param_deviceId;// by kod
                var today = new Date(Date.now());
                var deviceTime = new Date(contact.v_MEASURED_AT);
                var vi = '★' + "　";
                var days =(today.getTime() - deviceTime.getTime()) / (1000 * 60 * 60 * 24);
                var LastDeviceTime = deviceTime.getUTCFullYear() +"/"+ (deviceTime.getUTCMonth() + 1) + "/"+ deviceTime.getUTCDate() 
                + "  "+ deviceTime.getUTCHours() + "시 " + deviceTime.getUTCMinutes() + "분 ";
                var start_date;
                start_date = new Date();
                start_date = start_date.getFullYear() + "-" + (start_date.getMonth() +  1) + "-" + (start_date.getDate() - 1 );
                var end_date;
                end_date = new Date();
                end_date = end_date.getFullYear() + "-" + (end_date.getMonth() + 1) + "-" + end_date.getDate();

                var v1ExcelDownload = () => {
                // IE
                if (navigator.msSaveBlob) {
                  param_deviceId = encodeURIComponent(param_deviceId);
                }
                let url = 'http://smart.aircok.com:11112/excel/download4exception?device_id=' + param_deviceId + 
                '&start_date=' + start_date + '&end_date=' + end_date + '&measure_cycle=' + this.state.measureCycle;
                (function(url) {
                  // IE
                  if (navigator.msSaveBlob) {
                    window.open(url);
                    
                  }
                  // IE 외의 웹브라우저
                  else {
                    let a = document.createElement("a");
                    a.style = "display: none";
                    a.title = param_deviceId;
                    a.fileName = param_deviceId + 'xls';
                    a.href = url;
                    a.download = param_deviceId;
                    a.target = '_self';
                    a.click();  
                  }
                })(url);
                setTimeout(function() {
                    alert('파일 다운로드를 시작합니다.');
                  }, 0);
                }  ;
                var v2ExcelDownload = () => {
                 // IE
                if (navigator.msSaveBlob) {
                  param_deviceId = encodeURIComponent(param_deviceId);
                }
                let url = 'http://smart.aircok.com:13701/report/getChartDataByDateByGet?serialNumber=' + param_deviceId + 
                '&startDate=' + start_date + '&endDate=' + end_date ;
                (function(url) {
                  // IE
                  if (navigator.msSaveBlob) {
                    window.open(url);
                  }
                  // IE 외의 웹브라우저
                  else {
                    let a = document.createElement("a");
                    a.style = "display: none";
                    a.title = param_deviceId;
                    a.fileName = param_deviceId + 'xls';
                    a.href = url;
                    a.download = param_deviceId;
                    a.target = '_self';
                    a.click();  
                  }
                })(url);
              
                setTimeout(function() {
                    alert('파일 다운로드를 시작합니다.');
                  }, 0);
                }  ;
              
                if (this.props.authUser.userType === "monitoring")
                deviceCode = this.props.authUser.deviceCode;
                else { 
                      deviceCode  = contact.deviceCode;
                      param_deviceId = contact.deviceId;  // by kod
                }
                return (
                  <tr key={i}
                  style={{ height: `${tableLineHeight}px` ,backgroundColor:'#1a1818',color:'white'}}>
                    <td style={{ minWidth: '98px' , columnSpan:"2",border: "1px solid #484444" , fontSize: "12px",fontFamily:"Noto Sans KR" }}>
                      {contact.v_IMPT == 0 ? i+1: 
                      <p style={{color : '#4ce682'}}>{vi + i}</p>}
                    </td>
                    <td style={{ minWidth: '122px' ,columnSpan:"2", border: "1px solid #484444" , fontSize: "12px",fontFamily:"Noto Sans KR" }}> 
                      {contact.branchName}  
                      {/* 구분 */}
                    </td>
                    <td style={{ minWidth: '270px' ,columnSpan:"2",  border: "1px solid #484444" , fontSize: "12px",fontFamily:"Noto Sans KR" }}>
                      {days > 1 ? (
                        contact.deviceName //측정기명
                      ) : (
                        <a >
                          {contact.deviceName}
                        </a>
                      )}
                    </td>   
                    <td style={{ minwidth: '40px' , columnSpan:"2", border: "1px solid #484444" , fontSize: "12px",fontFamily:"Noto Sans KR" }}>                      
                        <a style={{  color: '#94ceeb' }}
                          onClick={(e) => contact.v_GUBUN == 1 ? 
                            v1ExcelDownload() : v2ExcelDownload()}>다운로드
                        </a>                             
                    </td>    
                    <td style={{ minwidth: "72px" ,columnSpan:"2", border: "1px solid #484444" }}>
                      <span >
                        {contact.v_GUBUN}
                      </span>
                    </td>
                    <SensorData
                    sensorData={contact.v_PM10 > 500 ? 
                      <p style={{color : "#d9712b" ,fontSize:"16px",fontFamily:"Noto Sans KR"}}>
                      {contact.v_PM10} 
                      </p>:
                      <p style={{color : "#289ed7"}}>
                      {contact.v_PM10 > -99 ? contact.v_PM10 : null} 
                      </p>
                      }
                      />
                    <SensorData
                    sensorData={contact.v_PM25 > 500 ? 
                      <p style={{color : "#d9712b" ,fontSize:"16px",fontFamily:"Noto Sans KR"}}>
                      {contact.v_PM25} 
                      </p>:
                      <p style={{color : "#289ed7"}}>
                      {contact.v_PM25 > -99 ? contact.v_PM25 : null} 
                      </p>
                      }
                      />
                    <SensorData
                      sensorData={contact.v_CO2 > 5000 ? 
                        <p style={{color : "#d9712b" ,fontSize:"16px",fontFamily:"Noto Sans KR"}}>
                        {contact.v_CO2} 
                        </p>:
                        <p style={{color : "#289ed7"}}>
                        {contact.v_CO2 > -99 ? contact.v_CO2 : null} 
                        </p>
                        }
                      />
                    <SensorData
                      sensorData={contact.v_HCHO > 1000 ? 
                        <p style={{color : "#d9712b" ,fontSize:"16px",fontFamily:"Noto Sans KR"}}>
                        {contact.v_HCHO} 
                        </p>:
                        <p style={{color : "#289ed7"}}>
                        {contact.v_HCHO > -99 ? contact.v_HCHO : null} 
                        </p>
                        }
                      />
                    <SensorData 
                      sensorData={contact.v_VOC > 5000 ? 
                        <p style={{color : "#d9712b" ,fontSize:"16px",fontFamily:"Noto Sans KR"}}>
                        {contact.v_VOC} 
                        </p>:
                        <p style={{color : "#289ed7"}}>
                        {contact.v_VOC > -99 ? contact.v_VOC : null} 
                        </p>
                        }
                      />
                    <SensorData
                      sensorData={contact.v_TEMPERATURE > 60 ? 
                        <p style={{color : "#d9712b" ,fontSize:"16px",fontFamily:"Noto Sans KR"}}>
                        {Math.floor(contact.v_TEMPERATURE)} 
                        </p>:
                      <p style={{color : "#289ed7"}}>
                        {contact.v_TEMPERATURE > -99 ? Math.floor(contact.v_TEMPERATURE) : null} 
                        </p>
                        }
                        />
                    <SensorData
                      sensorData={contact.v_HUMIDITY > 70 ? 
                        <p style={{color : "#d9712b" ,fontSize:"16px",fontFamily:"Noto Sans KR"}}>
                        {Math.floor(contact.v_HUMIDITY)} 
                        </p>:
                      <p style={{color : "#289ed7"}}>
                        {contact.v_HUMIDITY > -99 ? Math.floor(contact.v_HUMIDITY) : null} 
                        </p>
                        }
                    />
                    <SensorData
                        sensorData={contact.v_NOISE > 32 ? 
                          <p style={{color : "#d9712b" ,fontSize:"16px",fontFamily:"Noto Sans KR"}}>
                          {contact.v_NOISE} 
                          </p>:
                        <p style={{color : "#289ed7"}}>
                          {contact.v_NOISE > -99 ? contact.v_NOISE : null} 
                          </p>
                          }
                      />
                    <SensorData
                        sensorData={contact.v_CO > 100 ? 
                          <p style={{color : "#d9712b" ,fontSize:"16px",fontFamily:"Noto Sans KR"}}>
                          {contact.v_CO} 
                          </p>:
                        <p style={{color : "#289ed7"}}>
                          {contact.v_CO > -99 ? contact.v_CO : null} 
                          </p>
                          }
                          />
                      <th style={{border:"1px solid #484444" ,fontSize:"13px",width: "180px" , textAlign:"center",fontFamily:"Noto Sans KR"}}>  
                      <p >{LastDeviceTime}</p>
                      </th>
                      <th style={{border:"1px solid #484444" ,fontSize:"13px",width: "106px" , textAlign:"center",fontFamily:"Noto Sans KR"}}>  
                      <p id= "v_M">{contact.v_M > 5 ?  
                      <p style={{color : "#8181C3" ,width: "106px",fontSize:"16px",fontFamily:"Noto Sans KR", textAlign:"center"}}>
                      {contact.v_M == null  ?  null : contact.v_M + "분 "} 
                      </p> : 
                      <p style={{color : "white" ,width: "106px" , textAlign:"center"}}>
                      {contact.v_M ==  null  ?  null :  contact.v_M + "분 "} 
                      </p>
                      }  
                      </p>
                      </th>
                      <th style={{border:"1px solid #484444" ,fontSize:"13px",width: "132px" ,textAlign:"center",fontFamily:"Noto Sans KR"}}> 
                      <p id= "v_H">{ contact.v_H ==  null  ?  null :  contact.v_H + " 시간 "}
                      </p>
                      </th>
                      <th style={{border:"1px solid #484444" ,fontSize:"13px",width: "106px",textAlign:"center",fontFamily:"Noto Sans KR"}}>
                      <p id= "v_D">{contact.v_D ==  null  ?  null : + contact.v_D + " 일 "}
                      </p>
                      </th>

                      </tr>
                      );
                    }
                    })}
                </tbody>
        </table>
      </div>
    );
  }
}
const mapStateToProps = ({  auth, recentData, system }) => {
  const { authUser } = auth;
  const { timeMonitoringRecentData, allTimeRecentData } = recentData;
  const { data } = system;
  return {
    authUser,
    timeMonitoringRecentData,
    allTimeRecentData,
    data
  };
};
export default connect(
  mapStateToProps,
  {
    showAuthLoader,
    allTimeRecentDataRequest,
    timeMonitoringRecentDataRequest,
    systemListRequest,
  }
)(MonitoringPage);
