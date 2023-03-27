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
  return classText;
};

class AdviceInfo extends React.Component {
  render() {
    const { deviceData } = this.props;
    var device = {
      e3Index: deviceData.e3Index,
      data: [
        {
          name: "온도",
          index: deviceData.temperatureIndex,
          advice: "냉/난방기를 "
        },
        {
          name: "습도",
          index: deviceData.humidityIndex,
          advice: "가습/제습 장치를 "
        },
        {
          name: "PM25",
          index: deviceData.pm25Index,
          advice: "공기청정기를 "
        },
        {
          name: "PM10",
          index: deviceData.pm10Index,
          advice: "공기청정기를 "
        },
        {
          name: "CO2",
          index: deviceData.co2Index,
          advice: "환기장치를 "
        },
        {
          name: "HCHO",
          index: deviceData.hchoIndex,
          advice: "환기장치를 "
        },
        {
          name: "VOC",
          index: deviceData.vocIndex,
          advice: "환기장치를 "
        } //,
        // {
        //   name: "noise",
        //   index: deviceData.noiseIndex
        // }
      ]
    };

    device.data.sort(function(a, b) {
      return a.index < b.index ? 1 : a.index > b.index ? -1 : 0;
    });

    let adviceStr1 = "",
      adviceStr2 = "",
      adviceStr3 = "",
      adviceStr4 = "";
    let cnt = 0;

    if (device.e3Index === 1 || device.e3Index === 2) {
      if (device.e3Index === 1)
        adviceStr1 += "실내공간 공기질이 쾌적한 상태가 유지되고 있습니다.";
      else if (device.e3Index === 2)
        adviceStr1 += "실내공간 공기질이 전반적으로 쾌적한 상태입니다.";

      device.data.map(sensor => {
        if (sensor.index > 3) {
          adviceStr2 += sensor.name + ",";
          cnt++;
          if (cnt == 1) {
            adviceStr3 =
              sensor.name +
              " 관리를 위하여 " +
              sensor.advice +
              "작동시켜 주세요.";
          }
          if (cnt == 2) {
            adviceStr4 =
              sensor.name +
              " 관리를 위하여 " +
              sensor.advice +
              "작동시켜 주세요.";
          }
        }
      });
      let temp = adviceStr2.slice(0, -1);
      if (cnt > 0) adviceStr2 = temp + " 관리가 필요합니다.";
    } else {
      device.data.map(sensor => {
        if (sensor.index > 3) {
          adviceStr1 += sensor.name + ",";
          cnt++;
        }
      });
      adviceStr1 = adviceStr1.slice(0, -1) + "가 좋지 않습니다.";
      if (cnt > 2) adviceStr2 = "특히 ";
      adviceStr2 +=
        device.data[0].name +
        ", " +
        device.data[1].name +
        " 관리가 필요합니다.";
      adviceStr3 =
        device.data[0].name +
        " 관리를 위하여 " +
        device.data[0].advice +
        "작동시켜 주세요.";
      adviceStr4 =
        device.data[1].name +
        " 관리를 위하여 " +
        device.data[1].advice +
        "작동시켜 주세요.";
    }

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
                {adviceStr1}
                <br />
                {adviceStr2}
                <br />
                {adviceStr3}
                <br />
                {adviceStr4}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdviceInfo;
