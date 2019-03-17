import React from "react";
import { connect } from "react-redux";
import { alarmReferenceValueRequest } from "actions/AlarmReference";
import { showAuthLoader } from "actions/Auth";
import { recentDataRequest } from "actions/RecentData";
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
    this.props.recentDataRequest(this.props.authUser.PositionList);
    this.pageScroll = this.pageScroll.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.scrollIntervalHandle = setInterval(this.pageScroll, 30000);
    this.loadDataIntervalHandle = setInterval(this.loadData, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.scrollIntervalHandle);
    clearInterval(this.loadDataIntervalHandle);
  }

  pageScroll() {
    var objDiv = document.getElementById("contain");
    if (objDiv.scrollHeight - objDiv.scrollTop - objDiv.clientHeight > 100)
      objDiv.scrollTop = objDiv.scrollTop + 100;
    else if (objDiv.scrollHeight - objDiv.scrollTop - objDiv.clientHeight > 0)
      objDiv.scrollTop =
        objDiv.scrollTop + (objDiv.scrollHeight - objDiv.clientHeight);
    else if (objDiv.scrollTop == objDiv.scrollHeight - objDiv.clientHeight) {
      objDiv.scrollTop = 0;
    }
  }

  loadData() {
    this.props.recentDataRequest(this.props.authUser.PositionList);
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
      <div className="app-wrapper" style={{ overflowX: "auto" }}>
        <table className="table table-fixed">
          <MainTableHead />
          <tbody id="contain" ref="contain">
            {this.props.contactData.map((contact, i) => {
              return (
                <tr key={i}>
                  <td style={{ width: `${nameTabWidth}` }}>{contact.BuildingName}</td>
                  <td style={{ width: `${nameTabWidth}` }}>{contact.PositionName}</td>
                  <td style={{ width: `${indexTabWidth}` }}>
                    <span className={getClassText(contact.E3Index)}>
                      {qualityType[`${contact.E3Index}`]}({contact.E3Score})
                    </span>
                  </td>
                  <SensorData
                    alarmReferenceValue={
                      this.props.alarmReferenceValue.temperature
                    }
                    sensorData={contact.Temperature}
                    sensorIndex={contact.TemperatureIndex}
                    sensorAlarm={contact.TemperatureAlarm}
                  />
                  <SensorData
                    alarmReferenceValue={
                      this.props.alarmReferenceValue.humidity
                    }
                    sensorData={contact.Humidity}
                    sensorIndex={contact.HumidityIndex}
                    sensorAlarm={contact.HumidityAlarm}
                  />
                  <SensorData
                    alarmReferenceValue={this.props.alarmReferenceValue.pm10}
                    sensorData={contact.PM10}
                    sensorIndex={contact.PM10Index}
                    sensorAlarm={contact.PM10Alarm}
                  />
                  <SensorData
                    alarmReferenceValue={this.props.alarmReferenceValue.pm25}
                    sensorData={contact.PM25}
                    sensorIndex={contact.PM25Index}
                    sensorAlarm={contact.PM25Alarm}
                  />
                  <SensorData
                    alarmReferenceValue={this.props.alarmReferenceValue.co2}
                    sensorData={contact.CO2}
                    sensorIndex={contact.CO2Index}
                    sensorAlarm={contact.CO2Alarm}
                  />
                  <SensorData
                    alarmReferenceValue={this.props.alarmReferenceValue.hcho}
                    sensorData={contact.HCHO}
                    sensorIndex={contact.HCHOIndex}
                    sensorAlarm={contact.HCHOAlarm}
                  />
                  <SensorData
                    alarmReferenceValue={this.props.alarmReferenceValue.voc}
                    sensorData={contact.VOC}
                    sensorIndex={contact.VOCIndex}
                    sensorAlarm={contact.VOCAlarm}
                  />
                  <SensorData
                    alarmReferenceValue={this.props.alarmReferenceValue.voc}
                    sensorData={contact.Noise}
                    sensorIndex={contact.NoiseIndex}
                    sensorAlarm={contact.NoiseAlarm}
                  />
                  <td style={{ width: "60px" }}>
                    <div>
                      <img
                        src="/assets/images/sms.jpg"
                        style={{ width: "30px", height: "30px" }}
                        alt="sms"
                        title="SMS Icon"
                      />
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

const mapStateToProps = ({ alarmReference, auth, recentData }) => {
  const { alarmReferenceValue } = alarmReference;
  const { authUser } = auth;
  const { contactData } = recentData;
  return { alarmReferenceValue, authUser, contactData };
};
export default connect(
  mapStateToProps,
  { alarmReferenceValueRequest, showAuthLoader, recentDataRequest }
)(SamplePage);
