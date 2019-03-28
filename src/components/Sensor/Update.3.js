import React, { Component } from "react";
import { connect } from "react-redux";
import { alarmListRequest } from "actions/Alarm";
import { sensorListRequest } from "actions/Sensor";
import { setViewMode } from "actions/Setting";

const grades = ["좋음", "보통", "민감군Ⅰ", "민감군Ⅱ", "나쁨", "매우나쁨"];

const sensorTypes = [
  { sensorType: "pm10", engName: "PM10", korName: "미세먼지" },
  { sensorType: "pm25", engName: "PM2.5", korName: "미세먼지" },
  { sensorType: "co2", engName: "CO2", korName: "이산화탄소" },
  { sensorType: "hcho", engName: "HCHO", korName: "포름알데히드" },
  { sensorType: "voc", engName: "VOC", korName: "휘발성유기화합물" },
  { sensorType: "noise", engName: "Noise", korName: "소음" },
  { sensorType: "temperature", engName: "Temperature", korName: "온도" },
  { sensorType: "humidity", engName: "Humidity", korName: "습도" }
];

class Update extends Component {
  state = {
    postData: {
      pm10: "10",
      pm25: "25"
    },
    sensors_a: [],
    sensors_b: []
  };
  update = () => {
    if (!this.state.postData.name) {
      alert("사용자이름을 입력하세요");
    } else if (!this.state.postData.email) {
      alert("이메일을 입력하세요");
    } else if (!this.state.postData.department) {
      alert("부서를 입력하세요");
    } else if (!this.state.postData.phone) {
      alert("전화번호를 입력하세요");
    } else if (!this.state.postData.userType) {
      alert("사용자권한을 선택하세요");
    } else {
      this.setState(
        {
          postData: {
            ...this.state.postData
          }
        },
        () => {
          this.props.userUpdateRequest(this.state.postData);
        }
      );
    }
  };
  handleChange = e => {
    console.log("handleChange", e.target.value);
    this.setState(
      {
        postData: {
          ...this.state.postData,
          [e.target.name]: e.target.value
        }
      },
      () => {
        console.log("this.state", this.state);
      }
    );
  };

  componentDidMount() {
    this.props.sensorListRequest();
    this.props.alarmListRequest();
  }

  static getDerivedStateFromProps(props, state) {
    console.log(props, state);
    return null;
  }

  render() {
    if (!this.props.sensorData || !this.props.alarmData) {
      return null;
    }

    let sensors = [];

    sensorTypes.map(sensorType => {
      sensors.push(sensorType);
    });

    sensors.map(sensor => {
      const sensorGrades = this.props.sensorData.filter(
        item => item.sensorType == sensor.sensorType
      );
      sensor.grade = {};
      sensorGrades.map(item => {
        sensor.grade[item.grade] = {
          key: item.grade,
          min: item.min,
          max: item.max
        };
      });

      sensor.alarm = this.props.alarmData[sensor.sensorType];
    });
    const sensors_temp_humi = sensors.splice(6);

    return (
      <div className="col-12 mx-auto">
        <form className="w3-margin">
          <div className="table-responsive">
            <table
              className="table table-bordered text-center"
              style={{ background: "#eee" }}
            >
              <thead className="text-white bg-primary">
                <tr>
                  <th rowSpan="2">구분</th>
                  {grades.map((grade, index) => (
                    <th colSpan="2" key={index}>
                      {grade}
                    </th>
                  ))}
                  <th rowSpan="2">알람</th>
                </tr>
                <tr>
                  {grades.map((grade, index) => (
                    <React.Fragment key={index}>
                      <th>Min</th>
                      <th>Max</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sensors.map(sensor => (
                  <tr key={sensor.sensorType}>
                    <th
                      className="text-dark"
                      style={{ width: "160px", background: "#ccc" }}
                    >
                      {sensor.korName}
                      <br />
                      <span>({sensor.engName})</span>
                    </th>
                    {grades.map((grade, index) => (
                      <React.Fragment key={index}>
                        <td>
                          <input
                            className="form-control"
                            name="pm25"
                            value={sensor.grade["" + (index + 1)].min}
                            type="text"
                            placeholder=""
                            onChange={this.handleChange}
                            onBlur={() => {
                              console.log("onBlur .... ");
                            }}
                            style={{ border: "none" }}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            name="pm25"
                            value={sensor.grade["" + (index + 1)].max}
                            type="text"
                            placeholder=""
                            onChange={this.handleChange}
                            onBlur={() => {
                              console.log("onBlur .... ");
                            }}
                            style={{ border: "none" }}
                          />
                        </td>
                      </React.Fragment>
                    ))}
                    <td>
                      <input
                        className="form-control"
                        name="pm25"
                        value={sensor.alarm}
                        type="text"
                        placeholder=""
                        onChange={this.handleChange}
                        onBlur={() => {
                          console.log("onBlur .... ");
                        }}
                        style={{ border: "none" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  alarmData: state.alarm.data,
  sensorData: state.sensor.data
});

const mapDispatchToProps = {
  alarmListRequest,
  sensorListRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Update);
