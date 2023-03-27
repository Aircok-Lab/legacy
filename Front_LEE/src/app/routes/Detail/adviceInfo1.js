import React from "react";
import axios from "axios";
import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

class AdviceInfo1 extends React.Component {
  render() {
    const {
    positionName,
    deviceName,
    date,
    temperature,
    temperatureIndex,
    humidity,
    humidityIndex,
    voc,
    vocIndex,
    pm25,
    pm25Index,
    pm10,
    pm10Index,
    hcho,
    hchoIndex,
    co2,
    co2Index
    } = this.props;
  


  $(document).ready(function(){      
    $.ajax({
    url: 'http://smart.aircok.com:13701/report/getActComment?deviceData='+"temperatureIndex: "+temperatureIndex+", humidityIndex: "+humidityIndex+", pm25Index: "+pm25Index+", pm10Index: "+pm10Index+", co2Index: "+co2Index+", hchoIndex: "+hchoIndex+", vocIndex: "+vocIndex+", date: "+date+", deviceName: "+deviceName+", positionName: "+positionName+", co2: "+co2+", hcho: "+hcho+", pm10: "+pm10+", pm25: "+pm25+", voc: "+voc+", humidity: "+humidity+", temperature: "+temperature,
    type: 'POST',
    dataType : "json",
    success: function(res) {
          var data = res.data;
          $('#result1').html(data);
    },
    error: function(err) {
      console.log(err);
    }
  });
});


    
    return (
      <React.Fragment>
      <div className="col" style={{maxWidth:"100%",height:"192px",border:"1px solid #dad3d3",marginLeft:"441px",marginTop:"-109px",borderRadius:"7px"}}>
      <span id="result1" style={{ whiteSspace: "normal", fontSize: "18px" }}>
        </span>
      </div>
    </React.Fragment>
    );
  }
}
export default AdviceInfo1;