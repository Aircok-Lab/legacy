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
          <div style={{ width: "20%", display: "inline-block" }}>test</div>
          <div style={{ width: "20%", display: "inline-block" }}>test</div>
          <div style={{ width: "20%", display: "inline-block" }}>test</div>
          <div style={{ width: "20%", display: "inline-block" }}>test</div>
          <div style={{ width: "20%", display: "inline-block" }}>test</div>
        </div>
        <div style={{ height: "33%" }}>
          <div style={{ width: "20%", display: "inline-block" }}>test</div>
          <div style={{ width: "20%", display: "inline-block" }}>test</div>
          <div style={{ width: "20%", display: "inline-block" }}>test</div>
          <div style={{ width: "20%", display: "inline-block" }}>test</div>
          <div style={{ width: "20%", display: "inline-block" }}>test</div>
        </div>
        <div style={{ height: "33%" }}>
          <div style={{ width: "50%", display: "inline-block" }}>test</div>
          <div style={{ width: "50%", display: "inline-block" }}>test</div>
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
