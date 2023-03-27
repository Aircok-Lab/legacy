import React from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader } from "reactstrap";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { chartDataRequest } from "actions/RecentData";
import { Line, Doughnut } from "react-chartjs-2";
import moment from "moment-timezone";
import LineChart from "./lineChart.js";

var lineChart = {
  labels: [],
  datasets: [
    {
      label: "",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [1]
    }
  ]
};

const donutChart = {
  labels: ["좋음", "보통", "약간나쁨", "나쁨", "매우나쁨", "최악"],
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 0],
      backgroundColor: [
        "#289ed7",
        "#36A2EB",
        "#e5a222",
        "#e24a1b",
        "#d50119",
        "#141414"
      ],
      hoverBackgroundColor: [
        "#289ed7",
        "#36A2EB",
        "#e5a222",
        "#e24a1b",
        "#d50119",
        "#141414"
      ]
    }
  ]
};

class ChartPage extends React.Component {
  constructor(props) {
    super(props);
    var today = Date.now();
    var startDate = moment(today)
      .tz("Asia/Seoul")
      .format("YYYY-MM-DD");
    var endDate = moment(today)
      .add(1, "days")
      .tz("Asia/Seoul");
    this.state = {
      show: false,
      date: today,
      e3Score: lineChart,
      pm10: lineChart,
      pm25: lineChart,
      co2: lineChart,
      hcho: lineChart,
      voc: lineChart,
      temperature: lineChart,
      humidity: lineChart,
      noise: lineChart,
      co: lineChart,
      e3ScoreIndex: donutChart,
      pm10Index: donutChart,
      pm25Index: donutChart,
      co2Index: donutChart,
      hchoIndex: donutChart,
      vocIndex: donutChart,
      temperatureIndex: donutChart,
      humidityIndex: donutChart,
      noiseIndex: donutChart,
      coIndex: donutChart,
      modalTitle: "",
      modalLineData: lineChart,
      modalDonutData: donutChart,
      modalAlaramData: 0
    };

    this.props.chartDataRequest({
      serialNumber: this.props.match.params.deviceList,
      date: today
    });

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.chartData != nextProps.chartData) {
      this.setState({
        e3Score: {
          labels: nextProps.chartData.labels,
          datasets: [
            {
              label: "통합지수",
              fill: false,
              lineTension: 0.1,
              // backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: nextProps.chartData.e3Score
            }
          ]
        },
        pm10: {
          labels: nextProps.chartData.labels,
          datasets: [
            {
              label: "미세먼지 (PM10)",
              fill: false,
              lineTension: 0.1,
              // backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: nextProps.chartData.pm10
            }
          ]
        },
        pm25: {
          labels: nextProps.chartData.labels,
          datasets: [
            {
              label: "초미세먼지 (PM2.5)",
              fill: false,
              lineTension: 0.1,
              // backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: nextProps.chartData.pm25
            }
          ]
        },
        co2: {
          labels: nextProps.chartData.labels,
          datasets: [
            {
              label: "이산화탄소 (CO2)",
              fill: false,
              lineTension: 0.1,
              // backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: nextProps.chartData.co2
            }
          ]
        },
        hcho: {
          labels: nextProps.chartData.labels,
          datasets: [
            {
              label: "포름알데히드 (HCHO)",
              fill: false,
              lineTension: 0.1,
              // backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: nextProps.chartData.hcho
            }
          ]
        },
        voc: {
          labels: nextProps.chartData.labels,
          datasets: [
            {
              label: "휘발성유기화합물 (VOCs)",
              fill: false,
              lineTension: 0.1,
              // backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: nextProps.chartData.voc
            }
          ]
        },
        temperature: {
          labels: nextProps.chartData.labels,
          datasets: [
            {
              label: "온도",
              fill: false,
              lineTension: 0.1,
              // backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: nextProps.chartData.temperature
            }
          ]
        },
        humidity: {
          labels: nextProps.chartData.labels,
          datasets: [
            {
              label: "습도",
              fill: false,
              lineTension: 0.1,
              // backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: nextProps.chartData.humidity
            }
          ]
        },
        noise: {
          labels: nextProps.chartData.labels,
          datasets: [
            {
              label: "소음",
              fill: false,
              lineTension: 0.1,
              // backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: nextProps.chartData.noise
            }
          ]
        },
        e3ScoreIndex: {
          labels: ["좋음", "보통", "약간나쁨", "나쁨", "매우나쁨", "최악"],
          datasets: [
            {
              data: nextProps.chartData.e3ScoreIndex,
              backgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ],
              hoverBackgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ]
            }
          ]
        },
        pm10Index: {
          labels: ["좋음", "보통", "약간나쁨", "나쁨", "매우나쁨", "최악"],
          datasets: [
            {
              data: nextProps.chartData.pm10Index,
              backgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ],
              hoverBackgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ]
            }
          ]
        },
        pm25Index: {
          labels: ["좋음", "보통", "약간나쁨", "나쁨", "매우나쁨", "최악"],
          datasets: [
            {
              data: nextProps.chartData.pm25Index,
              backgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ],
              hoverBackgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ]
            }
          ]
        },
        co2Index: {
          labels: ["좋음", "보통", "약간나쁨", "나쁨", "매우나쁨", "최악"],
          datasets: [
            {
              data: nextProps.chartData.co2Index,
              backgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ],
              hoverBackgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ]
            }
          ]
        },
        hchoIndex: {
          labels: ["좋음", "보통", "약간나쁨", "나쁨", "매우나쁨", "최악"],
          datasets: [
            {
              data: nextProps.chartData.hchoIndex,
              backgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ],
              hoverBackgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ]
            }
          ]
        },
        vocIndex: {
          labels: ["좋음", "보통", "약간나쁨", "나쁨", "매우나쁨", "최악"],
          datasets: [
            {
              data: nextProps.chartData.vocIndex,
              backgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ],
              hoverBackgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ]
            }
          ]
        },
        temperatureIndex: {
          labels: ["좋음", "보통", "약간나쁨", "나쁨", "매우나쁨", "최악"],
          datasets: [
            {
              data: nextProps.chartData.temperatureIndex,
              backgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ],
              hoverBackgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ]
            }
          ]
        },
        humidityIndex: {
          labels: ["좋음", "보통", "약간나쁨", "나쁨", "매우나쁨", "최악"],
          datasets: [
            {
              data: nextProps.chartData.humidityIndex,
              backgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ],
              hoverBackgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ]
            }
          ]
        },
        noiseIndex: {
          labels: ["좋음", "보통", "약간나쁨", "나쁨", "매우나쁨", "최악"],
          datasets: [
            {
              data: nextProps.chartData.noiseIndex,
              backgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ],
              hoverBackgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ]
            }
          ]
        },
        coIndex: {
          labels: ["좋음", "보통", "약간나쁨", "나쁨", "매우나쁨", "최악"],
          datasets: [
            {
              data: nextProps.chartData.coIndex,
              backgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ],
              hoverBackgroundColor: [
                "#289ed7",
                "#2ab67f",
                "#e5a222",
                "#e24a1b",
                "#d50119",
                "#141414"
              ]
            }
          ]
        }
      });
    }
  }

  handleChange = arrow => {
    var today = Date.now();
    var date = this.state.date;
    if (arrow === "left") {
      var startDate = moment(date)
        .subtract(1, "days")
        .tz("Asia/Seoul");
      var endDate = moment(startDate)
        .add(1, "days")
        .tz("Asia/Seoul");
      date = startDate;
    } else if (arrow === "right") {
      if (
        moment(date)
          .tz("Asia/Seoul")
          .format("YYYY-MM-DD") !=
        moment(today)
          .tz("Asia/Seoul")
          .format("YYYY-MM-DD")
      ) {
        var startDate = moment(date)
          .add(1, "days")
          .tz("Asia/Seoul");
        var endDate = moment(startDate)
          .add(1, "days")
          .tz("Asia/Seoul");
        date = startDate;
      }
    } else if (arrow === "today") {
      var startDate = moment(today)
        .tz("Asia/Seoul")
        .format("YYYY-MM-DD");
      var endDate = moment(today)
        .add(1, "days")
        .tz("Asia/Seoul");
      date = today;
    }

    if (this.state.date !== date) {
      this.props.chartDataRequest({
        serialNumber: this.props.match.params.deviceList,
        date: date
      });
      this.setState({
        date: date
      });
    }
  };

  handleClose() {
    this.setState({ show: false });
  }

  handleShow(title) {
    console.log(title.currentTarget.innerText);
    var sensor = title.currentTarget.innerText;
    if (sensor === "통합지수") {
      this.setState({
        modalTitle: sensor,
        modalLineData: this.state.e3Score,
        modalDonutData: this.state.e3ScoreIndex
      });
    } else if (sensor === "PM10") {
      this.setState({
        modalTitle: sensor,
        modalLineData: this.state.pm10,
        modalDonutData: this.state.pm10Index,
        modalAlaramData: this.props.chartData.pm10Alarm
      });
    } else if (sensor === "PM2.5") {
      this.setState({
        modalTitle: sensor,
        modalLineData: this.state.pm25,
        modalDonutData: this.state.pm25Index,
        modalAlaramData: this.props.chartData.pm25Alarm
      });
    } else if (sensor === "CO2") {
      this.setState({
        modalTitle: sensor,
        modalLineData: this.state.co2,
        modalDonutData: this.state.co2Index,
        modalAlaramData: this.props.chartData.co2Alarm
      });
    } else if (sensor === "HCHO") {
      this.setState({
        modalTitle: sensor,
        modalLineData: this.state.hcho,
        modalDonutData: this.state.hchoIndex,
        modalAlaramData: this.props.chartData.hchoAlarm
      });
    } else if (sensor === "VOC") {
      this.setState({
        modalTitle: sensor,
        modalLineData: this.state.voc,
        modalDonutData: this.state.vocIndex,
        modalAlaramData: this.props.chartData.vocAlarm
      });
    } else if (sensor === "온도") {
      this.setState({
        modalTitle: sensor,
        modalLineData: this.state.temperature,
        modalDonutData: this.state.temperatureIndex,
        modalAlaramData: this.props.chartData.temperatureAlarm
      });
    } else if (sensor === "습도") {
      this.setState({
        modalTitle: sensor,
        modalLineData: this.state.humidity,
        modalDonutData: this.state.humidityIndex,
        modalAlaramData: this.props.chartData.humidityAlarm
      });
    } else if (sensor === "소음") {
      this.setState({
        modalTitle: sensor,
        modalLineData: this.state.noise,
        modalDonutData: this.state.noiseIndex,
        modalAlaramData: this.props.chartData.noiseAlarm
      });
    }
    this.setState({ show: true });
  }

  render() {
    var startDate = moment(this.state.date)
      .tz("Asia/Seoul")
      .format("YYYY-MM-DD");

    return (
      <div className="h-100" style={{ overflow: "hidden" }}>
        <div
          style={{ background: "#e7ebee", width: "1920px", height: "1080px" }}
        >
          <div style={{ textAlign: "center" }}>
            <span
              style={{ display: "inline" }}
              onClick={this.handleChange.bind(this, "left")}
            >
              ◀
            </span>
            <span
              style={{ display: "inline" }}
              onClick={this.handleChange.bind(this, "today")}
            >
              {startDate}
            </span>
            <span
              style={{ display: "inline" }}
              onClick={this.handleChange.bind(this, "right")}
            >
              ▶
            </span>
          </div>
          <div className="mt-3">
            <div className="card-deck mx-3 pb-3">
              <LineChart
                title="통합지수"
                lineData={this.state.e3Score}
                modalShow={this.handleShow}
              />
              <LineChart
                title="PM10"
                lineData={this.state.pm10}
                modalShow={this.handleShow}
              />
              <LineChart
                title="PM2.5"
                lineData={this.state.pm25}
                modalShow={this.handleShow}
              />
            </div>
          </div>
          <div className="mt-3">
            <div className="card-deck mx-3 pb-3">
              <LineChart
                title="CO2"
                lineData={this.state.co2}
                modalShow={this.handleShow}
              />
              <LineChart
                title="HCHO"
                lineData={this.state.hcho}
                modalShow={this.handleShow}
              />
              <LineChart
                title="VOC"
                lineData={this.state.voc}
                modalShow={this.handleShow}
              />
            </div>
            <div className="mt-3">
              <div className="card-deck mx-3 pb-3">
                <LineChart
                  title="온도"
                  lineData={this.state.temperature}
                  modalShow={this.handleShow}
                />
                <LineChart
                  title="습도"
                  lineData={this.state.humidity}
                  modalShow={this.handleShow}
                />
                <LineChart
                  title="소음"
                  lineData={this.state.noise}
                  modalShow={this.handleShow}
                />
                {/* <div className="card" style={{ borderRadius: "10px" }}>
                  <h2>CO</h2>
                  {this.state.co.labels.length ? (
                    <Line data={this.state.co} />
                  ) : null}
                </div> */}
              </div>
            </div>
          </div>
          <Modal
            className="modal-box"
            isOpen={this.state.show}
            toggle={this.handleClose}
          >
            <ModalHeader className="modal-box-header bg-primary">
              {this.state.modalTitle}
              <IconButton className="text-white" onClick={this.handleClose}>
                <CloseIcon />
              </IconButton>
            </ModalHeader>
            <div className="modal-box-content d-flex flex-column">
              <Line data={this.state.modalLineData} />
              <Doughnut data={this.state.modalDonutData} />
              {this.state.modalTitle !== "통합지수" ? (
                <div> 알람 총 {this.state.modalAlaramData}번 울림</div>
              ) : null}
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ recentData }) => {
  const { chartData } = recentData;
  return { chartData };
};
export default connect(
  mapStateToProps,
  {
    chartDataRequest
  }
)(ChartPage);
