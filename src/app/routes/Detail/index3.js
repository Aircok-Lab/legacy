import React from "react";
import { connect } from "react-redux";
import {
  monitoringRecentDataRequest,
  outdoorDustDataRequest,
  outdoorWeatherDataRequest
} from "actions/RecentData";
import { showAuthLoader } from "actions/Auth";
import { systemListRequest } from "actions/System";
import SensorCard from "./card.js";
import DeviceInfo from "./deviceInfo.js";
import AdviceInfo from "./adviceInfo.js";

class DetailPage extends React.Component {
  constructor(props) {
    super(props);

    this.props.showAuthLoader();
    this.props.monitoringRecentDataRequest(this.props.match.params.deviceList);
    this.props.systemListRequest({ id: "1" });

    let device = this.props.match.params.deviceList.split(",");
    this.state = {
      index: 0,
      deviceCnt: device.length
    };
    this.loadData = this.loadData.bind(this);
    this.scrollDevice = this.scrollDevice.bind(this);
    if (this.props.allRecentData[0]) {
      var latitude = this.props.allRecentData[this.state.index].latitude;
      var longitude = this.props.allRecentData[this.state.index].longitude;
      this.props.outdoorDustDataRequest({ latitude, longitude });
      this.props.outdoorWeatherDataRequest({ latitude, longitude });
    }
  }

  componentDidMount() {
    this.intervalLoadDataHandle = setInterval(this.loadData, 60000);
    this.intervalScrollHandle = setInterval(
      this.scrollDevice,
      this.props.data.monitoringTime * 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalLoadDataHandle);
    clearInterval(this.intervalScrollHandle);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data.monitoringTime !== nextProps.data.monitoringTime) {
      if (this.intervalScrollHandle) clearInterval(this.intervalScrollHandle);
      this.intervalScrollHandle = setInterval(
        this.scrollDevice,
        nextProps.data.monitoringTime * 1000
      );
    }

    if (this.props.allRecentData !== nextProps.allRecentData) {
      var latitude = nextProps.allRecentData[this.state.index].latitude;
      var longitude = nextProps.allRecentData[this.state.index].longitude;
      this.props.outdoorDustDataRequest({ latitude, longitude });
      this.props.outdoorWeatherDataRequest({ latitude, longitude });
    }
  }

  scrollDevice() {
    let i = this.state.index;
    if (this.state.deviceCnt - 1 !== this.state.index) i++;
    else i = 0;

    if (this.state.index !== i) {
      var latitude = this.props.allRecentData[this.state.index].latitude;
      var longitude = this.props.allRecentData[this.state.index].longitude;
      this.props.outdoorDustDataRequest({ latitude, longitude });
      this.props.outdoorWeatherDataRequest({ latitude, longitude });
    }

    this.setState({
      index: i
    });
  }

  loadData() {
    this.props.monitoringRecentDataRequest(this.props.match.params.deviceList);
  }

  render() {
    const contact = this.props.allRecentData[this.state.index];

    return (
      <div
        className="h-100"
        style={{
          overflow: "hidden",
          background: "#e7ebee",
          width: "100%",
          height: "100%"
        }}
      >
        <div style={{ height: "33%" }}>
          <div style={{ width: "20%", display: "inline-block" }}>
            {contact.indoor ? (
              <SensorCard
                title="통합공기질관리지수"
                sensorData={contact.e3Score}
                sensorIndex={contact.e3Index}
                sensorType="totalindex"
                deviceList={contact.deviceSN}
              />
            ) : null}
          </div>
          <div style={{ width: "20%", display: "inline-block" }}>
            {contact.isTemp ? (
              <SensorCard
                title="온도"
                sensorData={contact.temperature}
                sensorIndex={contact.temperatureIndex}
                sensorType="temperature"
                deviceList={contact.deviceSN}
              />
            ) : null}
          </div>
          <div style={{ width: "20%", display: "inline-block" }}>
            {contact.isHumi ? (
              <SensorCard
                title="습도"
                sensorData={contact.humidity}
                sensorIndex={contact.humidityIndex}
                sensorType="humidity"
                deviceList={contact.deviceSN}
              />
            ) : null}
          </div>
          <div style={{ width: "20%", display: "inline-block" }}>
            {contact.isCo2 ? (
              <SensorCard
                title="이산화탄소 (CO2)"
                sensorData={contact.co2}
                sensorIndex={contact.co2Index}
                sensorType="co2"
                deviceList={contact.deviceSN}
              />
            ) : null}
          </div>
          <div style={{ width: "20%", display: "inline-block" }}>
            {contact.isHcho ? (
              <SensorCard
                title="포름알데히드 (HCHO)"
                sensorData={contact.hcho}
                sensorIndex={contact.hchoIndex}
                sensorType="hcho"
                deviceList={contact.deviceSN}
              />
            ) : null}
          </div>
        </div>
        <div style={{ height: "33%" }}>
          <div style={{ width: "20%", display: "inline-block" }}>
            {contact.isPm10 ? (
              <SensorCard
                title="미세먼지 (PM10)"
                sensorData={contact.pm10}
                sensorIndex={contact.pm10Index}
                sensorType="pm10"
                deviceList={contact.deviceSN}
              />
            ) : null}
          </div>
          <div style={{ width: "20%", display: "inline-block" }}>
            {contact.isPm25 ? (
              <SensorCard
                title="초미세먼지 (PM2.5)"
                sensorData={contact.pm25}
                sensorIndex={contact.pm25Index}
                sensorType="pm25"
                deviceList={contact.deviceSN}
              />
            ) : null}
          </div>
          <div style={{ width: "20%", display: "inline-block" }}>
            {contact.isVoc ? (
              <SensorCard
                title="휘발성유기화합물 (TVOC)"
                sensorData={contact.voc}
                sensorIndex={contact.vocIndex}
                sensorType="voc"
                deviceList={contact.deviceSN}
              />
            ) : null}
          </div>
          <div style={{ width: "20%", display: "inline-block" }}>
            {contact.isNoise ? (
              <SensorCard
                title="소음"
                sensorData={contact.noise}
                sensorIndex={contact.noiseIndex}
                sensorType="noise"
                deviceList={contact.deviceSN}
              />
            ) : null}
          </div>
          <div style={{ width: "20%", display: "inline-block" }}>
            {contact.isCo ? (
              <SensorCard
                title="일산화탄소 (CO)"
                sensorData={contact.co}
                sensorIndex={contact.coIndex}
                sensorType="co"
                deviceList={contact.deviceSN}
              />
            ) : (
              <SensorCard title="일산화탄소 (CO)" sensorType="co" />
            )}
          </div>
        </div>
        <div style={{ height: "33%" }}>
          <div style={{ width: "50%", display: "inline-block" }}>
            {contact ? (
              <DeviceInfo
                time={contact.date}
                buildingName={contact.buildingName}
                positionName={contact.positionName}
                deviceName={contact.deviceName}
                serialNumber={contact.deviceSN}
                outdoorDustData={this.props.outdoorDustData}
                outdoorWeatherData={this.props.outdoorWeatherData}
              />
            ) : null}
          </div>
          <div style={{ width: "50%", display: "inline-block" }}>
            {contact ? <AdviceInfo deviceData={contact} /> : null}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth, recentData, system }) => {
  const { authUser } = auth;
  const { allRecentData, outdoorDustData, outdoorWeatherData } = recentData;
  const { data } = system;
  return { authUser, allRecentData, data, outdoorDustData, outdoorWeatherData };
};
export default connect(
  mapStateToProps,
  {
    monitoringRecentDataRequest,
    outdoorDustDataRequest,
    outdoorWeatherDataRequest,
    showAuthLoader,
    systemListRequest
  }
)(DetailPage);
