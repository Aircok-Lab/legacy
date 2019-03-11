import React from "react";
import { connect } from "react-redux";
import { alarmReferenceValueRequest } from "actions/AlarmReference";
import { showAuthLoader } from "actions/Auth";
import { recentDataRequest } from "actions/RecentData";

const qualityType = {
  0: "good",
  1: "Bad",
  2: "unknown"
};

class SamplePage extends React.Component {
  constructor(props) {
    super(props);
    this.props.showAuthLoader();
    this.props.alarmReferenceValueRequest();
    this.props.recentDataRequest(this.props.authUser.PositionList);
    // this.state = {
    // contactData: [
    //   {
    //     BuildingName: "에어콕",
    //     PositionName: "1층",
    //     id: 34,
    //     DeviceSN: "356170062145371",
    //     Date: "2019-03-05T07:21:00.000Z",
    //     PM10: 150,
    //     PM25: 116,
    //     CO2: 0,
    //     HCHO: 0,
    //     VOC: 4,
    //     Temperature: 28.6,
    //     Humidity: 26,
    //     Noise: null,
    //     E3Score: 66,
    //     E3Index: 5,
    //     PM10Index: 5,
    //     PM25Index: 5,
    //     CO2Index: 1,
    //     HCHOIndex: 1,
    //     VOCIndex: 1,
    //     TemperatureIndex: 6,
    //     HumidityIndex: 6,
    //     NoiseIndex: null,
    //     PM10Alarm: 0,
    //     PM25Alarm: 1,
    //     CO2Alarm: 0,
    //     HCHOAlarm: 0,
    //     VOCAlarm: 0,
    //     TemperatureAlarm: 1,
    //     HumidityAlarm: 1,
    //     NoiseAlarm: 0,
    //     InsertDate: "2019-03-05T07:21:17.000Z"
    //   },
    //   {
    //     BuildingName: "에어콕",
    //     PositionName: "1층",
    //     id: 34,
    //     DeviceSN: "356170062145371",
    //     Date: "2019-03-05T07:21:00.000Z",
    //     PM10: 150,
    //     PM25: 116,
    //     CO2: 0,
    //     HCHO: 0,
    //     VOC: 4,
    //     Temperature: 28.6,
    //     Humidity: 26,
    //     Noise: null,
    //     E3Score: 66,
    //     E3Index: 5,
    //     PM10Index: 5,
    //     PM25Index: 5,
    //     CO2Index: 1,
    //     HCHOIndex: 1,
    //     VOCIndex: 1,
    //     TemperatureIndex: 6,
    //     HumidityIndex: 6,
    //     NoiseIndex: null,
    //     PM10Alarm: 0,
    //     PM25Alarm: 1,
    //     CO2Alarm: 0,
    //     HCHOAlarm: 0,
    //     VOCAlarm: 0,
    //     TemperatureAlarm: 1,
    //     HumidityAlarm: 1,
    //     NoiseAlarm: 0,
    //     InsertDate: "2019-03-05T07:21:17.000Z"
    //   }
    // ]
    // };
    this.pageScroll = this.pageScroll.bind(this);
  }

  componentDidMount() {
    this.intervalHandle = setInterval(this.pageScroll, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandle);
  }

  pageScroll() {
    var objDiv = document.getElementById("contain");

    objDiv.scrollTop = objDiv.scrollTop + 100;
    if (objDiv.scrollTop == objDiv.scrollHeight - 600) {
      objDiv.scrollTop = 0;
    }
  }

  render() {
    return (
      <div className="app-wrapper">
        <table className="table table-fixed">
          <thead>
            <tr>
              <th
                className="table-header-row0-class"
                rowSpan={2}
                style={{ width: "170px" }}
              >
                구분
              </th>
              <th
                className="table-header-row0-class"
                rowSpan={2}
                style={{ width: "170px" }}
              >
                측정기명
              </th>
              <th
                className="table-header-row0-class"
                rowSpan={2}
                style={{ width: "120px" }}
              >
                공기질관리지수
              </th>
              <th
                className="table-header-row0-class"
                colSpan={3}
                style={{ width: "180px" }}
              >
                온도
                <br />
                (℃)
              </th>
              <th
                className="table-header-row0-class"
                colSpan={3}
                style={{ width: "180px" }}
              >
                습도
                <br />
                (%)
              </th>
              <th
                className="table-header-row0-class"
                colSpan={3}
                style={{ width: "180px" }}
              >
                미세먼지(PM10)
                <br />
                (㎍/㎥)
              </th>
              <th
                className="table-header-row0-class"
                colSpan={3}
                style={{ width: "180px" }}
              >
                초미세먼지(PM2.5)
                <br />
                (㎍/㎥)
              </th>
              <th
                className="table-header-row0-class"
                colSpan={3}
                style={{ width: "180px" }}
              >
                이산화탄소(CO2)
                <br />
                (ppm)
              </th>
              <th
                className="table-header-row0-class"
                colSpan={3}
                style={{ width: "180px" }}
              >
                포름알데히드(HCHO)
                <br />
                (ppm)
              </th>
              <th
                className="table-header-row0-class"
                colSpan={3}
                style={{ width: "180px" }}
              >
                휘발성유기화합물(VOCs)
                <br />
                (㎍/㎥)
              </th>
            </tr>
            <tr className="table-header-row1-class">
              <th>기준</th>
              <th>현재</th>
              <th>알람</th>
              <th>기준</th>
              <th>현재</th>
              <th>알람</th>
              <th>기준</th>
              <th>현재</th>
              <th>알람</th>
              <th>기준</th>
              <th>현재</th>
              <th>알람</th>
              <th>기준</th>
              <th>현재</th>
              <th>알람</th>
              <th>기준</th>
              <th>현재</th>
              <th>알람</th>
              <th>기준</th>
              <th>현재</th>
              <th>알람</th>
            </tr>
          </thead>
          <tbody id="contain" ref="contain">
            {this.props.contactData.map((contact, i) => {
              return (
                <tr key={i}>
                  <td style={{ width: "170px" }}>{contact.BuildingName}</td>
                  <td style={{ width: "170px" }}>{contact.PositionName}</td>
                  <td style={{ width: "120px" }}>
                    <span className="text-sensitive1">약간나쁨</span>
                  </td>
                  <td style={{ width: "60px" }}>
                    {this.props.alarmReferenceValue.temperature}
                  </td>
                  <td style={{ width: "60px" }}>
                    <span
                      className="text-sensitive1"
                      style={{ fontWweight: "bold", fontSize: "18px" }}
                    >
                      {contact.Temperature}
                    </span>
                  </td>
                  <td style={{ width: "60px" }}>{contact.TemperatureAlarm}</td>
                  <td style={{ width: "60px" }}>
                    {this.props.alarmReferenceValue.humidity}
                  </td>
                  <td style={{ width: "60px" }}>
                    <span
                      className="text-good"
                      style={{ fontWweight: "bold", fontSize: "18px" }}
                    >
                      {contact.Humidity}
                    </span>
                  </td>
                  <td style={{ width: "60px" }}>{contact.HumidityAlarm}</td>
                  <td style={{ width: "60px" }}>
                    {this.props.alarmReferenceValue.pm10}
                  </td>
                  <td style={{ width: "60px" }}>
                    <span
                      className="text-good"
                      style={{ fontWweight: "bold", fontSize: "18px" }}
                    >
                      {contact.PM10}
                    </span>
                  </td>
                  <td style={{ width: "60px" }}>{contact.PM10Alarm}</td>
                  <td style={{ width: "60px" }}>
                    {this.props.alarmReferenceValue.pm25}
                  </td>
                  <td style={{ width: "60px" }}>
                    <span
                      className="text-good"
                      style={{ fontWweight: "bold", fontSize: "18px" }}
                    >
                      {contact.PM25}
                    </span>
                  </td>
                  <td style={{ width: "60px" }}>{contact.PM25Alarm}</td>
                  <td style={{ width: "60px" }}>
                    {this.props.alarmReferenceValue.co2}
                  </td>
                  <td style={{ width: "60px" }}>
                    <span
                      className="text-bad"
                      style={{ fontWweight: "bold", fontSize: "18px" }}
                    >
                      {contact.CO2}
                    </span>
                  </td>
                  <td style={{ width: "60px" }}>
                    <div
                      className="bg-red rounded-circle mt-1 ml-2 mx-auto"
                      style={{ width: "12px", height: "12px" }}
                    >
                      {contact.CO2Alarm}
                    </div>
                  </td>
                  <td style={{ width: "60px" }}>
                    {this.props.alarmReferenceValue.hcho}
                  </td>
                  <td style={{ width: "60px" }}>
                    <span
                      className="text-good"
                      style={{ fontWweight: "bold", fontSize: "18px" }}
                    >
                      {contact.HCHO}
                    </span>
                  </td>
                  <td style={{ width: "60px" }}>{contact.HCHOAlarm}</td>
                  <td style={{ width: "60px" }}>
                    {this.props.alarmReferenceValue.voc}
                  </td>
                  <td style={{ width: "60px" }}>
                    <span
                      className="text-normal"
                      style={{ fontWweight: "bold", fontSize: "18px" }}
                    >
                      {contact.VOC}
                    </span>
                  </td>
                  <td style={{ width: "60px" }}>{contact.VOCAlarm}</td>
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
