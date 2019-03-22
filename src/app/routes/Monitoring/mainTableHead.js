import React from "react";

const mainTableHead = props => {
  const nameTabWidth = "170px";
  const indexTabWidth = "120px";
  const sensorTabWidth = "180px";
  return (
    <thead>
      <tr>
        <th
          className="table-header-row0-class"
          rowSpan={2}
          style={{ width: `${nameTabWidth}` }}
        >
          구분
        </th>
        <th
          className="table-header-row0-class"
          rowSpan={2}
          style={{ width: `${nameTabWidth}` }}
        >
          측정기명
        </th>
        <th
          className="table-header-row0-class"
          rowSpan={2}
          style={{ width: `${indexTabWidth}` }}
        >
          공기질관리지수
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}` }}
        >
          온도
          <br />
          (℃)
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}` }}
        >
          습도
          <br />
          (%)
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}` }}
        >
          미세먼지(PM10)
          <br />
          (㎍/㎥)
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}` }}
        >
          초미세먼지(PM2.5)
          <br />
          (㎍/㎥)
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}` }}
        >
          이산화탄소(CO2)
          <br />
          (ppm)
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}` }}
        >
          포름알데히드(HCHO)
          <br />
          (㎍/㎥)
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}` }}
        >
          휘발성유기화합물(VOCs)
          <br />
          (ppb)
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}` }}
        >
          소음
          <br />
          (db)
        </th>
        <th
          className="table-header-row0-class"
          rowSpan={2}
          style={{ width: "100px" }}
        >
          SMS
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
        <th>기준</th>
        <th>현재</th>
        <th>알람</th>
      </tr>
    </thead>
  );
};

export default mainTableHead;
