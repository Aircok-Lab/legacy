import React from "react";
import { connect } from "react-redux";
import { monitoringRecentDataRequest } from "actions/RecentData";
import { showAuthLoader } from "actions/Auth";
import SensorCard from "./card.js";

class DetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.showAuthLoader();
    this.props.monitoringRecentDataRequest(this.props.match.params.deviceList);
    let device = this.props.match.params.deviceList.split(",");
    this.state = {
      index: 0,
      deviceCnt: device.length,
      deviceData: this.props.allRecentData[0]
    };
    console.log(device.length);
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.intervalLoadDataHandle = setInterval(this.loadData, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalLoadDataHandle);
  }

  loadData() {
    let i = this.state.index;
    console.log(this.state.deviceCnt);
    console.log(this.state.index);
    if (this.state.deviceCnt - 1 !== this.state.index) i++;
    else i = 0;
    this.setState({
      index: i,
      deviceData: this.props.allRecentData[i]
    });
    this.props.monitoringRecentDataRequest(this.props.match.params.deviceList);
  }

  render() {
    const contact = this.state.deviceData;

    return (
      <div className="h-100" style={{ overflow: "hidden" }}>
        <div
          className=""
          style={{ background: "#e7ebee", width: "1920px", height: "1080px" }}
        >
          <div className="mt-3">
            <div className="card-deck mx-3 pb-3">
              <SensorCard
                title="통합공기질관리지수"
                sensorData={contact.e3Score}
                sensorIndex={contact.e3Index}
                sensorType="totalindex"
              />
              <SensorCard
                title="온도"
                sensorData={contact.temperature}
                sensorIndex={contact.temperatureIndex}
                sensorType="temperature"
              />
              <SensorCard
                title="습도"
                sensorData={contact.humidity}
                sensorIndex={contact.humidityIndex}
                sensorType="humidity"
              />
              <SensorCard
                title="미세먼지 (PM10)"
                sensorData={contact.pm10}
                sensorIndex={contact.pm10Index}
                sensorType="pm10"
              />
            </div>
            <div className="card-deck mx-3 pb-3">
              <SensorCard
                title="초미세먼지 (PM2.5)"
                sensorData={contact.pm25}
                sensorIndex={contact.pm25Index}
                sensorType="pm25"
              />
              <SensorCard
                title="이산화탄소 (CO2)"
                sensorData={contact.co2}
                sensorIndex={contact.co2Index}
                sensorType="co2"
              />
              <SensorCard
                title="포름알데히드 (HCHO)"
                sensorData={contact.hcho}
                sensorIndex={contact.hchoIndex}
                sensorType="hcho"
              />
              <SensorCard
                title="휘발성유기화합물 (VOCs)"
                sensorData={contact.voc}
                sensorIndex={contact.vocIndex}
                sensorType="voc"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth, recentData }) => {
  const { authUser } = auth;
  const { allRecentData } = recentData;
  return { authUser, allRecentData };
};
export default connect(
  mapStateToProps,
  { monitoringRecentDataRequest, showAuthLoader }
)(DetailPage);
