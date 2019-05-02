import React from "react";
import { connect } from "react-redux";
import { chartDataRequest } from "actions/RecentData";
import { Line } from "react-chartjs-2";

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
    //var sensorData = null;
    this.state = {
      pm10: chart,
      pm25: chart,
      co2: chart,
      hcho: chart,
      voc: chart,
      temperature: chart,
      humidity: chart,
      noise: chart
    };

    this.props.chartDataRequest(this.props.match.params.deviceList);

    this.loadData = this.loadData.bind(this);
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

  render() {
    // const contact = this.props.chartData;

    return (
      <div className="h-100" style={{ overflow: "hidden" }}>
        <div
          className=""
          style={{ background: "#e7ebee", width: "1920px", height: "1080px" }}
        >
          <div className="mt-3">
            <div className="card-deck mx-3 pb-3">
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
            </div>
            <div className="card-deck mx-3 pb-3">
              <div className="card" style={{ borderRadius: "10px" }}>
                <h2>VOC</h2>
                {this.state.voc.labels.length ? (
                  <Line data={this.state.voc} />
                ) : null}
              </div>
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
