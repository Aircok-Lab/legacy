var pool = require("../config/database");

var Report = {
  getAVGe3ScoreByDate: function(serialNumber, startDate, endDate, callback) {
    console.log("getAVGe3ScoreByDate 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      //데이터를 객체로 만듭니다.
      var tableName = "Alarm_" + serialNumber;
      var queryString =
        "select ROUND(AVG(e3Score)) as avg from " +
        tableName +
        " where date >= " +
        "'" +
        startDate +
        "'" +
        " and date < " +
        "'" +
        endDate +
        "'";
      // SQL문을 실행합니다.
      var exec = conn.query(queryString, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        callback(null, result[0].avg);
      });
    });
  },

  getCountE3Index: function(
    serialNumber,
    startDate,
    endDate,
    e3Index,
    callback
  ) {
    console.log("getCountE3Index 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      //데이터를 객체로 만듭니다.
      var tableName = "Alarm_" + serialNumber;
      var queryString =
        "select count(e3Index) as count from " +
        tableName +
        " where date >= " +
        "'" +
        startDate +
        "'" +
        " and date < " +
        "'" +
        endDate +
        "'" +
        " and e3Index = " +
        e3Index;
      // SQL문을 실행합니다.
      var exec = conn.query(queryString, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);
          callback(err, null);
          return;
        }
        callback(null, result[0].count);
      });
    });
  },
  getChartDataByDate: function(serialNumber, startDate, endDate, callback) {
    console.log("getChartDataByDate 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      //데이터를 객체로 만듭니다.
      var tableName = "Data_" + serialNumber;
      var queryString =
        "select * from " +
        tableName +
        " where date >= " +
        "'" +
        startDate +
        "'" +
        " and date < " +
        "'" +
        endDate +
        "'" +
        "and pm10 != 9999 and pm25 != 9999"
        ;
      // SQL문을 실행합니다.
      var exec = conn.query(queryString, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        var chartData = json;
        console.dir(chartData);
        callback(null, chartData);
      });
    });
  },

  getChartDataByDateByGet: function(productInfo, serialNumber, startDate, endDate, callback) {
    console.log("getChartDataByDateByGet 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      //데이터를 객체로 만듭니다.
      var tableName = "Data_" + serialNumber;
      var queryString =
        "select date_format(date, '%Y-%m-%d %H:%i') as date ";
        if (productInfo.pm10)
          queryString = queryString + ", pm10";
        if (productInfo.pm25)         
          queryString = queryString + ", pm25";
        if (productInfo.co2)
          queryString = queryString + ", co2";
        if (productInfo.hcho)
          queryString = queryString + ", hcho";
        if (productInfo.voc)
          queryString = queryString + ",  voc";
        if (productInfo.temperature)
          queryString = queryString + ", temperature";
        if (productInfo.humidity)
          queryString = queryString + ", humidity";
        if (productInfo.noise)
          queryString = queryString + ", noise";
        if (productInfo.co)
          queryString = queryString + ", co"; 
        queryString = queryString + " from " + tableName +
        " where date >= " +
        "'" +
        startDate +
        " 00:00:00'" +
        " and date <= " +
        "'" +
        endDate +
        " 23:59:59'";       
      
      // SQL문을 실행합니다.
      var exec = conn.query(queryString, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        //var string = JSON.stringify(result);
        //var json = JSON.parse(string);
        //var chartData = json;
        //console.dir(chartData);
        // callback(null, chartData);
        callback(null, result);
      });
    });
  },

  getChartDataByDate2: function(productInfo,serialNumber, startDate, endDate, callback) {
    console.log("getChartDataByDate2 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      //데이터를 객체로 만듭니다.
      var tableName = "Data_" + serialNumber;
      var queryString =
        "select date_format(date, '%Y-%m-%d %H:%i') as date, e3Index, e3Score";
      if (productInfo.pm10)
        queryString =
          queryString +
          ", pm10,  pm10Index, pm10Alarm";
      if (productInfo.pm25)
        queryString =
          queryString +
          ", pm25, pm25Index, pm25Alarm";
      if (productInfo.co2)
        queryString =
          queryString +
          ", co2, co2Index, co2Alarm";
      if (productInfo.hcho)
        queryString =
          queryString +
          ", hcho, hchoIndex, hchoAlarm";
      if (productInfo.voc)
        queryString =
          queryString +
          ",  voc,  vocIndex, vocAlarm";
      if (productInfo.temperature)
        queryString =
          queryString +
          ", temperature, temperatureIndex, temperatureAlarm";
      if (productInfo.humidity)
        queryString =
          queryString +
          ", humidity, humidityIndex, humidityAlarm";
      if (productInfo.noise)
        queryString =
          queryString +
          ", noise, noiseIndex, noiseAlarm";
      if (productInfo.co)
        queryString =
          queryString +
          ", co, coIndex, coAlarm";
      queryString = queryString + " from  " + tableName;
      queryString =
        queryString +
        " where date >= " +
        "'" +
        startDate +
        "'" +
        " and date < " +
        "'" +
        endDate +
        "'";
      // SQL문을 실행합니다.
      var exec = conn.query(queryString, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        var chartData = json;
        console.dir(chartData);
        callback(null, chartData);
      });
    });
  },

  getChartDataByDate3: function(productInfo,serialNumber, callback) {
    console.log("getChartDataByDate3 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      //데이터를 객체로 만듭니다.
      var tableName = "Data_" + serialNumber;
      var queryString =
        "select date_format(date, '%Y-%m-%d %H:%i') as date, e3Index, e3Score";
      if (productInfo.pm10)
        queryString =
          queryString +
          ", pm10,  pm10Index, pm10Alarm";
      if (productInfo.pm25)
        queryString =
          queryString +
          ", pm25, pm25Index, pm25Alarm";
      if (productInfo.co2)
        queryString =
          queryString +
          ", co2, co2Index, co2Alarm";
      if (productInfo.hcho)
        queryString =
          queryString +
          ", hcho, hchoIndex, hchoAlarm";
      if (productInfo.voc)
        queryString =
          queryString +
          ",  voc,  vocIndex, vocAlarm";
      if (productInfo.temperature)
        queryString =
          queryString +
          ", temperature, temperatureIndex, temperatureAlarm";
      if (productInfo.humidity)
        queryString =
          queryString +
          ", humidity, humidityIndex, humidityAlarm";
      if (productInfo.noise)
        queryString =
          queryString +
          ", noise, noiseIndex, noiseAlarm";
      if (productInfo.co)
        queryString =
          queryString +
          ", co, coIndex, coAlarm";
      queryString = queryString + " from  " + tableName + " order by id desc limit 1000 ";
      // 이거 반영 20200828
      // SQL문을 실행합니다.
      var exec = conn.query(queryString, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        var chartData = json;
        console.dir(chartData);
        callback(null, chartData);
      });
    });
  },

  get5minDataByDate: function(
    productInfo,
    serialNumber,
    startDate,
    endDate,
    callback
  ) {
    console.log("get5minDataByDate 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      //데이터를 객체로 만듭니다.
      var tableName = "Data_" + serialNumber;
      var queryString =
        "select date_format(date, '%Y-%m-%d %H:%i') as date, round(avg(e3Index),0) as e3Index, round(avg(e3Score),0) as e3Score";
      if (productInfo.pm10)
        queryString =
          queryString +
          ", round(avg(pm10), 0) as pm10, round(avg(pm10Index), 0) as pm10Index, sum(pm10Alarm) as pm10Alarm";
      if (productInfo.pm25)
        queryString =
          queryString +
          ", round(avg(pm25), 0) as pm25, round(avg(pm25Index), 0) as pm25Index, sum(pm25Alarm) as pm25Alarm";
      if (productInfo.co2)
        queryString =
          queryString +
          ", round(avg(co2), 0) as co2, round(avg(co2Index), 0) as co2Index, sum(co2Alarm) as co2Alarm";
      if (productInfo.hcho)
        queryString =
          queryString +
          ", round(avg(hcho), 0) as hcho, round(avg(hchoIndex), 0) as hchoIndex, sum(hchoAlarm) as hchoAlarm";
      if (productInfo.voc)
        queryString =
          queryString +
          ", round(avg(voc), 0) as voc, round(avg(vocIndex), 0) as vocIndex, sum(vocAlarm) as vocAlarm";
      if (productInfo.temperature)
        queryString =
          queryString +
          ", round(avg(temperature), 0) as temperature, round(avg(temperatureIndex), 0) as temperatureIndex, sum(temperatureAlarm) as temperatureAlarm";
      if (productInfo.humidity)
        queryString =
          queryString +
          ", round(avg(humidity), 0) as humidity, round(avg(humidityIndex), 0) as humidityIndex, sum(humidityAlarm) as humidityAlarm";
      if (productInfo.noise)
        queryString =
          queryString +
          ", round(avg(noise), 0) as noise, round(avg(noiseIndex), 0) as noiseIndex, sum(noiseAlarm) as noiseAlarm";
      if (productInfo.co)
        queryString =
          queryString +
          ", round(avg(co), 0) as co, round(avg(coIndex), 0) as coIndex, sum(coAlarm) as coAlarm";

      queryString = queryString + " from  " + tableName;
      queryString =
        queryString +
        " where date >= " +
        "'" +
        startDate +
        "'" +
        " and date < " +
        "'" +
        endDate +
        "'";
      queryString =
        queryString +
        " group BY DATE(date), HOUR(date), FLOOR(MINUTE(date) /5)";

      // SQL문을 실행합니다.
      var exec = conn.query(queryString, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        var data = json;
        console.dir(data);
        callback(null, data);
      });
    });
  },
  getHourDataByDate: function(
    productInfo,
    serialNumber,
    startDate,
    endDate,
    callback
  ) {
    console.log("getHourDataByDate 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      //데이터를 객체로 만듭니다.
      var tableName = "Data_" + serialNumber;
      var queryString =
        "select date_format(date, '%Y-%m-%d %H:%i') as date, round(avg(e3Index),0) as e3Index, round(avg(e3Score),0) as e3Score";
      if (productInfo.pm10)
        queryString =
          queryString +
          ", round(avg(pm10), 0) as pm10, round(avg(pm10Index), 0) as pm10Index, sum(pm10Alarm) as pm10Alarm";
      if (productInfo.pm25)
        queryString =
          queryString +
          ", round(avg(pm25), 0) as pm25, round(avg(pm25Index), 0) as pm25Index, sum(pm25Alarm) as pm25Alarm";
      if (productInfo.co2)
        queryString =
          queryString +
          ", round(avg(co2), 0) as co2, round(avg(co2Index), 0) as co2Index, sum(co2Alarm) as co2Alarm";
      if (productInfo.hcho)
        queryString =
          queryString +
          ", round(avg(hcho), 0) as hcho, round(avg(hchoIndex), 0) as hchoIndex, sum(hchoAlarm) as hchoAlarm";
      if (productInfo.voc)
        queryString =
          queryString +
          ", round(avg(voc), 0) as voc, round(avg(vocIndex), 0) as vocIndex, sum(vocAlarm) as vocAlarm";
      if (productInfo.temperature)
        queryString =
          queryString +
          ", round(avg(temperature), 0) as temperature, round(avg(temperatureIndex), 0) as temperatureIndex, sum(temperatureAlarm) as temperatureAlarm";
      if (productInfo.humidity)
        queryString =
          queryString +
          ", round(avg(humidity), 0) as humidity, round(avg(humidityIndex), 0) as humidityIndex, sum(humidityAlarm) as humidityAlarm";
      if (productInfo.noise)
        queryString =
          queryString +
          ", round(avg(noise), 0) as noise, round(avg(noiseIndex), 0) as noiseIndex, sum(noiseAlarm) as noiseAlarm";
      if (productInfo.co)
        queryString =
          queryString +
          ", round(avg(co), 0) as co, round(avg(coIndex), 0) as coIndex, sum(coAlarm) as coAlarm";

      queryString = queryString + " from  " + tableName;
      queryString =
        queryString +
        " where date >= " +
        "'" +
        startDate +
        "'" +
        " and date < " +
        "'" +
        endDate +
        "'";
      queryString = queryString + " group BY DATE(date), HOUR(date)";

      // SQL문을 실행합니다.
      var exec = conn.query(queryString, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        var data = json;
        console.dir(data);
        callback(null, data);
      });
    });
  },
  //getWqPredDataBySerial: function(serialNumber, startDate, endDate, callback) {
  getWqPredDataBySerial: function(
    p_serialNumber,
    callback) {
    console.log("getWqPredDataBySerial 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      //데이터를 객체로 만듭니다.
      // var tableName = "Data_" + serialNumber;
      var queryString =
      "select * from wq.Data_Pred_"+p_serialNumber+" " +
      "where date = "+
      "( SELECT max(date) FROM wq.Data_Pred_"+p_serialNumber+" ) "+
      " order by id ";
      // SQL문을 실행합니다.
      var exec = conn.query(queryString, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        var predData = json;
        console.dir(predData);
        callback(null, predData);
      });
    });
  },
  getPredDataBySerial: function(
    p_serialNumber,
    callback) {
    console.log("getPredDataBySerial 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      //데이터를 객체로 만듭니다.
      // var tableName = "Data_" + serialNumber;
      var queryString =
      "(select id,date,pm10,pm25 from wq.Pre_Proc_"+p_serialNumber+" " +
      "order by id desc limit 0,5)"+
      "UNION"+
      "(SELECT id,date,pm10_pred,pm25_pred FROM wq.Data_Pred_"+p_serialNumber+" " +
      "order by id desc limit 0,6)";
      // SQL문을 실행합니다.
      var exec = conn.query(queryString, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        var predData = json;
        console.dir(predData);
        callback(null, predData);
      });
    });
  },
  getDevice10min: function(
    p_serialNumber,
    callback) {
    console.log("getPredDataBySerial 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      //데이터를 객체로 만듭니다.
      // var tableName = "Data_" + serialNumber;
      var queryString =
      "SELECT date,pm10,pm25 from monitoring.Data_"+p_serialNumber+" " +
      "order by id desc limit 0,60";
      // SQL문을 실행합니다.
      var exec = conn.query(queryString, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        var minData = json;
        console.dir(minData);
        callback(null, minData);
      });
    });
  },
  getActComment: function(
    p_temperature,
    p_pm25,
    p_pm10,
    p_co2,
    p_hcho,
    p_voc,
    p_date,
    p_humidity,
    p_temperatureIndex,
    p_humidityIndex,
    p_jisuGubun,
    p_deviceName,
    callback) {
    console.log("getActComment쿼리 호출됨");

    console.log("p_temperature:"+p_temperature);
    console.log("p_humidity:"+p_humidity);
    console.log("p_pm25:"+p_pm25);
    console.log("p_co2:"+p_co2);
    console.log("p_hcho:"+p_hcho);
    console.log("p_voc:"+p_voc);
    console.log("p_date:" + p_date);
    console.log("p_temperatureIndex:"+p_temperatureIndex);
    console.log("p_humidityIndex:" + p_humidityIndex);
    console.log("p_jisuGubun:" + p_jisuGubun);
    console.log("p_deviceName:" + p_deviceName);
  pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);
      //데이터를 객체로 만듭니다.
     
    queryString = "select id,sensortype,buildingtype,months,startvalue,endvalue,indexvalue,indexname,noti2,noti4,(select message from monitoring.Noti_detail where id = a.id and notigubun = '4' order by rand() limit 1 ) as message1,noti5,(select message from monitoring.Noti_detail where id = a.id and notigubun = '5' order by rand() limit 1 ) as message2";
    queryString +=  " from (select id, sensortype, buildingtype, months, startvalue, endvalue, indexvalue, indexname, noti2, case when noti4 != '' then concat(noti4) else '' end as noti4, noti5";
    queryString +=  " from monitoring.Noti";
    queryString +=  " where 1 = 1";
    queryString +=  " and instr(months, substring('"+p_date+"', 6, 2)) != 0";
    queryString +=  " and case sensortype "
    
    if(p_jisuGubun == 'web' || p_jisuGubun == 'temperature'){
      queryString +=  " when 'temperature' then (startvalue <= '" + p_temperature + "' and '" + p_temperature + "' < endvalue) and indexvalue = '" + p_temperatureIndex + "'";
    }
    if(p_jisuGubun == 'web' || p_jisuGubun == 'humidity'){
      queryString +=  " when 'humidity' then (startvalue <= '" + p_humidity + "' and " + p_humidity + " < endvalue) and indexvalue = '" + p_humidityIndex + "' " ;
    }
    if(p_jisuGubun == 'web' || p_jisuGubun == 'voc'){
      queryString +=  " when 'voc' then (startvalue <= '" + p_voc + "' and '" + p_voc + "' <= endvalue) ";
    }
    if(p_jisuGubun == 'web' || p_jisuGubun == 'pm25'){
      queryString +=  " when 'pm25' then (startvalue <= '" + p_pm25 + "' and '" + p_pm25 + "' <= endvalue)";
    }
    if(p_jisuGubun == 'web' || p_jisuGubun == 'pm10'){
      queryString +=  " when 'pm10' then (startvalue <= '" + p_pm10 + "' and '" + p_pm10 + "' <= endvalue) ";
    }
    if(p_jisuGubun == 'web' || p_jisuGubun == 'hcho'){
      queryString +=  " when 'hcho' then (startvalue <= '" + p_hcho + "' and '" + p_hcho + "' <= endvalue) ";
    }
    if(p_jisuGubun == 'web' || p_jisuGubun == 'co2'){
      queryString +=  " when 'co2' then (startvalue <= '" + p_co2 + "' and '" + p_co2 + "' <= endvalue) ";
    }
    queryString +=  " else '' end ) a; ";
    
          // SQL문을 실행합니다.
      var exec = conn.query(queryString, function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);
        
      if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        console.log(">> json: ", json);
        var actComment = json;
        //앱 부분
        if(p_jisuGubun != 'web'){
          let message = "";        
          var deviceInfo = json[0]; 
            if( (deviceInfo.noti2 == null || deviceInfo.noti2 == '')
            && (deviceInfo.noti4 == null || deviceInfo.noti4 == '') 
            && (deviceInfo.noti5 == null || deviceInfo.noti5 == '') 
            && (deviceInfo.message1 == null || deviceInfo.message1 == '')
            && (deviceInfo.message2 == null || deviceInfo.message2 == '') ){
            message = " ";
          }else{ 
            if((deviceInfo.noti2 == null || deviceInfo.noti2 == '')){
              deviceInfo.noti2 = '';
            }else{
              deviceInfo.noti2 += '/n';
            }
            if((deviceInfo.noti4 == null || deviceInfo.noti4 == '')){
              deviceInfo.noti4 = '';
            }else{
              deviceInfo.noti4 += '/n';
            }
            if((deviceInfo.noti5 == null || deviceInfo.noti5 == '')){
              deviceInfo.noti5 = '';
            }else{
              deviceInfo.noti5 += '/n';
            }
            if((deviceInfo.message1 == null || deviceInfo.message1 == '')){
              deviceInfo.message1 = '';
            }else{
              deviceInfo.message1 += '/n';
            }
            if(deviceInfo.message2 == null){
              deviceInfo.message2 = '';
            }else{
              deviceInfo.message2 += '/n';
            }
            message = deviceInfo.noti2 + p_deviceName + deviceInfo.noti4 + deviceInfo.message1 + deviceInfo.noti5 +deviceInfo.message2; 
            message = message.slice(0,-2);
          }
          callback(null, message);
        }else{ //web 부분
          callback(null, actComment);
        }
        // let message = "";        

        // if (actComment.length) {
        //   var deviceInfo = json[0]; 
        //   message = deviceInfo.noti2 + deviceInfo.noti4 + deviceInfo.message1 + deviceInfo.noti5+deviceInfo.message2; 
        // }
        // actComment.message = message;
        //callback(null, actComment);
      });
    });
  }
};

module.exports = Report;
