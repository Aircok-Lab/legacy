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
  }

  componentDidMount() {
    this.intervalHandle = setInterval(this.pageScroll, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandle);
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

  render() {
    const getClassAlarmIcon = alarm => {
      let classText = "";
      if (alarm == 1) classText = "bg-red rounded-circle mt-1 ml-2 mx-auto";
      console.log(classText);
      return classText;
    };

    const getClassText = grade => {
      let classText = "text-good";
      if (grade == 1) classText = "text-good";
      else if (grade == 2) classText = "text-normal";
      else if (grade == 3) classText = "text-sensitive1";
      else if (grade == 4) classText = "text-sensitive2";
      else if (grade == 5) classText = "text-bad";
      else if (grade == 6) classText = "text-very-bad";
      // console.log(classText);
      return classText;
    };
    return (
      <div className="app-wrapper">
        <table className="table table-fixed">
          <MainTableHead />
          <tbody id="contain" ref="contain">
            {this.props.contactData.map((contact, i) => {
              return (
                <tr key={i}>
                  <td style={{ width: "170px" }}>{contact.BuildingName}</td>
                  <td style={{ width: "170px" }}>{contact.PositionName}</td>
                  <td style={{ width: "120px" }}>
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

                  {/* <td style={{ width: "60px" }}>
                    {this.props.alarmReferenceValue.humidity}
                  </td>
                  <td style={{ width: "60px" }}>
                    <span
                      className={getClassText(contact.HumidityIndex)}
                      style={{ fontWweight: "bold", fontSize: "18px" }}
                    >
                      {contact.Humidity}
                    </span>
                  </td>
                  <td style={{ width: "60px" }}>
                    <div
                      className={getClassAlarmIcon(contact.HumidityAlarm)}
                      style={{ width: "12px", height: "12px" }}
                    />
                  </td>
                  <td style={{ width: "60px" }}>
                    {this.props.alarmReferenceValue.pm10}
                  </td>
                  <td style={{ width: "60px" }}>
                    <span
                      className={getClassText(contact.PM10Index)}
                      style={{ fontWweight: "bold", fontSize: "18px" }}
                    >
                      {contact.PM10}
                    </span>
                  </td>
                  <td style={{ width: "60px" }}>
                    <div
                      className={getClassAlarmIcon(contact.PM10Alarm)}
                      style={{ width: "12px", height: "12px" }}
                    />
                  </td>
                  <td style={{ width: "60px" }}>
                    {this.props.alarmReferenceValue.pm25}
                  </td>
                  <td style={{ width: "60px" }}>
                    <span
                      className={getClassText(contact.PM25Index)}
                      style={{ fontWweight: "bold", fontSize: "18px" }}
                    >
                      {contact.PM25}
                    </span>
                  </td>
                  <td style={{ width: "60px" }}>
                    <div
                      className={getClassAlarmIcon(contact.PM25Alarm)}
                      style={{ width: "12px", height: "12px" }}
                    />
                  </td>
                  <td style={{ width: "60px" }}>
                    {this.props.alarmReferenceValue.co2}
                  </td>
                  <td style={{ width: "60px" }}>
                    <span
                      className={getClassText(contact.CO2Index)}
                      style={{ fontWweight: "bold", fontSize: "18px" }}
                    >
                      {contact.CO2}
                    </span>
                  </td>
                  <td style={{ width: "60px" }}>
                    <div
                      className={getClassAlarmIcon(contact.CO2Alarm)}
                      style={{ width: "12px", height: "12px" }}
                    />
                  </td>
                  <td style={{ width: "60px" }}>
                    {this.props.alarmReferenceValue.hcho}
                  </td>
                  <td style={{ width: "60px" }}>
                    <span
                      className={getClassText(contact.HCHOIndex)}
                      style={{ fontWweight: "bold", fontSize: "18px" }}
                    >
                      {contact.HCHO}
                    </span>
                  </td>
                  <td style={{ width: "60px" }}>
                    <div
                      className={getClassAlarmIcon(contact.HCHOAlarm)}
                      style={{ width: "12px", height: "12px" }}
                    />
                  </td>
                  <td style={{ width: "60px" }}>
                    {this.props.alarmReferenceValue.voc}
                  </td>
                  <td style={{ width: "60px" }}>
                    <span
                      className={getClassText(contact.VOCIndex)}
                      style={{ fontWweight: "bold", fontSize: "18px" }}
                    >
                      {contact.VOC}
                    </span>
                  </td>
                  <td style={{ width: "60px" }}>
                    <div
                      className={getClassAlarmIcon(contact.VOCAlarm)}
                      style={{ width: "12px", height: "12px" }}
                    />
                  </td>
                  <td style={{ width: "60px" }}>
                    {this.props.alarmReferenceValue.voc}
                  </td>
                  <td style={{ width: "60px" }}>
                    <span
                      className={getClassText(contact.NoiseIndex)}
                      style={{ fontWweight: "bold", fontSize: "18px" }}
                    >
                      {contact.Noise}
                    </span>
                  </td>
                  <td style={{ width: "60px" }}>
                    <div
                      className={getClassAlarmIcon(contact.NoiseAlarm)}
                      style={{ width: "12px", height: "12px" }}
                    />
                  </td> */}
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
