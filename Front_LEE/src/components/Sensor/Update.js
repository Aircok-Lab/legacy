import React, { Component } from "react";
import { connect } from "react-redux";
import { alarmListRequest, alarmUpdateRequest } from "actions/Alarm";
import {
  sensorListRequest,
  sensorMinUpdateRequest,
  sensorMaxUpdateRequest
} from "actions/Sensor";
import { setViewMode } from "actions/Setting";

const grades = ["좋음", "보통", "약간나쁨", "나쁨", "매우나쁨", "최악"];
const seasons = ["봄", "여름", "가을", "겨울"];

const sensorTypes = [
  { sensorType: "pm10", engName: "PM10", korName: "미세먼지" },
  { sensorType: "pm25", engName: "PM2.5", korName: "미세먼지" },
  { sensorType: "co2", engName: "CO2", korName: "이산화탄소" },
  { sensorType: "hcho", engName: "HCHO", korName: "포름알데히드" },
  { sensorType: "voc", engName: "VOC", korName: "휘발성유기화합물" },
  { sensorType: "co", engName: "CO", korName: "일산화탄소" },
  { sensorType: "noise", engName: "Noise", korName: "소음" },
  
  { sensorType: "temperature", 
    engName: "Temperature", 
    korName: "온도" 
  },
  {
    sensorType: "temperaturePublic",
    engName: "Temperature",
    korName: "공공기관 온도"
  },
  { sensorType: "humidity", engName: "Humidity", korName: "습도" },
  {
    sensorType: "humidityPublic",
    engName: "Humidity",
    korName: "공공기관 습도"
  }
];

class Update extends Component {
  state = {
    // postData: {
    //   pm10: "10",
    //   pm25: "25"
    // },
    sensors: [],
    sensors_temp_humi: []
    // sensors_a: [],
    // sensors_b: []
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
    this.setState({
      postData: {
        ...this.state.postData,
        [e.target.name]: e.target.value
      }
    });
  };

  componentDidMount() {
    this.props.sensorListRequest();
    this.props.alarmListRequest();
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.sensorData || !props.alarmData || state.sensors.length) {
      return null;
    }
    let sensors = [];

    sensorTypes.map(sensorType => {
      sensors.push(sensorType);
    });

    sensors.map(sensor => {
      const sensorGrades = props.sensorData.filter(
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

      sensor.alarm = props.alarmData[sensor.sensorType];
    });

    const sensors_temp_humi = sensors.splice(7);
    return {
      sensors,
      sensors_temp_humi
    };
  }

  render() {
    if (!this.props.sensorData || !this.props.alarmData) {
      return null;
    }
    return (
      <div className="col-12 mx-auto">
        <form className="w3-margin">
          <div className="table-responsive" style={{maxHeight:"450px",overflowX:"hidden"}}>
            <table
              className="table table-bordered text-center"
              style={{ background: "#fff" }}
            >
              <thead className="" style={{backgroundColor:"rgb(37, 36, 36)",color:"white"}}>
                <tr>
                  <th rowSpan="2" style={{ verticalAlign: "middle"
                  ,minWidth: "160px"
                  ,backgroundColor:"rgb(37, 36, 36)"
                  ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>
                    구분
                  </th>
                  {grades.map((grade, index) => (
                    <th style={{ 
                      verticalAlign: "middle" 
                      ,minWidth: "256px"
                      ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}} colSpan="2" key={index}>
                      {grade}
                    </th>
                  ))}
                  <th style={{ 
                  verticalAlign: "middle" 
                  ,minWidth: "130px"
                  ,backgroundColor:"rgb(37, 36, 36)"
                  ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}} rowSpan="2" >
                    알람
                  </th>
                </tr>
                <tr>
                  {grades.map((grade, index) => (
                    <React.Fragment key={index}>
                      <th style={{border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>Min</th>
                      <th style={{border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>Max</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody style={{height:"100%",width:"100%",overflowY:"hidden"}}>
                {this.state.sensors &&
                  this.state.sensors.map(sensor => (
                    <tr key={sensor.sensorType}>
                      <th
                        className=""
                        style={{
                          width: "160px",
                          background: "rgb(23, 24, 29)"
                          ,minWidth:"159px"
                          ,color:"white"
                          ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"
                        }}
                      >
                        {sensor.korName}
                        <br />
                        <span style={{backgroundColor:"rgb(37, 36, 36)"}}>({sensor.engName})</span>
                      </th>
                      {grades.map((grade, index) => (
                        <React.Fragment key={index}>
                          <td
                            style={{ padding: "4px", verticalAlign: "middle" 
                            ,minWidth:"128px",backgroundColor:"rgb(23, 24, 29)"
                            ,color:"white",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"
                            ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}
                          >
                            <input
                              className="form-control"
                              defaultValue={sensor.grade["" + (index + 1)].min}
                              type="text"
                              placeholder=""
                              onFocus={e => {
                                e.target.select();
                              }}
                              onBlur={e => {
                                if (
                                  e.target.value !==
                                  "" + sensor.grade["" + (index + 1)].min
                                ) {
                                  this.props.sensorMinUpdateRequest({
                                    sensorType: sensor.sensorType,
                                    grade: index + 1,
                                    min: e.target.value
                                  });
                                  const newSensors = this.state.sensors.map(
                                    _sensor => {
                                      if (
                                        _sensor.sensorType !== sensor.sensorType
                                      )
                                        return _sensor;
                                      let data = {
                                        ..._sensor
                                      };
                                      data.grade[index + 1].min = Number(
                                        e.target.value
                                      );
                                      return data;
                                    }
                                  );
                                  this.setState({ sensors: newSensors });
                                }
                              }}
                              style={{
                                fontSize: "1rem",
                                borderRadius: "0",
                                padding: "4px",
                                textAlign: "right"
                                ,backgroundColor:"rgb(23, 24, 29)"
                                ,color:"white"
                                ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"
                              }}
                            />
                          </td>
                          <td
                            style={{ padding: "4px"
                            ,verticalAlign: "middle"
                            ,minWidth:"128px" 
                            ,backgroundColor:"rgb(23, 24, 29)"
                            ,color:"white"
                            ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}
                          >
                            <input
                              className="form-control"
                              defaultValue={sensor.grade["" + (index + 1)].max}
                              type="text"
                              onFocus={e => {
                                e.target.select();
                              }}
                              onBlur={e => {
                                if (
                                  e.target.value !==
                                  "" + sensor.grade["" + (index + 1)].max
                                ) {
                                  this.props.sensorMaxUpdateRequest({
                                    sensorType: sensor.sensorType,
                                    grade: index + 1,
                                    max: e.target.value
                                  });
                                  const newSensors = this.state.sensors.map(
                                    _sensor => {
                                      if (
                                        _sensor.sensorType !== sensor.sensorType
                                      )
                                        return _sensor;
                                      let data = {
                                        ..._sensor
                                      };
                                      data.grade[index + 1].max = Number(
                                        e.target.value
                                      );
                                      return data;
                                    }
                                  );
                                  this.setState({ sensors: newSensors });
                                }
                              }}
                              style={{
                                fontSize: "1rem",
                                borderRadius: "0",
                                padding: "4px",
                                textAlign: "right"
                                ,backgroundColor:"rgb(23, 24, 29)"
                                ,color:"white"
                                ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"
                              }}
                            />
                          </td>
                        </React.Fragment>
                      ))}
                      <td style={{ padding: "4px"
                                , verticalAlign: "middle"   
                                ,backgroundColor:"rgb(23, 24, 29)"
                                ,color:"white"
                                ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>
                        <input
                          className="form-control"
                          type="text"
                          defaultValue={sensor.alarm}
                          onFocus={e => {
                            e.target.select();
                          }}
                          onBlur={e => {
                            if (e.target.value !== "" + sensor.alarm) {
                              this.props.alarmUpdateRequest({
                                sensorType: sensor.sensorType,
                                alarmValue: e.target.value
                              });
                              const newSensors = this.state.sensors.map(
                                _sensor => {
                                  if (_sensor.sensorType !== sensor.sensorType)
                                    return _sensor;
                                  return {
                                    ..._sensor,
                                    alarm: e.target.value
                                  };
                                }
                              );
                              this.setState({ sensors: newSensors });
                            }
                          }}
                          style={{
                            fontSize: "1rem",
                            verticalAlign: "middle",
                            borderRadius: "0",
                            padding: "4px",
                            textAlign: "right"
                            ,backgroundColor:"rgb(23, 24, 29)"
                            ,color:"white"
                            ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <hr />
          <div className="table-responsive">
            <table
              className="table table-bordered text-center"
              style={{ background: "#fff" }}
            >
              <thead className="" style={{backgroundColor:"rgb(37, 36, 36)",color:"white"}}>
                <tr>
                  <th rowSpan="2" style={{ verticalAlign: "middle" ,minWidth:"159px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>
                    구분
                  </th>
                  {seasons.map((season, index) => (
                    <th style={{ verticalAlign: "middle",minWidth:"369px",border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}} colSpan="2" key={index}>
                      {season}
                    </th>
                  ))}
                  <th rowSpan="2" style={{ 
                  verticalAlign: "middle" 
                  ,minWidth:"204px"
                  ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>
                    알람
                  </th>
                </tr>
                <tr>
                  {seasons.map((season, index) => (
                    <React.Fragment key={index}>
                      <th style={{border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>Min</th>
                      <th style={{border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>Max</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody  style={{height:"100%",width:"100%"}}>
                {this.state.sensors_temp_humi &&
                  this.state.sensors_temp_humi.map(sensor => (
                    <tr key={sensor.sensorType}>
                      <th
                        className=""
                        style={{
                          width: "160px",
                          background: "rgb(23, 24, 29)"
                          ,color:"white"
                          ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"
                        }}
                      >
                        {sensor.korName}
                        <br />
                        <span>({sensor.engName})</span>
                      </th>
                      {seasons.map((season, index) => (
                        <React.Fragment key={index}>
                          <td
                            style={{ padding: "4px"
                            ,verticalAlign: "middle" 
                            ,backgroundColor:"rgb(23, 24, 29)"
                            ,color:"white"
                            ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}
                          >
                            <input
                              className="form-control"
                              defaultValue={sensor.grade["" + (index + 1)].min}
                              type="text"
                              onFocus={e => {
                                e.target.select();
                              }}
                              onBlur={e => {
                                if (
                                  e.target.value !==
                                  "" + sensor.grade["" + (index + 1)].min
                                ) {
                                  this.props.sensorMinUpdateRequest({
                                    sensorType: sensor.sensorType,
                                    grade: index + 1,
                                    min: e.target.value
                                  });
                                  const newSensors = this.state.sensors_temp_humi.map(
                                    _sensor => {
                                      if (
                                        _sensor.sensorType !== sensor.sensorType
                                      )
                                        return _sensor;
                                      let data = {
                                        ..._sensor
                                      };
                                      data.grade[index + 1].min = Number(
                                        e.target.value
                                      );
                                      return data;
                                    }
                                  );
                                  this.setState({
                                    sensors_temp_humi: newSensors
                                  });
                                }
                              }}
                              style={{
                                fontSize: "1rem",
                                borderRadius: "0",
                                padding: "4px",
                                textAlign: "right"
                                ,backgroundColor:"rgb(23, 24, 29)"
                                ,color:"white"
                                ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"
                              }}
                            />
                          </td>
                          <td
                            style={{ padding: "4px"
                            ,verticalAlign: "middle"  
                            ,backgroundColor:"rgb(23, 24, 29)"
                            ,color:"white"
                            ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR" 
                          }}
                          >
                            <input
                              className="form-control"
                              defaultValue={sensor.grade["" + (index + 1)].max}
                              type="text"
                              onFocus={e => {
                                e.target.select();
                              }}
                              onBlur={e => {
                                if (
                                  e.target.value !==
                                  "" + sensor.grade["" + (index + 1)].max
                                ) {
                                  this.props.sensorMaxUpdateRequest({
                                    sensorType: sensor.sensorType,
                                    grade: index + 1,
                                    max: e.target.value
                                  });
                                  const newSensors = this.state.sensors_temp_humi.map(
                                    _sensor => {
                                      if (
                                        _sensor.sensorType !== sensor.sensorType
                                      )
                                        return _sensor;
                                      let data = {
                                        ..._sensor
                                      };
                                      data.grade[index + 1].max = Number(
                                        e.target.value
                                      );
                                      return data;
                                    }
                                  );
                                  this.setState({
                                    sensors_temp_humi: newSensors
                                  });
                                }
                              }}
                              style={{
                                fontSize: "1rem",
                                borderRadius: "0",
                                padding:"4px",
                                textAlign:"right"
                                ,backgroundColor:"rgb(23, 24, 29)"
                                ,color:"white"
                                ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"
                              }}
                            />
                          </td>
                        </React.Fragment>
                      ))}
                      <td style={{ padding: "4px"
                                ,verticalAlign: "middle" 
                                ,backgroundColor:"rgb(23, 24, 29)"
                                ,color:"white"
                                ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"}}>
                        <input
                          className="form-control"
                          type="text"
                          defaultValue={sensor.alarm}
                          onFocus={e => {
                            e.target.select();
                          }}
                          onBlur={e => {
                            if (e.target.value !== "" + sensor.alarm) {
                              this.props.alarmUpdateRequest({
                                sensorType: sensor.sensorType,
                                alarmValue: e.target.value
                              });
                              const newSensors = this.state.sensors_temp_humi.map(
                                _sensor => {
                                  if (_sensor.sensorType !== sensor.sensorType)
                                    return _sensor;
                                  return {
                                    ..._sensor,
                                    alarm: e.target.value
                                  };
                                }
                              );
                              this.setState({ sensors_temp_humi: newSensors });
                            }
                          }}
                          style={{
                            fontSize: "1rem",
                            verticalAlign: "middle",
                            borderRadius: "0",
                            padding: "4px",
                            textAlign: "right"
                            ,backgroundColor:"rgb(23, 24, 29)"
                            ,color:"white"
                            ,border:"1px solid rgb(72, 68, 68)",fontFamily:"Noto Sans KR"
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {/* <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>&nbsp;</div> */}
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
  alarmUpdateRequest,
  sensorListRequest,
  sensorMinUpdateRequest,
  sensorMaxUpdateRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Update);
