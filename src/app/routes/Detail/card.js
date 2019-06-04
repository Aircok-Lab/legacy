import React from "react";

const qualityType = {
  1: "좋음",
  2: "보통",
  3: "약간나쁨",
  4: "나쁨",
  5: "매우나쁨",
  6: "최악"
};

const unitType = {
  temperature: "℃",
  humidity: "%",
  pm10: "㎍/㎥",
  pm25: "㎍/㎥",
  co2: "ppm",
  hcho: "㎍/㎥",
  voc: "ppb",
  noise: "db",
  co: "㎍/㎥"
};

const getClassText = grade => {
  let classText = " card-body text-white text-center bg-good";
  if (grade == 1) classText = " card-body text-white text-center bg-good";
  else if (grade == 2)
    classText = " card-body text-white text-center bg-normal";
  else if (grade == 3)
    classText = " card-body text-white text-center bg-sensitive1";
  else if (grade == 4)
    classText = " card-body text-white text-center bg-sensitive2";
  else if (grade == 5) classText = " card-body text-white text-center bg-bad";
  else if (grade == 6)
    classText = " card-body text-white text-center bg-very-bad";
  return classText;
};

class SensorCard extends React.Component {
  render() {
    const {
      title,
      sensorData,
      sensorIndex,
      sensorType,
      deviceList
    } = this.props;
    let icon = "assets/icons/" + sensorType + ".png";

    return (
      <div className="card" style={{ borderRadius: "10px" }}>
        <div
          className="card-header text-center p-2"
          style={{
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            fontStyle: "Bold",
            fontSize: "1.4em"
          }}
        >
          <a href={"#/app/device-chart/" + deviceList}>{title}</a>
        </div>
        <div
          className={getClassText(sensorIndex)}
          style={{
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            padding: "20px"
          }}
        >
          <div className="row align-items-center">
            <div className="d-inline" style={{ width: "50%" }}>
              <img
                src={icon}
                alt="icons"
                style={{ width: "150px", height: "150px" }}
              />
            </div>
            <div className="d-inline" style={{ width: "50%" }}>
              <div
                className="text-white font-weight-bold"
                style={{ fontSize: "3.2em" }}
              >
                {qualityType[`${sensorIndex}`]}
              </div>
              <div
                className="text-white font-weight-light"
                style={{ fontSize: "3.2em" }}
              >
                {sensorData}
                <span style={{ fontSize: "0.8em" }}>
                  {unitType[`${sensorType}`]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SensorCard;
