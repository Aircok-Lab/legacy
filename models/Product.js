var pool = require("../config/database");

var Product = {
  getAllProduct: function(callback) {
    console.log("getAllProduct 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      // SQL문을 실행합니다.
      var exec = conn.query("Select * from Product", function(err, result) {
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
        var allProducts = json;

        callback(null, allProducts);
      });
    });
  },
  getProductById: function(id, callback) {
    console.log("getProductById 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      // SQL문을 실행합니다.
      var exec = conn.query("Select * from Product where id=?", id, function(
        err,
        result
      ) {
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
        var productInfo = json;

        callback(null, productInfo);
      });
    });
  },
  addProduct: function(
    name,
    version,
    ip,
    period,
    indoor,
    pm25,
    pm10,
    co2,
    hcho,
    voc,
    temperature,
    humidity,
    noise,
    callback
  ) {
    console.log("addProduct 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      // 데이터를 객체로 만듭니다.
      var data = {
        name: name,
        version: version,
        ip: ip,
        period: period,
        indoor: indoor,
        pm25: pm25,
        pm10: pm10,
        co2: co2,
        hcho: hcho,
        voc: voc,
        temperature: temperature,
        humidity: humidity,
        noise: noise
      };

      // SQL문을 실행합니다.
      var exec = conn.query("insert into Product set ?", data, function(
        err,
        result
      ) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }

        callback(null, result);
      });
    });
  },
  updateProduct: function(
    id,
    name,
    version,
    ip,
    period,
    indoor,
    pm25,
    pm10,
    co2,
    hcho,
    voc,
    temperature,
    humidity,
    noise,
    callback
  ) {
    console.log("updateProduct 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      // 데이터를 객체로 만듭니다.
      var data = [
        name,
        version,
        ip,
        period,
        indoor,
        pm25,
        pm10,
        co2,
        hcho,
        voc,
        temperature,
        humidity,
        noise,
        id
      ];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "update Product set name=?, version=?, ip=?, period=?, indoor=?, pm25=?, pm10=?, co2=?, hcho=?, voc=?, temperature=?, humidity=?, noise=? where id=?",
        data,
        function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.
          console.log("실행 대상 SQL : " + exec.sql);

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            callback(err, null);
            return;
          }
          var success = false;
          if (result.changedRows > 0) success = true;

          callback(null, success);
        }
      );
    });
  },
  deleteProduct: function(productId, callback) {
    console.log("deleteProduct 호출됨 productId : " + productId);
    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      // 데이터를 객체로 만듭니다.
      var queryString = "delete from Product where id in(" + productId + ")";

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
        var success = "true";
        callback(null, success);
      });
    });
  }
};
module.exports = Product;
