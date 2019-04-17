import React from "react";
import { connect } from "react-redux";
import { alarmReferenceValueRequest } from "actions/AlarmReference";
import { showAuthLoader } from "actions/Auth";
import { allRecentDataRequest, monitoringRecentDataRequest } from "actions/RecentData";
import { systemListRequest } from "actions/System";
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
    if (this.props.authUser.userType === "monitoring") this.props.monitoringRecentDataRequest(this.props.authUser.deviceList);
    else this.props.allRecentDataRequest(this.props.authUser.positionList);
    this.pageScroll = this.pageScroll.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadDataintervalLoadDataHandle = setInterval(this.loadData, 60000);
    this.intervalScrollHandle = setInterval(this.pageScroll, this.props.data.scrollTime * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalScrollHandle);
    clearInterval(this.loadDataintervalLoadDataHandle);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data.scrollTime !== nextProps.data.scrollTime) {
      if (this.intervalScrollHandle) clearInterval(this.intervalScrollHandle);
      this.intervalScrollHandle = setInterval(this.pageScroll, nextProps.data.scrollTime * 1000);
    }
  }

  pageScroll() {
    var objDiv = document.getElementById("contain");
    var scrollHeight = 55 * this.props.data.scrollRow; // tableHeight
    if (objDiv.scrollHeight - objDiv.scrollTop - objDiv.clientHeight > scrollHeight) objDiv.scrollTop = objDiv.scrollTop + scrollHeight;
    else if (objDiv.scrollHeight - objDiv.scrollTop - objDiv.clientHeight > 0)
      objDiv.scrollTop = objDiv.scrollTop + (objDiv.scrollHeight - objDiv.clientHeight);
    else if (objDiv.scrollTop == objDiv.scrollHeight - objDiv.clientHeight) {
      objDiv.scrollTop = 0;
    }
  }

  loadData() {
    if (this.props.authUser.userType === "monitoring") this.props.monitoringRecentDataRequest(this.props.authUser.deviceList);
    else this.props.allRecentDataRequest(this.props.authUser.positionList);
  }

  render() {
    const nameTabWidth = "170px";
    const indexTabWidth = "120px";

    const getClassText = (grade) => {
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
      <div className="app-wrapper" style={{ overflowX: "auto" }}>
        <table className="table table-fixed">
          <MainTableHead />
          <tbody id="contain" ref="contain">
            {this.props.allRecentData &&
              this.props.allRecentData.map((contact, i) => {
                let deviceList = null;
                if (this.props.authUser.userType === "monitoring") deviceList = this.props.authUser.deviceList;
                else deviceList = contact.deviceSN;
                return (
                  <tr key={i}>
                    <td style={{ width: `${nameTabWidth}` }}>{contact.buildingName}</td>
                    <td style={{ width: `${nameTabWidth}` }}>
                      <a href={"#/app/device-detail/" + deviceList}>{contact.positionName}</a>
                    </td>
                    <td style={{ width: `${indexTabWidth}` }}>
                      <span className={getClassText(contact.e3Index)}>
                        {qualityType[`${contact.e3Index}`]}({contact.e3Score})
                      </span>
                    </td>
                    <SensorData
                      alarmReferenceValue={this.props.alarmReferenceValue.temperature}
                      sensorData={contact.temperature}
                      sensorIndex={contact.temperatureIndex}
                      sensorAlarm={contact.temperatureAlarm}
                    />
                    <SensorData
                      alarmReferenceValue={this.props.alarmReferenceValue.humidity}
                      sensorData={contact.humidity}
                      sensorIndex={contact.humidityIndex}
                      sensorAlarm={contact.humidityAlarm}
                    />
                    <SensorData
                      alarmReferenceValue={this.props.alarmReferenceValue.pm10}
                      sensorData={contact.pm10}
                      sensorIndex={contact.pm10Index}
                      sensorAlarm={contact.pm10Alarm}
                    />
                    <SensorData
                      alarmReferenceValue={this.props.alarmReferenceValue.pm25}
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
                      alarmReferenceValue={this.props.alarmReferenceValue.hcho}
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
                      alarmReferenceValue={this.props.alarmReferenceValue.voc}
                      sensorData={contact.noise}
                      sensorIndex={contact.noiseIndex}
                      sensorAlarm={contact.noiseAlarm}
                    />
                    <td style={{ width: "60px" }}>
                      <div>
                        <img src="assets/icons/sms.jpg" style={{ width: "30px", height: "30px" }} alt="sms" title="SMS Icon" />
                      </div>
                    </td>
                  </tr>
                );
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
    systemListRequest
  }
)(SamplePage);
