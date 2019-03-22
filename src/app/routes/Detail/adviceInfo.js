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
  noise: "db"
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
  // console.log(classText);
  return classText;
};

class AdviceInfo extends React.Component {
  render() {
    const { title, sensorData, sensorIndex, sensorType } = this.props;
    console.log("sensorIndex : " + sensorIndex);
    let icon = "assets/icons/" + sensorType + ".png";

    return (
      <div className="card card-block d-flex" style={{ borderRadius: "10px" }}>
        <div
          className="card-header bg-darkgray text-center p-2"
          style={{
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px"
          }}
        >
          <i className="zmdi zmdi-comment-text mr-1" />
          <span style={{ fontSize: "1.4em" }}> 행동요령</span>
        </div>
        <div className="card-body align-items-center text-center h-100">
          <div className="row align-items-center h-100 text-left">
            <div className="col">
              <span style={{ whiteSspace: "normal", fontSize: "24px" }}>
                실내공간 공기질이 전반적으로 쾌적한 상태입니다.
                <br />
                휘발성유기화합물 관리가 필요합니다.
                <br />
                휘발성유기화합물 관리를 위하여 환기장치를 작동시켜 주세요.
                <br />
                습도 관리를 위하여 가습/제습 장치를 작동시켜 주세요.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdviceInfo;
