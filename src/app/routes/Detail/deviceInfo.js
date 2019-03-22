import React from "react";

class DeviceInfo extends React.Component {
  render() {
    const {
      time,
      buildingName,
      positionName,
      deviceName,
      serialNumber
    } = this.props;

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
          <span style={{ fontSize: "1.4em" }}> 측정기정보</span>
        </div>
        <div className="card-body text-center">
          <div className="row">
            <div className="col-4">
              <img src="assets/icons/device.png" className="img-fluid" alt="" />
            </div>
            <div className="col-8 text-left" style={{ fontSize: "1.4em" }}>
              <h1>{buildingName}</h1>
              <div>
                <span
                  className="badge badge-pill badge-warning text-white mr-2"
                  style={{ width: "120px" }}
                >
                  위치
                </span>
                <span>{positionName}</span>
              </div>
              <div>
                <span
                  className="badge badge-pill badge-warning text-white mr-2"
                  style={{ width: "120px" }}
                >
                  측정기명
                </span>
                {deviceName}
              </div>
              <div>
                <span
                  className="badge badge-pill badge-warning text-white mr-2"
                  style={{ width: "120px" }}
                >
                  기기 제품번호
                </span>
                {serialNumber}
              </div>
              <div>
                <span
                  className="badge badge-pill badge-warning text-white mr-2"
                  style={{ width: "120px" }}
                >
                  측정 시간
                </span>
                {time.replace(/([^T]+)T([^\.]+).*/g, "$1 $2")}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DeviceInfo;
