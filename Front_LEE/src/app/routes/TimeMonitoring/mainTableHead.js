import React from "react";
import { Button ,Form,Table} from "reactstrap";


const mainTableHead = props => {
  const nameTabWidth = "130px";
  const indexTabWidth = "50px";
  const sensorTabWidth = "105px";
  
  return (
    <thead >
      <tr>
      <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: `${nameTabWidth}`, border: "1px solid gray",color:"white"}}
        >
          No.
        </th>
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: `${nameTabWidth}` ,border: "1px solid gray",color:"white"}}
        >
          구분
        </th>
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: `${nameTabWidth}`, border: "1px solid gray",color:"white"}}
        >
          측정기명
        </th>        
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: `${nameTabWidth}`,border: "1px solid gray",color:"white"}}
        >
          엑셀 자료
        </th>  
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: `${nameTabWidth}`,border: "1px solid gray",color:"white"}}
        >
          서버 구분
        </th>      
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: `${sensorTabWidth}` ,border: "1px solid gray",color:"white",fontSize:"16px"}}
        >
        PM10
        </th>
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: `${sensorTabWidth}` ,border: "1px solid gray",color:"white",fontSize:"16px"}}
          >
        PM2.5
        </th>
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: `${sensorTabWidth}` ,border: "1px solid gray",color:"white",fontSize:"16px"}}
          >
        CO2
        </th>
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: `${sensorTabWidth}` ,border: "1px solid gray",color:"white",fontSize:"16px"}}
        >
        HCHO
        </th>
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: `${sensorTabWidth}` ,border: "1px solid gray",color:"white",fontSize:"16px"}}
        >
        VOCS
        </th>
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: `${sensorTabWidth}` ,border: "1px solid gray",color:"white",fontSize:"16px"}}
        >
        온도
        </th>
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: `${sensorTabWidth}` ,border: "1px solid gray",color:"white",fontSize:"16px"}}
        >
        습도
        </th>
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: `${sensorTabWidth}` ,border: "1px solid gray",color:"white",fontSize:"16px"}}
        >
        소음
        </th>
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: '96px' ,border: "1px solid gray",color:"white",fontSize:"16px"}}
        >
         CO
        </th>
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: '195px' ,border: "1px solid gray",color:"white",fontSize:"16px"}}
        >
         최종 측정시간
        </th>
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: '125px' ,border: "1px solid gray",color:"white",fontSize:"16px"}}
        >
         분
         </th>
         <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: '150px' ,border: "1px solid gray",color:"white",fontSize:"16px"}}
        >
         시간
        </th>
        <th
          className="table-header-row2-class"
          colSpan={1}
          style={{ width: '150px' ,border: "1px solid gray",color:"white",fontSize:"16px"}}
        >
         일
        </th>
        </tr>
    </thead>
  );
};

export default mainTableHead;
