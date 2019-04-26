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

    // this.props.showAuthLoader();
    this.props.chartDataRequest(this.props.match.params.deviceList);

    this.loadData = this.loadData.bind(this);
    // if (this.props.chartData. && this.props.chartData.pm10.length) {
    // var sensorData = {
    //   pm10: [],
    //   pm25: [],
    //   co2: [],
    //   hcho: [],
    //   voc: [],
    //   temperature: [],
    //   humidity: [],
    //   noise: []
    // };
    // this.props.chartData.forEach(function(data, index) {
    //   sensorData.pm10[index] = data.pm10;
    //   sensorData.pm25[index] = data.pm25;
    //   sensorData.co2[index] = data.co2;
    //   sensorData.hcho[index] = data.hcho;
    //   sensorData.voc[index] = data.voc;
    //   sensorData.temperature[index] = data.temperature;
    //   sensorData.humidity[index] = data.humidity;
    //   sensorData.noise[index] = data.noise;
    // });
    // this.setState(
    //   {
    //     pm10.datasets.data: sensorData.pm10,
    //     pm25.datasets.data: sensorData.pm25,
    //     co2.datasets.data: sensorData.co2,
    //     hcho.datasets.data: sensorData.hcho,
    //     voc.datasets.data: sensorData.voc,
    //     temperature.datasets.data: sensorData.temperature,
    //     humidity.datasets.data: sensorData.humidity,
    //     noise.datasets.data: sensorData.noise
    //   }
    // );
    chart.datasets.label = "미세먼지 (PM10)";
    // chart.datasets.data = this.props.chartData.pm10;
    // this.setState({
    //   pm10: chart
    // });
    this.setState((chart) => ({ pm10: chart }));
    // chart.datasets.label = "미세먼지 (PM25)";
    // // chart.datasets.data = this.props.chartData.pm25;
    // this.setState((chart) => ({ pm25: chart }));
    // chart.datasets.label = "이산화탄소 (CO2)";
    // // chart.datasets.data = this.props.chartData.co2;
    // this.setState((chart) => ({ co2: chart }));
    // chart.datasets.label = "포름알데히드 (HCHO)";
    // // chart.datasets.data = this.props.chartData.hcho;
    // this.setState((chart) => ({ hcho: chart }));
    // chart.datasets.label = "휘발성유기화합물 (VOCs)";
    // // chart.datasets.data = this.props.chartData.voc;
    // this.setState((chart) => ({ voc: chart }));
    // chart.datasets.label = "온도";
    // // chart.datasets.data = this.props.chartData.temperature;
    // this.setState((chart) => ({ temperature: chart }));
    // chart.datasets.label = "습도";
    // // chart.datasets.data = this.props.chartData.humidity;
    // this.setState((chart) => ({ humidity: chart }));
    // chart.datasets.label = "소음";
    // // chart.datasets.data = this.props.chartData.noise;
    // this.setState((chart) => ({ noise: chart }));
    // }
  }

  componentDidMount() {
    this.intervalLoadDataHandle = setInterval(this.loadData, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalLoadDataHandle);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.chartData != nextProps.chartData) {
      // var sensorData = {
      //   pm10: [],
      //   pm25: [],
      //   co2: [],
      //   hcho: [],
      //   voc: [],
      //   temperature: [],
      //   humidity: [],
      //   noise: []
      // };
      // nextProps.chartData.forEach(function(data, index) {
      //   sensorData.pm10[index] = data.pm10;
      //   sensorData.pm25[index] = data.pm25;
      //   sensorData.co2[index] = data.co2;
      //   sensorData.hcho[index] = data.hcho;
      //   sensorData.voc[index] = data.voc;
      //   sensorData.temperature[index] = data.temperature;
      //   sensorData.humidity[index] = data.humidity;
      //   sensorData.noise[index] = data.noise;
      // });
      // this.setState(
      //   {
      //     pm10: sensorData.pm10,
      //     pm25: sensorData.pm25,
      //     co2: sensorData.co2,
      //     hcho: sensorData.hcho,
      //     voc: sensorData.voc,
      //     temperature: sensorData.temperature,
      //     humidity: sensorData.humidity,
      //     noise: sensorData.noise
      //   },
      //   () => {
      //     pm10.datasets.data = this.state.pm10;
      //     pm25.datasets.data = this.state.pm25;
      //     co2.datasets.data = this.state.co2;
      //     hcho.datasets.data = this.state.hcho;
      //     voc.datasets.data = this.state.voc;
      //     temperature.datasets.data = this.state.temperature;
      //     humidity.datasets.data = this.state.humidity;
      //     noise.datasets.data = this.state.noise;
      //   }
      // );

      // pm10.datasets.data = sensorData.pm10;
      // pm25.datasets.data = sensorData.pm25;
      // co2.datasets.data = sensorData.co2;
      // hcho.datasets.data = sensorData.hcho;
      // voc.datasets.data = sensorData.voc;
      // temperature.datasets.data = sensorData.temperature;
      // humidity.datasets.data = sensorData.humidity;
      // noise.datasets.data = sensorData.noise;

      // chart.datasets.label = "미세먼지 (PM10)";
      // chart.datasets.data = sensorData.pm10;
      // this.setState({
      //   pm10: chart
      // });
      // chart.datasets.label = "미세먼지 (PM25)";
      // chart.datasets.data = sensorData.pm25;
      // this.setState({
      //   pm25: chart
      // });
      // chart.datasets.label = "이산화탄소 (CO2)";
      // chart.datasets.data = sensorData.co2;
      // this.setState({
      //   co2: chart
      // });
      // chart.datasets.label = "포름알데히드 (HCHO)";
      // chart.datasets.data = sensorData.hcho;
      // this.setState({
      //   hcho: chart
      // });
      // chart.datasets.label = "휘발성유기화합물 (VOCs)";
      // chart.datasets.data = sensorData.voc;
      // this.setState({
      //   voc: chart
      // });
      // chart.datasets.label = "온도";
      // chart.datasets.data = sensorData.temperature;
      // this.setState({
      //   temperature: chart
      // });
      // chart.datasets.label = "습도";
      // chart.datasets.data = sensorData.humidity;
      // this.setState({
      //   humidity: chart
      // });
      // chart.datasets.label = "소음";
      // chart.datasets.data = sensorData.noise;
      // this.setState({
      //   noise: chart
      // });
      // hart.datasets.label = "미세먼지 (PM10)";
      chart.labels = nextProps.chartData.labels;
      chart.datasets[0].data = nextProps.chartData.pm10;
      this.setState({
        pm10: chart
      });
      // this.setState((chart) => ({ pm10: chart }));
      // chart.datasets.label = "미세먼지 (PM25)";
      // chart.datasets.data = nextProps.chartData.pm25;
      // this.setState((chart) => ({ pm25: chart }));
      // // chart.datasets.label = "이산화탄소 (CO2)";
      // chart.datasets.data = nextProps.chartData.co2;
      // this.setState((chart) => ({ co2: chart }));
      // // chart.datasets.label = "포름알데히드 (HCHO)";
      // chart.datasets.data = nextProps.chartData.hcho;
      // this.setState((chart) => ({ hcho: chart }));
      // // chart.datasets.label = "휘발성유기화합물 (VOCs)";
      // chart.datasets.data = nextProps.chartData.voc;
      // this.setState((chart) => ({ voc: chart }));
      // // chart.datasets.label = "온도";
      // chart.datasets.data = nextProps.chartData.temperature;
      // this.setState((chart) => ({ temperature: chart }));
      // // chart.datasets.label = "습도";
      // chart.datasets.data = nextProps.chartData.humidity;
      // this.setState((chart) => ({ humidity: chart }));
      // // chart.datasets.label = "소음";
      // chart.datasets.data = nextProps.chartData.noise;
      // this.setState((chart) => ({ noise: chart }));
    }
  }

  loadData() {
    // this.props.chartDataRequest(this.props.match.params.deviceList);
  }

  render() {
    // const contact = this.props.chartData;

    return (
      <div className="h-100" style={{ overflow: "hidden" }}>
        <div className="" style={{ background: "#e7ebee", width: "1920px", height: "1080px" }}>
          <div className="mt-3">
            <div className="card-deck mx-3 pb-3">
              <div className="card" style={{ borderRadius: "10px" }}>
                <h2>PM10</h2>
                {this.state.pm10.labels.length ? <Line data={this.state.pm10} /> : null}
              </div>
              <div className="card" style={{ borderRadius: "10px" }}>
                <h2>PM2.5</h2>
                {this.state.pm25.labels.length ? <Line data={this.state.pm25} /> : null}
              </div>
              <div className="card" style={{ borderRadius: "10px" }}>
                <h2>CO2</h2>
                {this.state.co2.labels.length ? <Line data={this.state.co2} /> : null}
              </div>
              <div className="card" style={{ borderRadius: "10px" }}>
                <h2>HCHO</h2>
                {this.state.hcho.labels.length ? <Line data={this.state.hcho} /> : null}
              </div>
            </div>
            <div className="card-deck mx-3 pb-3">
              <div className="card" style={{ borderRadius: "10px" }}>
                <h2>VOC</h2>
                {this.state.voc.labels.length ? <Line data={this.state.voc} /> : null}
              </div>
              <div className="card" style={{ borderRadius: "10px" }}>
                <h2>온도</h2>
                {this.state.temperature.labels.length ? <Line data={this.state.temperature} /> : null}
              </div>
              <div className="card" style={{ borderRadius: "10px" }}>
                <h2>습도</h2>
                {this.state.humidity.labels.length ? <Line data={this.state.humidity} /> : null}
              </div>
              <div className="card" style={{ borderRadius: "10px" }}>
                <h2>소음</h2>
                {this.state.noise.labels.length ? <Line data={this.state.noise} /> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ recentData }) => {
  // const { authUser } = auth;
  const { chartData } = recentData;
  return { chartData };
};
export default connect(
  mapStateToProps,
  {
    chartDataRequest
  }
)(ChartPage);
