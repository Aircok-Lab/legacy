import React from "react";
import { connect } from "react-redux";
import { chartDataRequest } from "actions/RecentData";
import { Line } from "react-chartjs-2";
import moment from "moment-timezone";

var chart = {
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
      date: today,
      e3Score: chart,
      pm10: chart,
      pm25: chart,
      co2: chart,
      hcho: chart,
      voc: chart,
      temperature: chart,
      humidity: chart,
      noise: chart,
      co: chart
    };

    this.props.chartDataRequest({
      serialNumber: this.props.match.params.deviceList,
      date: today
    });

    this.loadData = this.loadData.bind(this);
    // this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // this.intervalLoadDataHandle = setInterval(this.loadData, 60000);
  }

  componentWillUnmount() {
    // clearInterval(this.intervalLoadDataHandle);
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
        }
      });
    }
  }

  loadData() {
    // this.props.chartDataRequest(this.props.match.params.deviceList);
  }

  leftDay = () => {
    var startDate = moment(this.state.startDate)
      .subtract(1, "days")
      .tz("Asia/Seoul");
    var endDate = moment(startDate)
      .add(1, "days")
      .tz("Asia/Seoul");
    this.setState({
      startDate: startDate,
      endDate: endDate
    });
  };

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

  render() {
    // const contact = this.props.chartData;
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
              <div className="card" style={{ borderRadius: "10px" }}>
                <h2>통합지수</h2>
                {this.state.e3Score.labels.length ? (
                  <Line data={this.state.e3Score} />
                ) : null}
              </div>
              <div className="card" style={{ borderRadius: "10px" }}>
                <h2>PM10</h2>
                {this.state.pm10.labels.length ? (
                  <Line data={this.state.pm10} />
                ) : null}
              </div>
              <div className="card" style={{ borderRadius: "10px" }}>
                <h2>PM2.5</h2>
                {this.state.pm25.labels.length ? (
                  <Line data={this.state.pm25} />
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="card-deck mx-3 pb-3">
              <div className="card" style={{ borderRadius: "10px" }}>
                <h2>CO2</h2>
                {this.state.co2.labels.length ? (
                  <Line data={this.state.co2} />
                ) : null}
              </div>
              <div className="card" style={{ borderRadius: "10px" }}>
                <h2>HCHO</h2>
                {this.state.hcho.labels.length ? (
                  <Line data={this.state.hcho} />
                ) : null}
              </div>
              <div className="card" style={{ borderRadius: "10px" }}>
                <h2>VOC</h2>
                {this.state.voc.labels.length ? (
                  <Line data={this.state.voc} />
                ) : null}
              </div>
            </div>
            <div className="mt-3">
              <div className="card-deck mx-3 pb-3">
                <div className="card" style={{ borderRadius: "10px" }}>
                  <h2>온도</h2>
                  {this.state.temperature.labels.length ? (
                    <Line data={this.state.temperature} />
                  ) : null}
                </div>
                <div className="card" style={{ borderRadius: "10px" }}>
                  <h2>습도</h2>
                  {this.state.humidity.labels.length ? (
                    <Line data={this.state.humidity} />
                  ) : null}
                </div>
                <div className="card" style={{ borderRadius: "10px" }}>
                  <h2>소음</h2>
                  {this.state.noise.labels.length ? (
                    <Line data={this.state.noise} />
                  ) : null}
                </div>
                {/* <div className="card" style={{ borderRadius: "10px" }}>
                  <h2>CO</h2>
                  {this.state.co.labels.length ? (
                    <Line data={this.state.co} />
                  ) : null}
                </div> */}
              </div>
            </div>
          </div>
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
