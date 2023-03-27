import React from "react";
import { connect } from "react-redux";
import { alarmReferenceValueRequest } from "actions/AlarmReference";
import { showAuthLoader } from "actions/Auth";
import {
  allRecentDataRequest,
  monitoringRecentDataRequest,
  outdoorDustDataRequest,
  outdoorWeatherDataRequest
} from "actions/RecentData";
import { systemListRequest } from "actions/System";
import { sendSMS, sendLMS } from "actions/SMS";
import MainTableHead from "./mainTableHead_newjelly";
import SensorData from "./sensorData";



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
    this.props.alarmReferenceValueRequest();
    this.props.systemListRequest({ id: "1" });
    if (this.props.authUser.userType === "monitoring")
      this.props.monitoringRecentDataRequest(this.props.authUser.deviceList);
    else 
    this.props.allRecentDataRequest(this.props.authUser.positionList);
    this.pageScroll = this.pageScroll.bind(this);
    this.handleSortingChange = this.handleSortingChange.bind(this);
    
    this.state = {
      uniqBuildingName: [],
      sorting: "all",
      height: window.innerHeight,
      width: window.innerWidth,
      index: 0,
    };
    this.loadData = this.loadData.bind(this);
    this.scrollDevice = this.scrollDevice.bind(this);
    if (this.props.allRecentData[0]) {
      var latitude = this.props.allRecentData[this.state.index].latitude;
      var longitude = this.props.allRecentData[this.state.index].longitude;

      this.props.outdoorDustDataRequest({ latitude, longitude });
      this.props.outdoorWeatherDataRequest({ latitude, longitude });
    }
  }

  componentDidMount() {
    this.loadDataintervalLoadDataHandle = setInterval(this.loadData, 60000);
    this.intervalScrollHandle = setInterval(
      this.pageScroll,
      this.scrollDevice,
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

    if (this.props.allRecentData !== nextProps.allRecentData) {
      var uniqBuildingName = nextProps.allRecentData.reduce(function(a, b) {
        if (a.indexOf(b.buildingName) < 0) a.push(b.buildingName);
        return a;
      }, []);

      // console.log(uniqBuildingName);
      this.setState({ uniqBuildingName: uniqBuildingName });
    }
   
  }

  scrollDevice() {
    let i = this.state.index;
    if (this.state.deviceCnt - 1 !== this.state.index) i++;
    else i = 0;

    if (this.state.index !== i) {
      var latitude = this.props.allRecentData[this.state.index].latitude;
      var longitude = this.props.allRecentData[this.state.index].longitude;
      this.props.outdoorDustDataRequest({ latitude, longitude });
      this.props.outdoorWeatherDataRequest({ latitude, longitude });
    }

    this.setState({
      index: i
    });
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
      this.props.monitoringRecentDataRequest(this.props.authUser.deviceList);
    else if (this.props.allRecentDataRequest(this.props.authUser.positionList));
  }

  
  onDetailView4Jelly = (deviceList,param_deviceId,outdoorDustData,outdoorDustData1) => {
    console.log(param_deviceId); 
    console.log(deviceList);
    console.log(outdoorDustData); 
    console.log(outdoorDustData1);
    
    window.open("/newjelly/index.html?devId="+param_deviceId+"&sn="+deviceList );
  };


  
  
  render() {
    const formWidth = "300px";
    const nameTabWidth = "150px";
    const indexTabWidth = "250px";
    const smsTabWidth = "60px";
    var count1 = 0;
    var count2  = count1;
    var count3 = count2.length;
    
    const getClassText = grade => {
      let classText = "text-good";
      if (grade == 1) classText = "text-good";
      else if (grade == 2) classText = "text-normal";
      else if (grade == 3) classText = "text-sensitive1";
      else if (grade == 4) classText = "text-sensitive2";
      else if (grade == 5) classText = "text-bad";
      else if (grade == 6) classText = "text-very-bad";
      return classText;
    };

    return (
      <div
        id="contain"
        style={{
          backgroundColor: "#17181D",
          fontSize: '14px',
          // overflowX: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "26px",
        }}
      >
        <div className="col-2 pl-0 building-filter">
          {this.state.uniqBuildingName.length ? (
            <form style={{ width: `${nameTabWidth}`}}>
              <select
                className="form-control"
                name="sorting"
                value={this.state.sorting}
                onChange={this.handleSortingChange}
                style={{ backgroundColor: '#595868',
                color: 'rgb(251 251 251)'
                ,marginTop:'34px'
                ,fontWeight:"bold"
                ,fontSize:"12px"
                ,marginLeft:"150px"
                ,border:"1px solid #595868"
              }}
              >
                <option value="all" style={{fontFamily: "Noto Sans KR"}}>==지점선택==</option>
                {this.state.uniqBuildingName.map(name => {
                  return (
                    <option key={name} value={name} style={{width: `${nameTabWidth}`,fontWeight: "400",fontFamily: "Noto Sans KR"}}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </form>
          ) : null}
        </div>

      <table style={{marginTop:"10px",marginLeft:"156px"}}>
        <thead>
        <tr>
        <th
          rowSpan={2}
          style={{fontFamily: "Noto Sans KR",fontSize:"11px", fontWeight: "400",borderRight: "1px solid rgb(72, 68, 68)",color:"white",minWidth:"170px",backgroundColor: "rgb(37 36 36)"}}
        >
          구분
        </th>
        <th
          rowSpan={2}
          style={{fontFamily: "Noto Sans KR",fontSize:"11px",fontWeight: "400",borderRight: "1px solid rgb(72, 68, 68)",color:"white",minWidth:"182px",backgroundColor: "rgb(37 36 36)"}}
        >
          측정기명
        </th>
        <th
          rowSpan={2}
          style={{fontFamily: "Noto Sans KR",fontSize:"11px",fontWeight: "400",borderRight: "1px solid rgb(72, 68, 68)",color:"white",minWidth:"105px",backgroundColor: "rgb(37 36 36)"}}
        >
          공기질
          <br />
          관리지수
        </th>
        <th
          colSpan={3}
          style={{fontFamily: "Noto Sans KR",fontSize:"11px",fontWeight: "400",borderRight: "1px solid rgb(72, 68, 68)",color:"white",minWidth:"124px",backgroundColor: "rgb(37 36 36)"}}
        >
          온도
          <br />
          (℃)
        </th>
        <th
          colSpan={3}
          style={{fontFamily: "Noto Sans KR",fontSize:"11px",fontWeight: "400",borderRight: "1px solid rgb(72, 68, 68)",color:"white",minWidth:"124px",backgroundColor: "rgb(37 36 36)"}}
        >
          습도
          <br />
          (%)
        </th>
        <th
          colSpan={3}
          style={{fontFamily: "Noto Sans KR",fontSize:"11px",fontWeight: "400",borderRight: "1px solid rgb(72, 68, 68)",color:"white" ,minWidth:"124px",backgroundColor: "rgb(37 36 36)"}}
        >
          미세먼지(PM10)
          <br />
          (㎍/㎥)
        </th>
        <th
          colSpan={3}
          style={{fontFamily: "Noto Sans KR",fontSize:"11px",fontWeight: "400",borderRight: "1px solid rgb(72, 68, 68)",color:"white",minWidth:"124px",backgroundColor: "rgb(37 36 36)"}}
        >
          초미세먼지(PM2.5)
          <br />
          (㎍/㎥)
        </th>
        <th
          colSpan={3}
          style={{fontFamily: "Noto Sans KR",fontSize:"11px",fontWeight: "400",borderRight: "1px solid rgb(72, 68, 68)",color:"white",minWidth:"124px",backgroundColor: "rgb(37 36 36)"}}
        >
          이산화탄소(CO2)
          <br />
          (ppm)
        </th>
        <th
          colSpan={3}
          style={{fontFamily: "Noto Sans KR",fontSize:"11px",fontWeight: "400",borderRight: "1px solid rgb(72, 68, 68)",color:"white",minWidth:"124px",backgroundColor: "rgb(37 36 36)"}}
        >
          포름알데히드(HCHO)
          <br />
          (㎍/㎥)
        </th>
        <th
          colSpan={3}
          style={{fontFamily: "Noto Sans KR",fontSize:"11px",fontWeight: "400",borderRight: "1px solid rgb(72, 68, 68)",color:"white",minWidth:"124px",backgroundColor: "rgb(37 36 36)"}}
        >
          휘발성유기화합물(VOCs)
          <br />
          (ppb)
        </th>
        <th
          colSpan={3}
          style={{fontFamily: "Noto Sans KR",fontSize:"11px",fontWeight: "400", borderRight: "1px solid rgb(72, 68, 68)",color:"white",minWidth:"124px",backgroundColor: "rgb(37 36 36)"}}
        >
          소음
          <br />
          (db)
        </th>
        <th
          colSpan={3}
          style={{fontFamily: "Noto Sans KR",fontSize:"11px",fontWeight: "400", borderRight: "1px solid rgb(72, 68, 68)",color:"white",minWidth:"124px",backgroundColor: "rgb(37 36 36)"}}
        >
          일산화탄소(CO)
          <br />
          (ppb)
        </th>
        <th
          colSpan={3}
          style={{fontFamily: "Noto Sans KR",fontSize:"11px",fontWeight: "400", borderRight: "1px solid rgb(72, 68, 68)",color:"white",minWidth:"134px",backgroundColor: "rgb(37 36 36)"}}
        >
          측정 시간
          <br />
        </th>
      </tr>
    </thead>
   
          <tbody
            style={{ height: "754px"}}> 

            {/* style={{ height: this.state.height}}> */}
            {this.props.allRecentData &&
              this.props.allRecentData.map((contact, i) => {
                if (
                  this.state.sorting === "all" ||
                  this.state.sorting === contact.buildingName
                ) {
                  let deviceList = this.props.authUser.deviceList;
                  let param_deviceId = this.props.authUser.param_deviceId;
                  let buildingName = this.props.authUser.buildingName;
                  let mincount = this.props.allRecentData.length;
                  // let today1 = contact.date.replace(/([^T]+)T([^\.]+).*/g, "$1 $2").slice(0, -3) + ":00";
                  let today = new Date(Date.now());
                  let toda = contact.date;
                  let deviceTime = new Date(contact.date);
                  let deviceTime1 = new Date(deviceTime.setMinutes(deviceTime.getMinutes()));
                  var days =
                  (contact.id == '1551' || contact.id == '1692') ? 
                   0 : (today.getTime() - deviceTime.getTime()) / (1000 * 60 * 60 * 24)  ///잠실초 제한 해제
                  let outdoorDustData = this.props.outdoorDustData.pm10Value;
                  let outdoorDustData1 = this.props.outdoorDustData.pm25Value;
             
                  ;
                  var loadDt11 = new Date();
                  var loadDt111 = new Date(contact.date);
                  let days1 = loadDt111-loadDt11;

                    if( days1 < 30600000 || loadDt111 == '0000-00-00 00:00:00' || days1 < 0){
                      count1++; 
                    }

                   // 34200000
                  // var loadDt11 = new Date('2021-07-06 08:20:00');
                  // var loadDt111 = new Date('2021-07-05 22:50:00');
           
                  if (this.props.authUser.userType === "monitoring")
                    deviceList = this.props.authUser.deviceList;
                    else { 
                      deviceList = contact.deviceSN;
                      param_deviceId = contact.id; 
                      buildingName = contact.buildingName;

                      outdoorDustData = this.props.outdoorDustData.pm10Value;
                      outdoorDustData1 = this.props.outdoorDustData.pm25Value;
                    }
                  return (
                    <tr key={i} style={{ height: `${tableLineHeight}px`}} >
                      
                      <td 
                        style={{  fontFamily: "Noto Sans KR",border: "1px solid rgb(72, 68, 68)",backgroundColor:"#1A1818",minWidth:"170px",color:"white"}}>
                        {contact.buildingName}
                      </td>
                      <td 
                      style={{fontFamily: "Noto Sans KR",backgroundColor:"#1A1818",border: "1px solid rgb(72, 68, 68)",minWidth:"182px",color:"white",fontSize:"13px"}}>                      
                        {days > 1 ? (
                          
                          (contact.deviceName)
                        ) : (
                          <a 
                          style={{color: '#289ed7',minWidth:"182px"}}
                           onClick={(e) => this.onDetailView4Jelly(deviceList,param_deviceId)}>
                            {contact.deviceName}
                          </a>        
                          )} 
                      </td>                                     
                      <td 
                      style={{fontFamily: "Noto Sans KR",backgroundColor:"#1A1818",border: "1px solid rgb(72, 68, 68)",minWidth:"105px",fontSize:"12px"}}>
                        <span className={getClassText(contact.e3Index)}>
                          {qualityType[`${contact.e3Index}`]}({contact.e3Score})
                        </span>
                      </td>
                      <SensorData
                        // alarmReferenceValue={
                        //   this.props.alarmReferenceValue.temperature
                        // }
                        sensorData={contact.temperature} 
                        sensorIndex={contact.temperatureIndex}
                        // sensorAlarm={contact.temperatureAlarm}
                      />
                      <SensorData
                        sensorData={contact.humidity}
                        sensorIndex={contact.humidityIndex}
                      />
                      <SensorData
                        sensorData={contact.pm10}
                        sensorIndex={contact.pm10Index}
                      />
                      <SensorData
                        sensorData={contact.pm25}
                        sensorIndex={contact.pm25Index}
                      />
                      <SensorData
                        sensorData={contact.co2}
                        sensorIndex={contact.co2Index}
                      />
                      <SensorData
                        sensorData={contact.hcho}
                        sensorIndex={contact.hchoIndex}
                      />
                      <SensorData
                        sensorData={contact.voc}
                        sensorIndex={contact.vocIndex}
                      />
                      <SensorData
                       
                        sensorData={contact.noise}
                        sensorIndex={contact.noiseIndex}
                      />
                      <SensorData
                        sensorData={contact.co}
                        sensorIndex={contact.coIndex}
                      />
                         <td style={{minWidth:"134px",color:"white",border: "1px solid rgb(72, 68, 68)",fontFamily: "Noto Sans KR",fontSize:"12px"}}>
                         {
                         days1 < 30600000 || loadDt111 == '0000-00-00 00:00:00' || days1 < 0 ? 
                         <td style={{minWidth:"134px",color:"rgb(70 137 169)",fontFamily: "Noto Sans KR",fontSize:"12px"}}>{contact.date.replace(/([^T]+)T([^\.]+).*/g, "$1 $2").slice(0, -3) + ":00"}</td> 
                         : 
                         contact.date.replace(/([^T]+)T([^\.]+).*/g, "$1 $2").slice(0, -3) + ":00"
                          }
                         </td>
                    </tr>
                  );
                }
                // {/*  }
              })}
              </tbody>
              <p id='test' style={{color:"white",marginLeft:"155px",fontFamily: "Noto Sans KR",fontSize:"12px",marginTop:"-839px"}}>{"등록 디바이스 수 "+this.props.allRecentData.length + " / " + "통신 지연 " + count1 }</p>
        </table>
      </div>
    );
  }
}

const mapStateToProps = ({ alarmReference, auth, recentData, system }) => {
  const { alarmReferenceValue } = alarmReference;
  const { authUser } = auth;
  const { allRecentData,monitoringRecentData,outdoorDustData,outdoorWeatherData} = recentData;
  const { data } = system;
  return {
    alarmReferenceValue,
    authUser,
    allRecentData,
    monitoringRecentData,
    data,
    outdoorDustData, 
    outdoorWeatherData
  };
};
export default connect(
  mapStateToProps,
  {
    alarmReferenceValueRequest,
    showAuthLoader,
    allRecentDataRequest,
    monitoringRecentDataRequest,
    systemListRequest,
    sendSMS,
    sendLMS,
    outdoorDustDataRequest,
    outdoorWeatherDataRequest
  }
)(MonitoringPage);




