import React from "react";

const sensorData = ({
  sensorData,
  sensorIndex,
}) => {
  const sensorTabWidth = "105px"; //100


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
      <td 
      colSpan={1}
      style={{ border: "1px solid rgb(72, 68, 68)" , textAlign:"center",minWidth:"80px"}}>
        <span
        colSpan={2}
          className={getClassText(sensorIndex)}
          style={{  fontSize: "12px" ,height:"10px"}}
        >
          {sensorData}
        </span>
      </td>
      
   
    </React.Fragment>
  );
};

export default sensorData;
