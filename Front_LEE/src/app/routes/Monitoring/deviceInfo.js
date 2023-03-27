import React from "react";
import moment from "moment-timezone";

class DeviceInfo extends React.Component {
  render() {
    const {
      time,
      buildingName,
      positionName,
      deviceName,
      serialNumber,
      outdoorDustData,
      outdoorWeatherData
    } = this.props;
    var dateTime = moment(time); 
    var dtddd = moment(time).add("-9", "h").format("YYYY-MM-DD hh:mm").replace(/([^T]+)T([^\.]+).*/g, "$1 $2").slice(0);

    return (
      <div className="card" style={{ borderRadius: "10px" }}>
        <div
          className="card-header bg-darkgray text-center p-2"
          style={{
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px"
          }}
        >
          <i className="zmdi zmdi-settings mr-1" />
          <span style={{ fontSize: "1.4em" }}> 측정기 정보</span>
        </div>
        <div className="card-body text-center">
          <div className="row">
            {/* <div className="col-4">
              <img src="assets/icons/device.png" className="img-fluid" alt="" />
            </div> */}
            <div className="text-left" style={{ fontSize: "13px" }}>
              <h2>{buildingName}</h2>
              <div>
                <span
                  className="badge badge-pill badge-warning text-white mr-2"
                  style={{ width: "105px" }}
                >
                  위치
                </span>
                <span>{positionName}</span>
              </div>
              <div>
                <span
                  className="badge badge-pill badge-warning text-white mr-2"
                  style={{ width: "105px"}}
                >
                  측정기명
                </span>
                {deviceName}
              </div>
              <div>
                <span
                  className="badge badge-pill badge-warning text-white mr-2"
                  style={{ width: "105px" }}
                >
                  기기 제품번호
                </span>
                {serialNumber}
              </div>
              <div>
                <span
                  className="badge badge-pill badge-warning text-white mr-2"
                  style={{ width: "105px" }}
                >
                 측정 시간
              </span>
              <span>
              {dtddd}
              </span>
              </div>
            </div>
            <div className="col-8" style={{ fontSize: "1.4em" }}>
              <div className="row">
                <div className="col-12 mb-3 pr-4 text-right">  
                  {outdoorWeatherData && outdoorWeatherData.weather ? (
                    <img
                      src={`assets/icons/icon_weather_${outdoorWeatherData.weather}.png`}
                      style={{
                        width: "64px",
                        height: "64px",
                        verticalAlign: "-7px"
                      }}
                      alt="icons"
                    />
                  ) : (
                    ""
                  )}
                  {outdoorWeatherData && outdoorWeatherData.temperature ? (
                    <span
                      style={{
                        marginLeft: "7px",
                        fontSize: "26px",
                        fontWeight: "bold",
                        lineHeight: "34px"
                      }}
                    >
                      {outdoorWeatherData.temperature.fcstValue} ℃
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-6 pr-0">
                  <div className="card" style={{ borderRadius: "10px" }}>
                    <div
                      className={"card-body text-center"}
                      style={{
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                        padding: "14px",
                        backgroundColor: "#dbdbdb"
                      }}
                    >
                      <div className="row align-items-center">
                        <div className="d-inline text-right" style={{ width: "45%" }}>
                          {outdoorDustData && outdoorDustData.pm10ImageName ? (
                            <img
                              src={`assets/icons/icon_dust_${outdoorDustData.pm10ImageName}.png`}
                              style={{ width: "100px", height: "100px" }}
                              alt="icons"
                            />
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="d-inline" style={{ width: "45%" }}>
                          <div style={{ fontSize: "1.0em" }}>미세먼지</div>
                          {outdoorDustData && outdoorDustData.pm10Value ? (
                            <div
                              className="font-weight-bold"
                              style={{
                                marginTop: "10px",
                                fontSize: "1.2em",
                                color: outdoorDustData.pm10Color
                              }}
                            >
                              {outdoorDustData.pm10GradeStr}
                              <br />
                              {outdoorDustData.pm10Value} μg/㎥
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="d-inline" style={{ width: "10%" }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6 pl-0">
                  <div className="card" style={{ borderRadius: "10px" }}>
                    <div
                      className={"card-body text-center"}
                      style={{
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                        padding: "14px",
                        backgroundColor: "#dbdbdb"
                      }}
                    >
                      <div className="row align-items-center">
                        <div className="d-inline text-right" style={{ width: "45%" }}>
                          {outdoorDustData && outdoorDustData.pm25ImageName ? (
                            <img
                              src={`assets/icons/icon_dust_${outdoorDustData.pm25ImageName}.png`}
                              style={{ width: "100px", height: "100px" }}
                              alt="icons"
                            />
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="d-inline" style={{ width: "45%" }}>
                          <div style={{ fontSize: "0.9em" }}>초미세먼지</div>
                          {outdoorDustData && outdoorDustData.pm25Value ? (
                            <div
                              className="font-weight-bold"
                              style={{
                                marginTop: "10px",
                                fontSize: "1.2em",
                                color: outdoorDustData.pm25Color
                              }}
                            >
                              {outdoorDustData.pm25GradeStr}
                              <br />
                              {outdoorDustData.pm25Value} μg/㎥
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="d-inline" style={{ width: "10%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DeviceInfo;
