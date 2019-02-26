import React from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";

const products = [];
var index = 0;

const qualityType = {
  0: "good",
  1: "Bad",
  2: "unknown"
};

function addProducts(quantity) {
  const startId = products.length;
  for (let i = 0; i < quantity; i++) {
    const id = startId + i;
    products.push({
      id: id,
      buildingName: "ethree", //add
      positionName: "3층", //add
      DeviceSN: "356170062277836",
      Date: "2019-02-18T06:44:00.000Z",
      PM10: 21,
      PM25: 15,
      CO2: 819,
      HCHO: 0,
      VOC: 8,
      Temperature: 25.7,
      Humidity: 11.2,
      Noise: null,
      E3Score: 41,
      E3Index: 3,
      PM10Index: 1,
      PM25Index: 1,
      CO2Index: 3,
      HCHOIndex: 1,
      VOCIndex: 1,
      TemperatureIndex: 6,
      HumidityIndex: 6,
      NoiseIndex: null,
      PM10Alarm: 0,
      PM25Alarm: 0,
      CO2Alarm: 0,
      HCHOAlarm: 0,
      VOCAlarm: 0,
      TemperatureAlarm: 0,
      HumidityAlarm: 1,
      NoiseAlarm: 0,
      InsertDate: "2019-02-18T06:44:44.000Z",
      pm10: "150",
      pm25: "70",
      co2: "1000",
      hcho: "100",
      voc: "500",
      temperature: "26",
      humidity: "40"
    });
  }
}

addProducts(50);

function headerColumnClassNameFormat(row) {
  return row === 0 ? "table-header-row0-class" : "table-header-row1-class";
}

class SamplePage extends React.Component {
  constructor(props) {
    super(props);
    this.pageScroll = this.pageScroll.bind(this);
  }

  componentDidMount() {
    this.intervalHandle = setInterval(this.pageScroll, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandle);
  }

  pageScroll() {
    var objDiv = document.getElementById("contain");

    objDiv.scrollTop = objDiv.scrollTop + 100;
    if (objDiv.scrollTop == objDiv.scrollHeight - 600) {
      objDiv.scrollTop = 0;
    }
  }

  render() {
    return (
      <div className="app-wrapper">
        <table className="table table-fixed">
          <thead>
            <tr>
              <th
                className="table-header-row0-class"
                rowSpan={2}
                style={{ width: "170px" }}
              >
                구분
              </th>
              <th
                className="table-header-row0-class"
                rowSpan={2}
                style={{ width: "170px" }}
              >
                측정기명
              </th>
              <th
                className="table-header-row0-class"
                rowSpan={2}
                style={{ width: "120px" }}
              >
                공기질관리지수
              </th>
              <th
                className="table-header-row0-class"
                colSpan={3}
                style={{ width: "180px" }}
              >
                온도
                <br />
                (℃)
              </th>
              <th
                className="table-header-row0-class"
                colSpan={3}
                style={{ width: "180px" }}
              >
                습도
                <br />
                (%)
              </th>
              <th
                className="table-header-row0-class"
                colSpan={3}
                style={{ width: "180px" }}
              >
                미세먼지(PM10)
                <br />
                (㎍/㎥)
              </th>
              <th
                className="table-header-row0-class"
                colSpan={3}
                style={{ width: "180px" }}
              >
                초미세먼지(PM2.5)
                <br />
                (㎍/㎥)
              </th>
              <th
                className="table-header-row0-class"
                colSpan={3}
                style={{ width: "180px" }}
              >
                이산화탄소(CO2)
                <br />
                (ppm)
              </th>
              <th
                className="table-header-row0-class"
                colSpan={3}
                style={{ width: "180px" }}
              >
                포름알데히드(HCHO)
                <br />
                (ppm)
              </th>
              <th
                className="table-header-row0-class"
                colSpan={3}
                style={{ width: "180px" }}
              >
                휘발성유기화합물(VOCs)
                <br />
                (㎍/㎥)
              </th>
            </tr>
            <tr className="table-header-row1-class">
              <th>기준</th>
              <th>현재</th>
              <th>알람</th>
              <th>기준</th>
              <th>현재</th>
              <th>알람</th>
              <th>기준</th>
              <th>현재</th>
              <th>알람</th>
              <th>기준</th>
              <th>현재</th>
              <th>알람</th>
              <th>기준</th>
              <th>현재</th>
              <th>알람</th>
              <th>기준</th>
              <th>현재</th>
              <th>알람</th>
              <th>기준</th>
              <th>현재</th>
              <th>알람</th>
            </tr>
          </thead>
          <tbody id="contain" ref="contain">
            <tr>
              <td style={{ width: "170px" }}>에코나래</td>
              <td style={{ width: "170px" }}>테스트용</td>
              <td style={{ width: "120px" }}>
                <span className="text-sensitive1">약간나쁨</span>
              </td>
              <td style={{ width: "60px" }}>26</td>
              <td style={{ width: "60px" }}>
                <span
                  className="text-sensitive1"
                  style={{ fontWweight: "bold", fontSize: "18px" }}
                >
                  26.9
                </span>
              </td>
              <td style={{ width: "60px" }} />
              <td style={{ width: "60px" }}>40</td>
              <td style={{ width: "60px" }}>
                <span
                  className="text-good"
                  style={{ fontWweight: "bold", fontSize: "18px" }}
                >
                  33.2
                </span>
              </td>
              <td style={{ width: "60px" }} />
              <td style={{ width: "60px" }}>150</td>
              <td style={{ width: "60px" }}>
                <span
                  className="text-good"
                  style={{ fontWweight: "bold", fontSize: "18px" }}
                >
                  9
                </span>
              </td>
              <td style={{ width: "60px" }} />
              <td style={{ width: "60px" }}>70</td>
              <td style={{ width: "60px" }}>
                <span
                  className="text-good"
                  style={{ fontWweight: "bold", fontSize: "18px" }}
                >
                  7
                </span>
              </td>
              <td style={{ width: "60px" }} />
              <td style={{ width: "60px" }}>1000</td>
              <td style={{ width: "60px" }}>
                <span
                  className="text-bad"
                  style={{ fontWweight: "bold", fontSize: "18px" }}
                >
                  1523
                </span>
              </td>
              <td style={{ width: "60px" }}>
                <div
                  className="bg-red rounded-circle mt-1 ml-2 mx-auto"
                  style={{ width: "12px", height: "12px" }}
                />
              </td>
              <td style={{ width: "60px" }}>100</td>
              <td style={{ width: "60px" }}>
                <span
                  className="text-good"
                  style={{ fontWweight: "bold", fontSize: "18px" }}
                >
                  0
                </span>
              </td>
              <td style={{ width: "60px" }} />
              <td style={{ width: "60px" }}>500</td>
              <td style={{ width: "60px" }}>
                <span
                  className="text-normal"
                  style={{ fontWweight: "bold", fontSize: "18px" }}
                >
                  284
                </span>
              </td>
              <td style={{ width: "60px" }} />
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default SamplePage;
