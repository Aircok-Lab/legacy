import React from "react";
import { connect } from "react-redux";
import { alarmReferenceValueRequest } from "actions/AlarmReference";
import { showAuthLoader } from "actions/Auth";
import {
  allRecentDataRequest,
  monitoringRecentDataRequest
} from "actions/RecentData";
import { systemListRequest } from "actions/System";
import { sendSMS, sendLMS } from "actions/SMS";
import MainTableHead from "../Monitoring/mainTableHead";
import SensorData from "../Monitoring/sensorData";

const qualityType = {
  1: "좋음",
  2: "보통",
  3: "약간나쁨",
  4: "나쁨",
  5: "매우나쁨",
  6: "최악"
};

class SamplePage extends React.Component {
  constructor(props) {
    super(props);
    this.props.showAuthLoader();
    this.props.alarmReferenceValueRequest();
    this.props.systemListRequest({ id: "1" });
    if (this.props.authUser.userType === "monitoring")
      this.props.monitoringRecentDataRequest(this.props.authUser.deviceList);
    else this.props.allRecentDataRequest(this.props.authUser.positionList);
    this.pageScroll = this.pageScroll.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleSortingChange = this.handleSortingChange.bind(this);
    this.state = {
      uniqBuildingName: [],
      sorting: "all",
      height: window.innerHeight,
      width: window.innerWidth
    };
  }

  componentDidMount() {
    this.loadDataintervalLoadDataHandle = setInterval(this.loadData, 60000);
    this.intervalScrollHandle = setInterval(
      this.pageScroll,
      this.props.data.scrollTime * 1000
    );
    console.log(this.state.height);
    console.log(this.state.width);
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

      console.log(uniqBuildingName);
      this.setState({ uniqBuildingName: uniqBuildingName });
    }
  }

  updateDimensions() {
    this.setState({
      height: window.innerHeight - 267,
      width: window.innerWidth
    });
    console.log(window.innerHeight);
    console.log(window.innerWidth);
  }

  handleSortingChange(event) {
    console.log(event.target.name);
    console.log(event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  }

  pageScroll() {
    var objDiv = document.getElementById("contain");
    var scrollHeight = 55 * this.props.data.scrollRow; // tableHeight
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
    else this.props.allRecentDataRequest(this.props.authUser.positionList);
  }

  render() {
    const nameTabWidth = "170px";
    const indexTabWidth = "120px";

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
        className="app-wrapper"
        style={{
          //width: "2188px",
          overflowX: "auto",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        <div
          className="col-2 pl-0"
          style={{
            maxWidth: "2140px",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          {this.state.uniqBuildingName.length ? (
            <form style={{ width: "250px" }}>
              <select
                className="form-control"
                name="sorting"
                value={this.state.sorting}
                onChange={this.handleSortingChange}
              >
                <option value="all">all</option>
                {this.state.uniqBuildingName.map(name => {
                  return (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </form>
          ) : null}
        </div>
        <table
          className="table table-fixed"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <MainTableHead />
          <tbody
            id="contain"
            ref="contain"
            style={{ width: "2140px", height: this.state.height }}
          >
            {this.props.allRecentData &&
              this.props.allRecentData.map((contact, i) => {
                if (
                  this.state.sorting === "all" ||
                  this.state.sorting === contact.buildingName
                ) {
                  let deviceList = null;
                  let today = new Date(Date.now());
                  let deviceTime = new Date(contact.date);

                  var days =
                    (today.getTime() - deviceTime.getTime()) /
                    (1000 * 60 * 60 * 24);

                  if (this.props.authUser.userType === "monitoring")
                    deviceList = this.props.authUser.deviceList;
                  else deviceList = contact.deviceSN;

                  return (
                    <tr key={i}>
                      <td style={{ width: `${nameTabWidth}` }}>
                        {contact.buildingName}
                      </td>
                      <td style={{ width: `${nameTabWidth}` }}>
                        {days > 1 ? (
                          contact.deviceName
                        ) : (
                          <a href={"#/app/device-detail/" + deviceList}>
                            {contact.deviceName}
                          </a>
                        )}
                      </td>
                      <td style={{ width: `${indexTabWidth}` }}>
                        <span className={getClassText(contact.e3Index)}>
                          {qualityType[`${contact.e3Index}`]}({contact.e3Score})
                        </span>
                      </td>
                      <SensorData
                        alarmReferenceValue={
                          this.props.alarmReferenceValue.temperature
                        }
                        sensorData={contact.temperature}
                        sensorIndex={contact.temperatureIndex}
                        sensorAlarm={contact.temperatureAlarm}
                      />
                      <SensorData
                        alarmReferenceValue={
                          this.props.alarmReferenceValue.humidity
                        }
                        sensorData={contact.humidity}
                        sensorIndex={contact.humidityIndex}
                        sensorAlarm={contact.humidityAlarm}
                      />
                      <SensorData
                        alarmReferenceValue={
                          this.props.alarmReferenceValue.pm10
                        }
                        sensorData={contact.pm10}
                        sensorIndex={contact.pm10Index}
                        sensorAlarm={contact.pm10Alarm}
                      />
                      <SensorData
                        alarmReferenceValue={
                          this.props.alarmReferenceValue.pm25
                        }
                        sensorData={contact.pm25}
                        sensorIndex={contact.pm25Index}
                        sensorAlarm={contact.pm25Alarm}
                      />
                      <SensorData
                        alarmReferenceValue={this.props.alarmReferenceValue.co2}
                        sensorData={contact.co2}
                        sensorIndex={contact.co2Index}
                        sensorAlarm={contact.co2Alarm}
                      />
                      <SensorData
                        alarmReferenceValue={
                          this.props.alarmReferenceValue.hcho
                        }
                        sensorData={contact.hcho}
                        sensorIndex={contact.hchoIndex}
                        sensorAlarm={contact.hchoAlarm}
                      />
                      <SensorData
                        alarmReferenceValue={this.props.alarmReferenceValue.voc}
                        sensorData={contact.voc}
                        sensorIndex={contact.vocIndex}
                        sensorAlarm={contact.vocAlarm}
                      />
                      <SensorData
                        alarmReferenceValue={
                          this.props.alarmReferenceValue.noise
                        }
                        sensorData={contact.noise}
                        sensorIndex={contact.noiseIndex}
                        sensorAlarm={contact.noiseAlarm}
                      />
                      <SensorData
                        alarmReferenceValue={this.props.alarmReferenceValue.co}
                        sensorData={contact.co}
                        sensorIndex={contact.coIndex}
                        sensorAlarm={contact.coAlarm}
                      />
                      <td style={{ width: "60px" }}>
                        <div>
                          <img
                            src="assets/icons/sms.jpg"
                            style={{ width: "30px", height: "30px" }}
                            alt="sms"
                            title="SMS Icon"
                            onClick={e => {
                              this.props.sendSMS(
                                contact.deviceSN,
                                contact.positionID
                              );
                            }}
                          />
                        </div>
                      </td>
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

const mapStateToProps = ({ alarmReference, auth, recentData, system }) => {
  const { alarmReferenceValue } = alarmReference;
  const { authUser } = auth;
  const { allRecentData, monitoringRecentData } = recentData;
  const { data } = system;
  return {
    alarmReferenceValue,
    authUser,
    allRecentData,
    monitoringRecentData,
    data
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
    sendLMS
  }
)(SamplePage);
