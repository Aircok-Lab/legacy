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
    const { deviceData } = this.props;
    let adviceStr1 = "",
      adviceStr2 = "",
      adviceStr3 = "",
      adviceStr4 = "";
    if (deviceData.e3Index === 1) {
      adviceStr1 += "실내공간 공기질이 쾌적한 상태가 유지되고 있습니다.\n";
      if (deviceData.temperatureIndex > 3) {
        adviceStr2 += "온도 관리가 필요합니다.\n";
        adviceStr3 += "온도 관리를 위하여 냉/난방기를 작동시켜 주세요.\n";
      }
      if (deviceData.humidityIndex > 3) {
        adviceStr2 += "습도 관리가 필요합니다.\n";
        adviceStr3 += "습도 관리를 위하여 가습/제습 장치를 작동시켜 주세요.\n";
      }
      if (deviceData.pm25Index > 3) {
        adviceStr2 += "초미세먼지 관리가 필요합니다.\n";
        adviceStr3 += "미세먼지 관리를 위하여 공기청정기를 작동시켜 주세요.\n";
      }
      if (deviceData.pm10Index > 3) {
        adviceStr2 += "미세먼지 관리가 필요합니다.\n";
        adviceStr3 += "미세먼지 관리를 위하여 공기청정기를 작동시켜 주세요.\n";
      }
      if (deviceData.co2Index > 3) {
        adviceStr2 += "이산화탄소 관리가 필요합니다.\n";
        adviceStr3 += "이산화탄소 관리를 위하여 환기장치를 작동시켜 주세요\n";
      }
      if (deviceData.hchoIndex > 3) {
        adviceStr2 += "포름알데히드 관리가 필요합니다.\n";
        adviceStr3 += "포름알데히드 관리를 위하여 환기장치를 작동시켜 주세요\n";
      }
      if (deviceData.vocIndex > 3) {
        adviceStr2 += "휘발성유기화합물 관리가 필요합니다.\n";
        adviceStr3 +=
          "휘발성유기화합물 관리를 위하여 환기장치를 작동시켜 주세요\n";
      }
      // if (deviceData.noiseIndex > 3) {
      //   adviceStr2 += "소음 관리가 필요합니다.\n";
      // }
    } else if (deviceData.e3Index === 2) {
      adviceStr1 += "실내공간 공기질이 전반적으로 쾌적한 상태입니다.\n";
      if (deviceData.temperatureIndex > 3) {
        adviceStr2 += "온도 관리가 필요합니다.\n";
        adviceStr3 += "온도 관리를 위하여 냉/난방기를 작동시켜 주세요.\n";
      }
      if (deviceData.humidityIndex > 3) {
        adviceStr2 += "습도 관리가 필요합니다.\n";
        adviceStr3 += "습도 관리를 위하여 가습/제습 장치를 작동시켜 주세요.\n";
      }
      if (deviceData.pm25Index > 3) {
        adviceStr2 += "초미세먼지 관리가 필요합니다.\n";
        adviceStr3 += "미세먼지 관리를 위하여 공기청정기를 작동시켜 주세요.\n";
      }
      if (deviceData.pm10Index > 3) {
        adviceStr2 += "미세먼지 관리가 필요합니다.\n";
        adviceStr3 += "미세먼지 관리를 위하여 공기청정기를 작동시켜 주세요.\n";
      }
      if (deviceData.co2Index > 3) {
        adviceStr2 += "이산화탄소 관리가 필요합니다.\n";
        adviceStr3 += "이산화탄소 관리를 위하여 환기장치를 작동시켜 주세요\n";
      }
      if (deviceData.hchoIndex > 3) {
        adviceStr2 += "포름알데히드 관리가 필요합니다.\n";
        adviceStr3 += "포름알데히드 관리를 위하여 환기장치를 작동시켜 주세요\n";
      }
      if (deviceData.vocIndex > 3) {
        adviceStr2 += "휘발성유기화합물 관리가 필요합니다.\n";
        adviceStr3 +=
          "휘발성유기화합물 관리를 위하여 환기장치를 작동시켜 주세요\n";
      }
      // if (deviceData.noiseIndex > 3) {
      //   adviceStr2 += "소음 관리가 필요합니다.\n";
      // }
    } else {
      let cnt = 0,
        level1 = 0,
        level2 = 0;
      let temp = "";
      if (deviceData.temperatureIndex > 3) {
        adviceStr1 += "온도, ";
        adviceStr2 += "온도, ";
        cnt++;
        adviceStr3 += "온도 관리를 위하여 냉/난방기를 작동시켜 주세요.\n";
        level1 = deviceData.temperatureIndex;
      }
      if (deviceData.humidityIndex > 3) {
        adviceStr1 += "습도, ";
        cnt++;
        if (level1 === 0 || deviceData.humidityIndex > level1) {
          if (level1 > 0) {
            level2 = level1;
            temp = adviceStr2;
            adviceStr4 = adviceStr3;
          }
          level1 = deviceData.humidityIndex;
          adviceStr2 = "습도, " + temp;
          adviceStr3 = "습도 관리를 위하여 가습/제습 장치를 작동시켜 주세요.\n";
        } else if (level2 === 0) {
          adviceStr2 += "습도, ";
          adviceStr4 +=
            "습도 관리를 위하여 가습/제습 장치를 작동시켜 주세요.\n";
          level2 = deviceData.humidityIndex;
        }
      }
      if (deviceData.pm25Index > 3 || deviceData.pm10Index > 3) {
        cnt++;
        if (deviceData.pm25Index > 3) {
          adviceStr1 += "초미세먼지, ";
          let index =
            deviceData.pm25Index > deviceData.pm10Index
              ? deviceData.pm25Index
              : deviceData.pm10Index;
          if (level1 === 0 || index > level1) {
            if (level1 > 0) {
              level2 = level1;
              temp = adviceStr2;
              adviceStr4 = adviceStr3;
            }
            level1 = deviceData.index;
            adviceStr2 = "미세먼지, " + temp;
            adviceStr3 =
              "미세먼지 관리를 위하여 공기청정기를 작동시켜 주세요.\n";
          } else if (level2 === 0 || index > level2) {
            level2 = index;
            let test = adviceStr2.split(",");
            adviceStr2 = test[0] + ", 미세먼지, ";
            adviceStr4 =
              "미세먼지 관리를 위하여 공기청정기를 작동시켜 주세요.\n";
          }
        }
        if (deviceData.pm10Index > 3) {
          adviceStr1 += "미세먼지, ";
        }
      }
      if (
        deviceData.co2Index > 3 ||
        deviceData.hchoIndex > 3 ||
        deviceData.vocIndex > 3
      ) {
        if (deviceData.co2Index > 3) {
          cnt++;
          adviceStr1 += "이산화탄소, ";
          adviceStr3 += "이산화탄소 관리를 위하여 환기장치를 작동시켜 주세요\n";
        }
        if (deviceData.hchoIndex > 3) {
          cnt++;
          adviceStr1 += "포름알데히드, ";
          adviceStr3 +=
            "포름알데히드 관리를 위하여 환기장치를 작동시켜 주세요\n";
        }
        if (deviceData.vocIndex > 3) {
          cnt++;
          adviceStr1 += "휘발성유기화합물, ";
          adviceStr3 +=
            "휘발성유기화합물 관리를 위하여 환기장치를 작동시켜 주세요\n";
        }
      }

      // if (deviceData.noiseIndex > 3) {
      //   adviceStr2 += "소음 관리가 필요합니다.\n";
      // }
      adviceStr1 = adviceStr1 + " 좋지 않습니다.\n";
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
