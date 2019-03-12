import React from "react";

const mainTableHead = props => {
  return (
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
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: "180px" }}
        >
          소음
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
        <th>기준</th>
        <th>현재</th>
        <th>알람</th>
      </tr>
    </thead>
  );
};

export default mainTableHead;
