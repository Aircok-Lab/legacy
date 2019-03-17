import React from "react";

const sensorData = ({
  alarmReferenceValue,
  sensorData,
  sensorIndex,
  sensorAlarm
}) => {
  const sensorTabWidth = "60px";

  const getClassAlarmIcon = alarm => {
    let classText = "";
    if (alarm == 1) classText = "bg-red rounded-circle mt-1 ml-2 mx-auto";
    console.log(classText);
    return classText;
  };

  const getClassText = grade => {
    let classText = "text-good";
    if (grade == 1) classText = "text-good";
    else if (grade == 2) classText = "text-normal";
    else if (grade == 3) classText = "text-sensitive1";
    else if (grade == 4) classText = "text-sensitive2";
    else if (grade == 5) classText = "text-bad";
    else if (grade == 6) classText = "text-very-bad";
    // console.log(classText);
    return classText;
  };

  return (
    <React.Fragment>
      <td style={{ width: `${sensorTabWidth}` }}>{alarmReferenceValue}</td>
      <td style={{ width: `${sensorTabWidth}` }}>
        <span
          className={getClassText(sensorIndex)}
          style={{ fontWweight: "bold", fontSize: "20px" }}
        >
          {sensorData}
        </span>
      </td>
      <td style={{ width: `${sensorTabWidth}` }}>
        <div
          className={getClassAlarmIcon(sensorAlarm)}
          style={{ width: "15px", height: "15px" }}
        />
      </td>
    </React.Fragment>
  );
};

export default sensorData;
