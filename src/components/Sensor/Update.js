import React, { Component } from "react";
import { connect } from "react-redux";
import { alarmListRequest } from "actions/Alarm";
import { sensorListRequest } from "actions/Sensor";
import { setViewMode } from "actions/Setting";

class Update extends Component {
  state = {
    postData: {
      pm10: "10",
      pm25: "25"
      // loginId: this.props.authUser.loginID,
      // name: this.props.authUser.name,
      // password: this.props.authUser.Password,
      // email: this.props.authUser.email,
      // department: this.props.authUser.department,
      // phone: this.props.authUser.phone,
      // userType: this.props.authUser.userType
    }
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
    this.setState({
      postData: {
        ...this.state.postData,
        [e.target.name]: e.target.value
      }
    });
  };

  componentDidMount() {
    this.props.sensorListRequest({ sensorType: "hcho" });
    this.props.sensorListRequest({ sensorType: "pm10" });
    this.props.alarmListRequest();
  }

  // componentDidMount() {
  //    this.setState({inputValue: this.props.inputValue});
  // }
  // handleChange = (e) => {
  //   this.setState({inputValue: e.target.value});
  // }

  render() {
    const grades = ["좋음", "보통", "민감군Ⅰ", "민감군Ⅱ", "나쁨", "매우나쁨"];
    const sensorTypes = [
      "pm10",
      "pm25",
      "co2",
      "hcho",
      "vocs",
      "noise",
      "temperature",
      "humidity"
    ];
    console.log("grades : ", grades);
    console.log("sensorTypes : ", sensorTypes);
    console.log("this.props.alarmData : ", this.props.alarmData);
    console.log("this.props.sensorData : ", this.props.sensorData);

    let listAll = [];

    sensorTypes.map(sensorType => {
      listAll.push({ sensorType });
    });

    console.log("listAll : ", listAll);

    return (
      <div className="col-12 mx-auto">
        <form className="text-blue w3-margin">
          <div className="row">
            <div className="col-3">
              <input
                className="form-control"
                name="pm10"
                value={this.state.postData.pm10}
                type="number"
                placeholder=""
                onChange={this.handleChange}
                onBlur={() => {
                  // this.props.actions.updateInput(this.state.inputValue)
                  console.log("onBlur .... ");
                }}
                style={{ border: "none" }}
              />
            </div>
            <div className="col-3">
              <input
                className="form-control"
                name="pm25"
                value={this.state.postData.pm25}
                type="number"
                placeholder=""
                onChange={this.handleChange}
                onBlur={() => {
                  // this.props.actions.updateInput(this.state.inputValue)
                  console.log("onBlur .... ");
                }}
                style={{ border: "none" }}
              />
            </div>

            {/* <input
              value={this.state.inputValue}
              onChange={this.handlechange}
              onBlur={() =>
                this.props.actions.updateInput(this.state.inputValue)
              }
            /> */}
          </div>
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>구분</th>
                {grades.map((grade, index) => (
                  <th colSpan="2" key={index}>
                    {grade}
                  </th>
                ))}
                <th>알람</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>구분</td>
                {grades.map((grade, index) => (
                  <React.Fragment key={index}>
                    <td>min</td>
                    <td>max</td>
                  </React.Fragment>
                ))}
                <td>알람</td>
                <td>
                  <button className="btn btn-primary mb-0">수정</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>{" "}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // authUser: state.auth.authUser,
  // selectedNode: state.tree.selectedNode,
  // productList: state.product.list,
  // viewMode: state.settings.viewMode,
  alarmData: state.alarm.data,
  sensorData: state.sensor.data
});

const mapDispatchToProps = {
  alarmListRequest,
  sensorListRequest
  // setViewMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Update);
