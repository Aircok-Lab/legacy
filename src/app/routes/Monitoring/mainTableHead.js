import React from "react";

const mainTableHead = props => {
  const nameTabWidth = "160px";
  const indexTabWidth = "182px";
  const sensorTabWidth = "180px";
  const smsTabWidth = "60px";
  return (
    <thead>
      <tr>
        <th
          className="table-header-row0-class"
          rowSpan={3}
          style={{ width: `${nameTabWidth}` ,borderRight:'1px solid',borderLeft:'1px solid'}}
        >
          구분
        </th>
        <th
          className="table-header-row0-class"
          rowSpan={3}
          style={{ width: `${nameTabWidth}` ,borderRight:'1px solid',borderLeft:'1px solid'}}
        >
          측정기명
        </th>
        <th
          className="table-header-row0-class"
          rowSpan={3}
          style={{ width: `${nameTabWidth}` ,borderRight:'1px solid',borderLeft:'1px solid'}}
        >
          공기질관리지수
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}`,borderRight:'1px solid',borderLeft:'1px solid'}}
        >
          온도
          <br />
          (℃)
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}` ,borderRight:'1px solid',borderLeft:'1px solid'}}
        >
          습도
          <br />
          (%)
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}` ,borderRight:'1px solid',borderLeft:'1px solid'}}
        >
          미세먼지(PM10)
          <br />
          (㎍/㎥)
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}` ,borderRight:'1px solid',borderLeft:'1px solid'}}
        >
          초미세먼지(PM2.5)
          <br />
          (㎍/㎥)
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}` ,borderRight:'1px solid',borderLeft:'1px solid'}}
        >
          이산화탄소(CO2)
          <br />
          (ppm)
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}`,borderRight:'1px solid',borderLeft:'1px solid' }}
        >
          포름알데히드(HCHO)
          <br />
          (㎍/㎥)
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}`,borderRight:'1px solid',borderLeft:'1px solid' }}
        >
          휘발성유기화합물(TVOC)
          <br />
          (ppb)
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}` ,borderRight:'1px solid',borderLeft:'1px solid'}}
        >
          소음
          <br />
          (db)
        </th>
        <th
          className="table-header-row0-class"
          colSpan={3}
          style={{ width: `${sensorTabWidth}` ,borderRight:'1px solid',borderLeft:'1px solid'}}
        >
          일산화탄소(CO)
          <br />
          (ppb)
        </th>
        {/* <th
          className="table-header-row0-class"
          rowSpan={3}
          style={{ width: `${smsTabWidth}` }}
        >
          SMS
        </th> */}
      </tr>
      <tr className="table-header-row1-class">
        <th style={{borderRight:'1px solid'}}>기준</th>
        <th style={{borderRight:'1px solid'}}>현재</th>
        <th style={{borderRight:'1px solid'}}>보정</th>
        <th style={{borderRight:'1px solid'}}>기준</th>
        <th style={{borderRight:'1px solid'}}>현재</th>
        <th style={{borderRight:'1px solid'}}>보정</th>
        <th style={{borderRight:'1px solid'}}>기준</th>
        <th style={{borderRight:'1px solid'}}>현재</th>
        <th style={{borderRight:'1px solid'}}>보정</th>
        <th style={{borderRight:'1px solid'}}>기준</th>
        <th style={{borderRight:'1px solid'}}>현재</th>
        <th style={{borderRight:'1px solid'}}>보정</th>
        <th style={{borderRight:'1px solid'}}>기준</th>
        <th style={{borderRight:'1px solid'}}>현재</th>
        <th style={{borderRight:'1px solid'}}>보정</th>
        <th style={{borderRight:'1px solid'}}>기준</th>
        <th style={{borderRight:'1px solid'}}>현재</th>
        <th style={{borderRight:'1px solid'}}>보정</th>
        <th style={{borderRight:'1px solid'}}>기준</th>
        <th style={{borderRight:'1px solid'}}>현재</th>
        <th style={{borderRight:'1px solid'}}>보정</th>
        <th style={{borderRight:'1px solid'}}>기준</th>
        <th style={{borderRight:'1px solid'}}>현재</th>
        <th style={{borderRight:'1px solid'}}>보정</th>
        <th style={{borderRight:'1px solid'}}>기준</th>
        <th style={{borderRight:'1px solid'}}>현재</th>
        <th style={{borderRight:'1px solid'}}>보정</th>
      </tr>
    </thead>
  );
};

export default mainTableHead;
