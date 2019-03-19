import React from "react";

class SensorCard extends React.Component {
  render() {
    return (
        <div className="card" style={{ borderRadius: "10px" }}>
          <div
            className="card-header text-center p-2"
            style={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px"
            }}
          >
            <h1>{this.props.title}</h1>
          </div>
          <div
            className="card-body text-white text-center bg-sensitive1"
            style={{
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
              padding: "28px"
            }}
          >
            <div className="row align-items-center">
              <div className="d-inline" style={{ width: "50%" }}>
                <img
                  src="assets/icons/totalindex.png"
                  alt="icons"
                  style={{ width: "150px", height: "150px" }}
                />
              </div>
              <div className="d-inline" style={{ width: "50%" }}>
                <div
                  className="text-white font-weight-bold"
                  style={{ fontSize: "3.6em" }}
                >
                  약간나쁨
                </div>
                <div
                  className="text-white font-weight-light"
                  style={{ fontSize: "3.2em" }}
                >
                  {this.props.sensorData}
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default SensorCard;
