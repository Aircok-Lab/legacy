// import React from "react";
// const mainTableHead = props => {
//   const nameTabWidth = "170px";
//   const indexTabWidth = "120px";
//   const sensorTabWidth = "180px";
//   return (
//     <thead>
//       <tr>
//         <th
//           className="table-header-row0-class"
//           rowSpan={2}
//           style={{  width: '143px',borderRight: "1px solid #b1afaf",borderBottom:"black",color:"#505050"}}
//         >
//           구분
//         </th>
//         <th
//           className="table-header-row0-class"
//           rowSpan={2}
//           style={{ width: '213px',borderRight: "1px solid #b1afaf",borderBottom:"black",color:"#505050"}}
//         >
//           측정기명
//         </th>
//         <th
//           className="table-header-row0-class"
//           rowSpan={2}
//           style={{ width: '93px',borderRight: "1px solid #b1afaf" ,borderBottom:"black",fontSize:'13px',color:"#505050"}}
//         >
//           상세정보
//         </th>
//         <th
//           className="table-header-row0-class"
//           rowSpan={2}
//           style={{ width:  '92px',borderRight: "1px solid #b1afaf",color:"#505050",borderBottom:"black"}}
//         >
//           공기질
//           <br />
//           관리지수
//         </th>
//         <th
//           className="table-header-row0-class"
//           colSpan={3}
//           style={{ width: `${sensorTabWidth}`,borderRight: "1px solid #b1afaf",borderBottom:"1px solid  #b1afaf",color:"#505050",borderBottom:"black"}}
//         >
//           온도
//           <br />
//           (℃)
//         </th>
//         <th
//           className="table-header-row0-class"
//           colSpan={3}
//           style={{ width: `${sensorTabWidth}`,borderRight: "1px solid #b1afaf",borderBottom:"1px solid  #b1afaf",color:"#505050",borderBottom:"black"}}
//         >
//           습도
//           <br />
//           (%)
//         </th>
//         <th
//           className="table-header-row0-class"
//           colSpan={3}
//           style={{ width: `${sensorTabWidth}`,borderRight: "1px solid #b1afaf",borderBottom:"1px solid  #b1afaf",color:"#505050" ,borderBottom:"black"}}
//         >
//           미세먼지(PM10)
//           <br />
//           (㎍/㎥)
//         </th>
//         <th
//           className="table-header-row0-class"
//           colSpan={3}
//           style={{ width: `${sensorTabWidth}`,borderRight: "1px solid #b1afaf",borderBottom:"1px solid  #b1afaf",color:"#505050",borderBottom:"black"}}
//         >
//           초미세먼지(PM2.5)
//           <br />
//           (㎍/㎥)
//         </th>
//         <th
//           className="table-header-row0-class"
//           colSpan={3}
//           style={{ width: `${sensorTabWidth}`,borderRight: "1px solid #b1afaf",borderBottom:"1px solid  #b1afaf",color:"#505050",borderBottom:"black"}}
//         >
//           이산화탄소(CO2)
//           <br />
//           (ppm)
//         </th>
//         <th
//           className="table-header-row0-class"
//           colSpan={3}
//           style={{ width: `${sensorTabWidth}`,borderRight: "1px solid #b1afaf",borderBottom:"1px solid  #b1afaf",color:"#505050",borderBottom:"black"}}
//         >
//           포름알데히드(HCHO)
//           <br />
//           (㎍/㎥)
//         </th>
//         <th
//           className="table-header-row0-class"
//           colSpan={3}
//           style={{ width: `${sensorTabWidth}`,borderRight: "1px solid #b1afaf",borderBottom:"1px solid  #b1afaf",color:"#505050",borderBottom:"black"}}
//         >
//           휘발성유기화합물(VOCs)
//           <br />
//           (ppb)
//         </th>
//         <th
//           className="table-header-row0-class"
//           colSpan={3}
//           style={{ width: `${sensorTabWidth}`,borderRight: "1px solid #b1afaf",borderBottom:"1px solid  #b1afaf",color:"#505050",borderBottom:"black"}}
//         >
//           소음
//           <br />
//           (db)
//         </th>
//         <th
//           className="table-header-row0-class"
//           colSpan={3}
//           style={{ width: `${sensorTabWidth}`,borderBottom:"1px solid  #b1afaf",color:"#505050" ,borderBottom:"black"}}
//         >
//           일산화탄소(CO)
//           <br />
//           (ppb)
//         </th>
//       </tr>
//         <tr className="table-header-row1-class">
//         <th style={{ width:"10px",border: "1px solid #b1afaf",fontSize:'11px'}}>기준</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>현재</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>알람</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>기준</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>현재</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>알람</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>기준</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>현재</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>알람</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>기준</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>현재</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>알람</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>기준</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>현재</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>알람</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>기준</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>현재</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>알람</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>기준</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>현재</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>알람</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>기준</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>현재</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>알람</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>기준</th>
//         <th style={{ border: "1px solid #b1afaf",fontSize:'11px'}}>현재</th>
//         <th style={{ borderBottom: "1px solid #b1afaf",fontSize:'11px'}}>알람</th>
//       </tr>
//     </thead>
//   );
// };

// export default mainTableHead;
