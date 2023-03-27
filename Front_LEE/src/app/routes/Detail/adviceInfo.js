import React from "react";
import axios from "axios";
import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

class AdviceInfo extends React.Component {
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
      co2Index,
      e3Index,
      productID,
      sensorType,
      sensorIndex,
      indoor
    } = this.props;

    let pm10icon = "assets/icons/" + "pm10" + ".png";
    let pm25icon = "assets/icons/" + "pm25" + ".png";
    let tempicon = "assets/icons/" + "temperature" + ".png";
    let humiicon = "assets/icons/" + "humidity" + ".png";
    let co2icon = "assets/icons/" + "co2" + ".png";
    let vocicon = "assets/icons/" + "voc" + ".png";
    let hchoicon = "assets/icons/" + "hcho" + ".png";
    // ww();
    const getClassText = grade => {
      let classText = " card-body text-white text-center bg-good";
      if (grade == 1) classText = " bg-good";
      else if (grade == 2)
        classText = " bg-normal";
      else if (grade == 3)
        classText = " bg-sensitive1";
      else if (grade == 4)
        classText = "  bg-sensitive2";
      else if (grade == 5) classText = " bg-bad";
      else if (grade == 6)
        classText = "  bg-very-bad";
      return classText;
    };
    // function ww (){
    //   if (pm10Index == 1 ) 
    //   document.getElementById("btn1").style.backgroundColor = "#2DA1DA"
    //   else if (pm10Index == 2 ) 
    //   document.getElementById("btn1").style.backgroundColor = "#2FB983"
    //   else if (pm10Index == 3 ) 
    //   document.getElementById("btn1").style.backgroundColor = "#E7A527"
    //   else if (pm10Index == 4 ) 
    //   document.getElementById("btn1").style.backgroundColor = "#E44F21"
    //   else if (pm10Index == 5 ) 
    //   document.getElementById("btn1").style.backgroundColor = "#D8071F"
    //   else if (pm10Index == 6 ) 
    //   document.getElementById("btn1").style.backgroundColor = "#000000"
    // }


    $(document).ready(function(){      
      $.ajax({
      url: 'http://smart.aircok.com:13701/report/getTotalComment?deviceData='+"temperatureIndex: "+temperatureIndex+", humidityIndex: "+humidityIndex+", pm25Index: "+pm25Index+", pm10Index: "+pm10Index+", co2Index: "+co2Index+", hchoIndex: "+hchoIndex+", vocIndex: "+vocIndex+", e3Index: "+e3Index,
      type: 'POST',
      dataType : "json",
      success: function(res) {
        var data = res.data;
        if( indoor == '0') {      
          $('#totalComment').empty(data);
        }else{
          $('#totalComment').html(data);
        }
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
  // ?deviceData='+"temperatureIndex: "+temperatureIndex+", humidityIndex: "+humidityIndex+", pm25Index: "+pm25Index+", pm10Index: "+pm10Index+", co2Index: "+co2Index+", hchoIndex: "+hchoIndex+", vocIndex: "+vocIndex+", date: "+date+", deviceName: "+deviceName+", positionName: "+positionName+", co2: "+co2+", hcho: "+hcho+", pm10: "+pm10+", pm25: "+pm25+", voc: "+voc+", humidity: "+humidity+", temperature: "+temperature
  function act(){
    $('#pm10btn').click(function() {      
      $.ajax({
      url: 'http://smart.aircok.com:13701/report/getActComment?deviceData='+"date: "+date+", co2: "+co2+", hcho: "+hcho +", deviceName: "+deviceName
          +", pm10: "+pm10+", pm25: "+pm25+", voc: "+voc+", humidity: "+humidity+", temperature: "+temperature+", humidityIndex: "+humidityIndex+", temperatureIndex: "+temperatureIndex+", jisuGubun: web",
      type: 'POST',
      dataType : "json",
      success: function(res) {
            var data = res.data;
            var dataLen = data.length;
            var html = '';
            for (var i = 0; i < dataLen; i++){
            }
            if(data[2].message1 == null){
            html += '<span style="font-size :14px; font-weight: bold; color:white; font-family:Noto Sans KR ">' + "</br>" +data[2].noti2 + "</br>" +   data[2].noti4+ "</br>"  + '</span>';
          }else{
            html += '<span style="font-size :14px; font-weight: bold; color:white; font-family:Noto Sans KR">' + "</br>" +data[2].noti2 + "</br>" +  data[2].noti4+ "</br>"  + '</span>';
            html += '<span style="font-size :12px; color:white; font-family:Noto Sans KR">' + "ⓐ" + data[2].message1 + "</br>" + "ⓑ" + data[2].message2 + "</br>"+'</span>';
          }
          $('#actComment').html(html);
        },
      error: function(err) {
        console.log(err);
      }
    });
  });
  $('#pm25btn').click(function() {      
    $.ajax({
    url: 'http://smart.aircok.com:13701/report/getActComment?deviceData='+"date: "+date+", co2: "+co2+", hcho: "+hcho +", deviceName: "+deviceName
        +", pm10: "+pm10+", pm25: "+pm25+", voc: "+voc+", humidity: "+humidity+", temperature: "+temperature+", humidityIndex: "+humidityIndex+", temperatureIndex: "+temperatureIndex+", jisuGubun: web",
    type: 'POST',
    dataType : "json",
    success: function(res) {
          var data = res.data;
          var dataLen = data.length;
          var html = '';
          for (var i = 0; i < dataLen; i++){
          }
          if(data[3].message1 == null){
          html += '<span style="font-size :14px; font-weight: bold; color:white; font-family:Noto Sans KR ">' + "</br>" +data[3].noti2 + "</br>" + data[3].noti4+ "</br>"  + '</span>';
        }else{
          html += '<span style="font-size :14px; font-weight: bold; color:white; font-family:Noto Sans KR">' + "</br>" +data[3].noti2 + "</br>" +  data[3].noti4+ "</br>"  + '</span>';
          html += '<span style="font-size :12px; color:white; font-family:Noto Sans KR">' + "ⓐ" + data[3].message1 + "</br>" + "ⓑ" + data[3].message2 + "</br>"+'</span>';
        }
        $('#actComment').html(html);
      },
    error: function(err) {
      console.log(err);
    }
  });
});
$('#tempbtn').click(function() {      
  $.ajax({
  url: 'http://smart.aircok.com:13701/report/getActComment?deviceData='+"date: "+date+", co2: "+co2+", hcho: "+hcho +", deviceName: "+deviceName
      +", pm10: "+pm10+", pm25: "+pm25+", voc: "+voc+", humidity: "+humidity+", temperature: "+temperature+", humidityIndex: "+humidityIndex+", temperatureIndex: "+temperatureIndex+", jisuGubun: web",
  type: 'POST',
  dataType : "json",
  success: function(res) {
        var data = res.data;
        var dataLen = data.length;
        var html = '';
        for (var i = 0; i < dataLen; i++){
        }
        if(data[0].message1 == null){
        html += '<span style="font-size :14px; font-weight: bold; color:white; font-family:Noto Sans KR ">' + "</br>" +data[0].noti2 + "</br>" +   data[0].noti4+ "</br>"  + '</span>';
      }else{
        html += '<span style="font-size :14px; font-weight: bold; color:white; font-family:Noto Sans KR">' + "</br>" +data[0].noti2 + "</br>" +   data[0].noti4+ "</br>"  + '</span>';
        html += '<span style="font-size :12px; color:white; font-family:Noto Sans KR">' + "ⓐ" + data[0].message1 + "</br>" + "ⓑ" + data[0].message2 + "</br>"+'</span>';
      }
      $('#actComment').html(html);
    },
  error: function(err) {
    console.log(err);
  }
});
});
$('#humibtn').click(function() {      
  $.ajax({
  url: 'http://smart.aircok.com:13701/report/getActComment?deviceData='+"date: "+date+", co2: "+co2+", hcho: "+hcho +", deviceName: "+deviceName
      +", pm10: "+pm10+", pm25: "+pm25+", voc: "+voc+", humidity: "+humidity+", temperature: "+temperature+", humidityIndex: "+humidityIndex+", temperatureIndex: "+temperatureIndex+", jisuGubun: web",
  type: 'POST',
  dataType : "json",
  success: function(res) {
        var data = res.data;
        var dataLen = data.length;
        var html = '';
        for (var i = 0; i < dataLen; i++){
        }
        if(data[1].message1 == null){
        html += '<span style="font-size :14px; font-weight: bold; color:white; font-family:Noto Sans KR ">' + "</br>" +data[1].noti2 + "</br>" +   data[1].noti4+ "</br>"  + '</span>';
      }else{
        html += '<span style="font-size :14px; font-weight: bold; color:white; font-family:Noto Sans KR">' + "</br>" +data[1].noti2 + "</br>" +   data[1].noti4+ "</br>"  + '</span>';
        html += '<span style="font-size :12px; color:white; font-family:Noto Sans KR">' + "ⓐ" + data[1].message1 + "</br>" + "ⓑ" + data[1].message2 + "</br>"+'</span>';
      }
      $('#actComment').html(html);
    },
  error: function(err) {
    console.log(err);
  }
});
});
$('#co2btn').click(function() {      
  $.ajax({
  url: 'http://smart.aircok.com:13701/report/getActComment?deviceData='+"date: "+date+", co2: "+co2+", hcho: "+hcho +", deviceName: "+deviceName
      +", pm10: "+pm10+", pm25: "+pm25+", voc: "+voc+", humidity: "+humidity+", temperature: "+temperature+", humidityIndex: "+humidityIndex+", temperatureIndex: "+temperatureIndex+", jisuGubun: web",
  type: 'POST',
  dataType : "json",
  success: function(res) {
        var data = res.data;
        var dataLen = data.length;
        var html = '';
        for (var i = 0; i < dataLen; i++){
        }
        if(data[4].message1 == null){
        html += '<span style="font-size :14px; font-weight: bold; color:white; font-family:Noto Sans KR ">' + "</br>" +data[4].noti2 + "</br>" +   data[4].noti4+ "</br>"  + '</span>';
      }else{
        html += '<span style="font-size :14px; font-weight: bold; color:white; font-family:Noto Sans KR">' + "</br>" +data[4].noti2 + "</br>" +   data[4].noti4+ "</br>"  + '</span>';
        html += '<span style="font-size :12px; color:white; font-family:Noto Sans KR">' + "ⓐ" + data[4].message1 + "</br>" + "ⓑ" + data[4].message2 + "</br>"+'</span>';
      }
      $('#actComment').html(html);
    },
  error: function(err) {
    console.log(err);
  }
});
});
$('#vocbtn').click(function() {      
  $.ajax({
  url: 'http://smart.aircok.com:13701/report/getActComment?deviceData='+"date: "+date+", co2: "+co2+", hcho: "+hcho +", deviceName: "+deviceName
      +", pm10: "+pm10+", pm25: "+pm25+", voc: "+voc+", humidity: "+humidity+", temperature: "+temperature+", humidityIndex: "+humidityIndex+", temperatureIndex: "+temperatureIndex+", jisuGubun: web",
  type: 'POST',
  dataType : "json",
  success: function(res) {
        var data = res.data;
        var dataLen = data.length;
        var html = '';
        for (var i = 0; i < dataLen; i++){
        }
        if(data[5].message1 == null){
        html += '<span style="font-size :14px; font-weight: bold; color:white; font-family:Noto Sans KR ">' + "</br>" +data[5].noti2 + "</br>" +  data[5].noti4+ "</br>"  + '</span>';
      }else{
        html += '<span style="font-size :14px; font-weight: bold; color:white; font-family:Noto Sans KR">' + "</br>" +data[5].noti2 + "</br>" +  data[5].noti4+ "</br>"  + '</span>';
        html += '<span style="font-size :12px; color:white; font-family:Noto Sans KR">' + "ⓐ" + data[5].message1 + "</br>" + "ⓑ" + data[5].message2 + "</br>"+'</span>';
      }
      $('#actComment').html(html);
    },
  error: function(err) {
    console.log(err);
  }
});
});
$('#hchobtn').click(function() {      
  $.ajax({
  url: 'http://smart.aircok.com:13701/report/getActComment?deviceData='+"date: "+date+", co2: "+co2+", hcho: "+hcho +", deviceName: "+deviceName
      +", pm10: "+pm10+", pm25: "+pm25+", voc: "+voc+", humidity: "+humidity+", temperature: "+temperature+", humidityIndex: "+humidityIndex+", temperatureIndex: "+temperatureIndex+", jisuGubun: web",
  type: 'POST',
  dataType : "json",
  success: function(res) {
        var data = res.data;
        var dataLen = data.length;
        var html = '';
        for (var i = 0; i < dataLen; i++){
        }
        if(data[6].message1 == null){
        html += '<span style="font-size :14px; font-weight: bold; color:white; font-family:Noto Sans KR ">' + "</br>" +data[6].noti2 + "</br>" +  data[6].noti4+ "</br>"  + '</span>';
      }else{
        html += '<span style="font-size :14px; font-weight: bold; color:white; font-family:Noto Sans KR">' + "</br>" +data[6].noti2 + "</br>" + data[6].noti4+ "</br>"  + '</span>';
        html += '<span style="font-size :12px; color:white; font-family:Noto Sans KR">' + "ⓐ" + data[6].message1 + "</br>" + "ⓑ" + data[6].message2 + "</br>"+'</span>';
      }
      $('#actComment').html(html);
    },
  error: function(err) {
    console.log(err);
  }
});
});
$('#btn').click(function() {      
  $('#actComment').empty();
});


  }
  act();
  return (
      <React.Fragment>
      <div className="card card-block d-flex" style={{height:"378px",backgroundColor:"transparent"}}>
        <div
          className="card-header bg-gray text-center p-2"
          style={{
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            backgroundColor:"rgb(72, 68, 68)"
          }}
        >
          <i className="zmdi zmdi-comment-text mr-1" style={{color:"white"}}/>
          <span style={{ fontSize: "17px" ,fontFamily: "Noto Sans KR",color:"white" }}> 행동요령</span>
        </div>
        <div className="card-body align-items-center text-center h-100" style={{backgroundColor:"#282834"}}>
          <div className="row align-items-center h-100 text-left" id="comment">
            <div id="com" className="col" style={{maxWidth:"96%",height:"255px",border:"1px solid rgb(65 65 65)",marginLeft:"13px",borderRadius:"7px",marginTop:"22px"}}> 
            {/* //,padding:"30px 20px",textAlign:"center" */}
            <span id="totalComment" style={{ whiteSspace: "normal",fontWeight:"bold",fontSize :"14px",color:"white",fontFamily:"Noto Sans KR"}}>
              </span>
          </div>
          </div>
          {/* <div className="card-body align-items-center text-center h-100">
          <div className="row align-items-center h-100 text-left">
            <div className="col" style={{maxWidth:"103%",maxHeight:"190px",marginLeft:"-10px",borderRadius:"7px", overflowX: "auto",top:"-226px"}}>
          <button className={getClassText(pm10Index)} id ="pm10btn" >
              <img
                src={pm10icon}
                alt="icons"
                style={{ 
                  width: "87px", 
                  height: "70px",
                   }}
              />
            </button>
            <button className={getClassText(pm25Index)} id="pm25btn">
              <img
                src={pm25icon}
                alt="icons"
                style={{ width: "87px", height: "70px" }}
              />
            </button>
            <button className={getClassText(temperatureIndex)} id="tempbtn">
              <img
                src={tempicon}
                alt="icons"
                style={{ width: "87px", height: "70px" }}
              />
            </button>
            <button className={getClassText(humidityIndex)} id="humibtn">
              <img
                src={humiicon}
                alt="icons"
                style={{ width: "87px", height: "70px" }}
              />
            </button>
            <button className={getClassText(co2Index)} id="co2btn">
              <img
                src={co2icon}
                alt="icons"
                style={{ width: "87px", height: "70px" }}
              />
            </button>
            <button className={getClassText(vocIndex)} id="vocbtn">
              <img
                src={vocicon}
                alt="icons"
                style={{ width: "87px", height: "70px" }}
              />
            </button>
            <button className={getClassText(hchoIndex)} id="hchobtn">
              <img
                src={hchoicon}
                alt="icons"
                style={{ width: "87px", height: "70px" }}
              />
            </button>
            <button style={{ width: "87px", height: "70px" }} id="btn">
                  X
            </button>
            <span id="actComment" style={{ whiteSspace: "normal"}}>
          </span>
          </div>
          </div>
          </div> */}
          </div>
        </div>
    </React.Fragment>
    );
  }
}
export default AdviceInfo;




