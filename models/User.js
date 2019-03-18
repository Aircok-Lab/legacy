var pool = require("../config/database");

var User = {
  getAllUsers: function(callback) {
    console.log("getAllUsers 호출됨");

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
      var exec = conn.query("Select * from User", function(err, result) {
        conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }

        // console.log('>> result: ', result );
        var string = JSON.stringify(result);
        // console.log('>> string: ', string );
        var json = JSON.parse(string);
        console.log(">> json: ", json);
        var allUsers = json;

        callback(null, allUsers);
      });
    });
  },

  getUserByBuildingId: function(buildingId, callback) {
    console.log("getUserByBuildingId 호출됨 buildingId : " + buildingId);
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
      var ids = buildingId.split(",");
      console.log(ids);
      var queryString = "select * from User where ";
      for (i in ids) {
        let idStr = "/" + ids[i] + ",/";
        let str = "instr(buildingList,'" + idStr + "') > 0";
        queryString = queryString + str;
        if (i < ids.length - 1) queryString = queryString + " or ";
      }

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
        var usersByBuildingId = json;

        callback(null, usersByBuildingId);
      });
    });
  },

  getUserByPositionId: function(positionId, callback) {
    console.log("getUserByPositionId 호출됨 positionId : " + positionId);
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
      var ids = positionId.split(",");
      console.log(ids);
      var queryString = "select * from User where ";
      for (i in ids) {
        let idStr = "/" + ids[i] + ",/";
        let str = "instr(positionList,'" + idStr + "') > 0";
        queryString = queryString + str;
        if (i < ids.length - 1) queryString = queryString + " or ";
      }

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
        var usersByPositionId = json;

        callback(null, usersByPositionId);
      });
    });
  },

  getUserByDeviceSN: function(deviceList, callback) {
    console.log("getUserByDeviceSN 호출됨 deviceList : " + deviceList);
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
      var ids = deviceList.split(",");
      console.log(ids);
      var queryString = "select * from User where ";
      for (i in ids) {
        let idStr = "/" + ids[i] + ",/";
        let str = "instr(deviceList,'" + idStr + "') > 0";
        queryString = queryString + str;
        if (i < ids.length - 1) queryString = queryString + " or ";
      }

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
        var usersByDeviceSN = json;

        callback(null, usersByDeviceSN);
      });
    });
  },

  getUserPassword: function(loginId, email, callback) {
    console.log("getUserPassword 호출됨");

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
      var data = [loginId, email];
      var findPassword = null;

      // SQL문을 실행합니다.
      var exec = conn.query(
        "select password from User where loginID =? and email = ?",
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

          findPassword = result[0].password;

          callback(null, findPassword);
        }
      );
    });
  },

  getLoginId: function(name, email, callback) {
    console.log("getLoginId 호출됨");

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
      var data = [name, email];
      var findLoginID = [];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "select loginID from User where name =? and email = ?",
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

          var string = JSON.stringify(result);
          var json = JSON.parse(string);
          console.log(">> json: ", json);
          findLoginID = json;

          callback(null, findLoginID);
        }
      );
    });
  },

  approvalUser: function(state, callback) {
    console.log("approvalUser 호출됨");

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
      var approvalUsers = [];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "select * from User where approval=? ",
        state,
        function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.
          console.log("실행 대상 SQL : " + exec.sql);

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            callback(err, null);
            return;
          }

          // console.log('>> result: ', result );
          var string = JSON.stringify(result);
          // console.log('>> string: ', string );
          var json = JSON.parse(string);
          console.log(">> json: ", json);
          users = json;

          callback(null, users);
        }
      );
    });
  },

  getUserByUserType: function(type, callback) {
    console.log("getUserType 호출됨");

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

      // SQL문을 실행합니다.
      var exec = conn.query(
        "select * from User where userType=? ",
        type,
        function(err, result) {
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
          var users = json;

          callback(null, users);
        }
      );
    });
  },

  addUser: function(
    loginId,
    password,
    name,
    email,
    department,
    approval,
    userType,
    phone,
    buildingList,
    positionList,
    deviceList,
    callback
  ) {
    console.log("addUser 호출됨");

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
        loginID: loginId,
        name: name,
        password: password,
        email: email,
        department: department,
        approval: approval,
        userType: userType,
        phone: phone,
        buildingList: buildingList,
        positionList: positionList,
        deviceList: deviceList
      };

      // SQL문을 실행합니다.
      var exec = conn.query("insert into User set ?", data, function(
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

  updateUser: function(
    userId,
    password,
    name,
    email,
    department,
    approval,
    userType,
    phone,
    buildingList,
    positionList,
    deviceList,
    callback
  ) {
    console.log("updateUser 호출됨");

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
      // TODO: Approval을 임시로 true 로 설정했습니다.
      var updateContents = {};
      var data = [updateContents, userId];

      if (name) updateContents.name = name;
      if (password) updateContents.password = password;
      if (email) updateContents.email = email;
      if (department) updateContents.department = department;
      if (approval) updateContents.approval = approval;
      if (userType) updateContents.userType = userType;
      if (phone) updateContents.phone = phone;
      if (buildingList) updateContents.buildingList = buildingList;
      if (positionList) updateContents.positionList = positionList;
      if (deviceList) updateContents.deviceList = deviceList;

      // SQL문을 실행합니다.
      var exec = conn.query("update User set ? where id=?", data, function(
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
        var success = false;
        if (result.changedRows > 0) success = true;

        callback(null, success);
      });
    });
  },

  updateUserBuildingList: function(userId, buildingList) {
    console.log("updateUserBuildingList 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        //callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      // 데이터를 객체로 만듭니다.
      // TODO: Approval을 임시로 true 로 설정했습니다.
      var data = [buildingList, userId];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "update User set buildingList=? where id=?",
        data,
        function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.
          console.log("실행 대상 SQL : " + exec.sql);

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            //callback(err, null);
            return;
          }
          var success = true;

          //callback(null, success);
        }
      );
    });
  },

  updateUserPositionList: function(userId, positionList) {
    console.log("updateUserPositionList 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        //callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      // 데이터를 객체로 만듭니다.
      // TODO: Approval을 임시로 true 로 설정했습니다.
      var data = [positionList, userId];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "update User set positionList=? where id=?",
        data,
        function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.
          console.log("실행 대상 SQL : " + exec.sql);

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            //callback(err, null);
            return;
          }
          var success = true;

          //callback(null, success);
        }
      );
    });
  },

  loginUser: function(loginId, password, callback) {
    console.log("loginUser 호출됨");

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
      var data = [loginId, password];
      var loginUser = null;

      // SQL문을 실행합니다.
      var exec = conn.query(
        "select * from User where loginID=? and password=?",
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
          console.dir(result);
          loginUser = result[0];
          callback(null, loginUser);
        }
      );
    });
  },

  setApprovalUser: function(userId, callback) {
    console.log("setApprovalUser 호출됨 userId : " + userId);
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
      var ids = userId.split(",");
      console.log(ids);
      var queryString = "Update User Set approval = true where ";
      for (i in ids) {
        let str = "id=" + ids[i];
        queryString = queryString + str;
        if (i < ids.length - 1) queryString = queryString + " or ";
      }

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
        var success = true;

        callback(null, success);
      });
    });
  },

  deleteUser: function(userId, callback) {
    console.log("deleteUser 호출됨 userId : " + userId);
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
      var ids = userId.split(",");
      console.log(ids);
      var queryString = "delete from User where ";
      for (i in ids) {
        let str = "id=" + ids[i];
        queryString = queryString + str;
        if (i < ids.length - 1) queryString = queryString + " or ";
      }

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
        var success = true;

        callback(null, success);
      });
    });
  },

  getUserInfo: function(userId, callback) {
    console.log("getUserInfo 호출됨 userId : " + userId);
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
      var exec = conn.query("select * from User where id=?", userId, function(
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
        var user = json[0];

        callback(null, user);
      });
    });
  }
};
module.exports = User;
