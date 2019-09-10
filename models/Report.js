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

  get5minDataByDate: function(
    productInfo,
    serialNumber,
    startDate,
    endDate,
    callback
  ) {
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
  }
};

module.exports = Report;
