import React from "react";
import { connect } from "react-redux";
import { recentDataRequest } from "actions/RecentData";
import SensorCard from "./card.js";


class DetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.recentDataRequest(this.props.authUser.positionList);
    this.state = {
      index: null
    }
  }

  componentDidMount() {
    this.loadDataIntervalHandle = setInterval(this.loadData, 60000);
    const index =  this.props.contactData.findIndex(device => device.id===this.props.match.params.id)
    console.log(">>>>index: "+index);
  }

  componentWillReceiveProps(nextProps) {
    var i =  nextProps.contactData.findIndex(device => device.id===this.props.match.params.id);
    this.setState = ({
      index : i
    });
    console.log(">>>>index: "+i);    
  }

  componentWillUnmount() {
    clearInterval(this.loadDataIntervalHandle);
  }

  loadData() {
    this.props.recentDataRequest(this.props.authUser.positionList);
  }


  render() {
    const contact = this.props.contactData[this.state.index];

    return (
      <div className="h-100" style={{ overflow: "hidden" }}>
        <div
          className=""
          style={{ background: "#e7ebee", width: "1920px", height: "1080px" }}
        >
        <div className="mt-3">
        <div className="card-deck mx-3 pb-3">
        <SensorCard title="통합공기질관리지수"
          sensorData={contact.e3Score}
          sensorIndex={contact.e3Index}
          sensorType = "E3"
        />
        <SensorCard title="온도"
          sensorData={contact.temperature}
          sensorIndex={contact.temperatureIndex}
          sensorType = "temperature"
        />
        <SensorCard title="습도"
          sensorData={contact.humidity}
          sensorIndex={contact.humidityIndex}
          sensorType = "humidity"
        />
        <SensorCard title="미세먼지 (PM10)"
          sensorData={contact.pm10}
          sensorIndex={contact.pm10Index}
          sensorType = "pm10"
        />
        </div>
        <div className="card-deck mx-3 pb-3">
        <SensorCard title="초미세먼지 (PM2.5)"
          sensorData={contact.pm25}
          sensorIndex={contact.pm25Index}
          sensorType = "pm25"
        />
        <SensorCard title="이산화탄소 (CO2)"
          sensorData={contact.co2}
          sensorIndex={contact.co2Index}
          sensorType = "co2"
        />
        <SensorCard title="포름알데히드 (HCHO)"
          sensorData={contact.hcho}
          sensorIndex={contact.hchoIndex}
          sensorType = "hcho"
        />
        <SensorCard title="휘발성유기화합물 (VOCs)"
          sensorData={contact.voc}
          sensorIndex={contact.vocIndex}
          sensorType = "voc"
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
  const { contactData } = recentData;
  return { authUser, contactData };
};
export default connect(
  mapStateToProps,
  { recentDataRequest }
)(DetailPage);