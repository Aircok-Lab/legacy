var pool = require("../config/database");

var NotiMessage = {
  makeMessage: function(p_deviceSN,p_date,p_jisuGubun,p_pm10,p_pm25,p_co2,p_hcho,p_voc,p_temperature,p_humidity,p_noise,p_co, p_positionName, p_deviceName, p_buildingID, p_positionID,p_buildingType, callback) {
    console.log("makeMessage 호출됨");

    console.log("p_buildingID 임 :" + p_buildingID);
    console.log("p_positionID 임 :" + p_positionID);
    console.log("p_buildingType 임 :" + p_buildingType);

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      sqlStr =
        "select noti1 , noti2 from  monitoring.Noti where sensortype = '" + p_jisuGubun + "' and buildingtype = '" + p_buildingType + "' and months like '%" + p_date +"%' " 
      if (p_jisuGubun == 'co2'){
        sqlStr = sqlStr + " and " + p_co2 + " between startvalue and endvalue ";
      } 
      if (p_jisuGubun == 'hcho'){
        sqlStr = sqlStr + " and " + p_hcho + " between startvalue and endvalue ";
      } 
      if (p_jisuGubun == 'humidity'){
        sqlStr = sqlStr + " and " + p_humidity + " between startvalue and endvalue ";
      } 
      if (p_jisuGubun == 'pm10'){
        sqlStr = sqlStr + " and " + p_pm10 + " between startvalue and endvalue ";
      } 
      if (p_jisuGubun == 'pm25'){
        sqlStr = sqlStr + " and " + p_pm25 + " between startvalue and endvalue ";
      } 
      if (p_jisuGubun == 'temperature'){
        sqlStr = sqlStr + " and " + p_temperature + " between startvalue and endvalue ";
      } 
      if (p_jisuGubun == 'voc'){
        sqlStr = sqlStr + " and " + p_voc + " between startvalue and endvalue ";
      } 

      // SQL문을 실행합니다.
      var exec = conn.query(sqlStr, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함 : 디바이스정보");
          console.dir(err);

          callback(err, null);
          return;
        }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        console.log(">> json: ", json);
        var smsInfo = json;
        //let alarmCnt = 0;
        let message = "";        

        if (smsInfo.length) {
          var deviceInfo = json[0];
          message =  p_positionName + ':' + p_deviceName + '이(가)\n' + deviceInfo.noti1 + '\n' + deviceInfo.noti2;                    
          // message =  deviceInfo.noti1 + deviceInfo.noti2;                    
        }
        
        smsInfo.message = message;
        callback(null, smsInfo);
      });      
    });
  },
  deviceInfo: function(p_deviceSN, callback) {
    console.log("deviceInfo 호출됨");
    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      sqlStr =
        "select Device.serialNumber, Device.positionID, Position.buildingID,  Device.buildingType from monitoring.Device as Device, monitoring.Position as Position " +
        "where Device.serialNumber = '" + p_deviceSN + "'  and  Device.positionID = Position.id "; 
        
      // SQL문을 실행합니다.
      var exec = conn.query(sqlStr, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함 : 디바이스정보");
          console.dir(err);

          callback(err, null);
          return;
        }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        //console.log(">> json: ", json);
        //var smsInfo = json;
        //let alarmCnt = 0;
        //let message = "";        

        /* if (smsInfo.length) {
          var deviceInfo = json[0];
          g_serialNumber=deviceInfo.serialNumber;
          g_positionID=deviceInfo.positionID;
          g_buildingID=deviceInfo.buildingID;
          g_buildingType =deviceInfo.buildingType;          
        } */
        //smsInfo.message = message;
        // console.log(">> smsInfo: ", smsInfo);
        callback(null, json[0]);
      });      
    });
  }
};
module.exports = NotiMessage;
