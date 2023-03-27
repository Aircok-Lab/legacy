import React from "react";

const sensorData = ({
  alarmReferenceValue,
  sensorData,
  sensorIndex,
  sensorAlarm
}) => {
  const sensorTabWidth = "170px";

  const getClassAlarmIcon = alarm => {
    let classText = "";
    if (alarm == 1) classText = "bg-grey rounded-circle mt-1 ml-2 mx-auto";
    // console.log(classText);
    return classText;
  };

  const getClassText = grade => {
    let classText = "text-good";
    if (grade == 1) classText = "text-good";
    else if (grade == 2) classText = "text-normal";
    else if (grade == 3) classText = "text-sensitive1";
    else if (grade == 4) classText = "text-sensitive2";
    else if (grade == 5) classText = "text-bad";
    else if (grade == 6) classText = "text-very-bad" ;
    // console.log(classText);
    return classText;
  };

  return (
    <React.Fragment>
        <td 
      colSpan={1}
      style={{ border: "1px solid rgb(72, 68, 68)" , textAlign:"center",minWidth:"124px",fontFamily: "Noto Sans KR"}}>
        <span
        colSpan={2}
          className={getClassText(sensorIndex)}
          
          style={{  fontSize: "12px" ,height:"10px"}}
        >
       
          {getClassText(sensorIndex) == "text-very-bad" ?
          <i class="zmdi zmdi-alert-polygon" style={{fontSize:"15px"}}>{sensorData}</i> : sensorData
          }
          
        </span>
        
        {/* <td style={{ backgroundColor:'#1A1818',border: "1px solid rgb(37 36 36)",minWidth:"50px",color:"white"}}>{alarmReferenceValue}</td> */}
      </td>
      
      {/* <td style={{ backgroundColor:'#1A1818',border: "1px solid rgb(37 36 36)",minWidth:"50px",color:"white"}}>{alarmReferenceValue}</td>
      <td style={{ backgroundColor:'#1A1818',border: "1px solid rgb(37 36 36)",minWidth:"50px"}}>
        <span
          className={getClassText(sensorIndex)}
        >
          {sensorData}
        </span>
      </td>
      <td style={{ backgroundColor:'#1A1818',border: "1px solid rgb(37 36 36)",minWidth:"50px"}}>
        <div
          className={getClassAlarmIcon(sensorAlarm)}
          style={{ width: "15px", height: "12px" }}
        />
      </td> */}
    </React.Fragment>
  );
};

export default sensorData;
