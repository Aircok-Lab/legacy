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
      var exec = conn.query(
        "select User.*, group_concat(distinct buildingID) as buildingList, group_concat(distinct positionID) as positionList, \
        group_concat(distinct deviceID) as deviceList from User, UserBuilding, UserPosition,UserDevice \
        where  User.id = UserBuilding.userID and User.id = UserPosition.userID and User.id = UserDevice.userID group by User.id",
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
          var allUsers = json;

          callback(null, allUsers);
        }
      );
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
      if (buildingId) {
        var ids = buildingId.split(",");
        console.log(ids);
        var queryString =
          "select User.*, group_concat(distinct UserBuilding.buildingID) as buildingList, \
        group_concat(distinct UserPosition.positionID) as positionList, \
        group_concat(distinct UserDevice.deviceID) as deviceList \
        from User, UserBuilding, UserPosition, UserDevice \
        where  (";
        for (i in ids) {
          let str = "UserBuilding.buildingID = " + ids[i];
          queryString = queryString + str;
          if (i < ids.length - 1) queryString = queryString + " or ";
        }
        queryString =
          queryString +
          ") and User.id = UserBuilding.userID and UserBuilding.userID = UserPosition.userID and UserBuilding.userID = UserDevice.userID \
        group by User.id;";
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
      if (positionId) {
        var ids = positionId.split(",");
        console.log(ids);
        var queryString =
          "select User.*, group_concat(distinct UserBuilding.buildingID) as buildingList, \
        group_concat(distinct UserPosition.positionID) as positionList, \
        group_concat(distinct UserDevice.deviceID) as deviceList \
        from User, UserBuilding, UserPosition, UserDevice \
        where  (";
        for (i in ids) {
          let str = "UserPosition.positionID = " + ids[i];
          queryString = queryString + str;
          if (i < ids.length - 1) queryString = queryString + " or ";
        }
        queryString =
          queryString +
          ") and User.id = UserBuilding.userID and UserBuilding.userID = UserPosition.userID and UserBuilding.userID = UserDevice.userID \
        group by User.id;";

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
      }
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
      if (deviceList) {
        var ids = deviceList.split(",");
        console.log(ids);
        var queryString =
          "select User.*, group_concat(distinct UserBuilding.buildingID) as buildingList, \
        group_concat(distinct UserPosition.positionID) as positionList, \
        group_concat(distinct UserDevice.deviceID) as deviceList \
        from User, UserBuilding, UserPosition, UserDevice \
        where  (";
        for (i in ids) {
          let str = "UserDevice.deviceID = '" + ids[i] + "'";
          queryString = queryString + str;
          if (i < ids.length - 1) queryString = queryString + " or ";
        }
        queryString =
          queryString +
          ") and User.id = UserBuilding.userID and UserBuilding.userID = UserPosition.userID and UserBuilding.userID = UserDevice.userID \
        group by User.id;";

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
      }
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
      User.approval = false;
      // 데이터를 객체로 만듭니다.
      var queryString =
        "select User.*, group_concat(distinct UserBuilding.buildingID) as buildingList, \
        group_concat(distinct UserPosition.positionID) as positionList, \
        group_concat(distinct UserDevice.deviceID) as deviceList \
        from User, UserBuilding, UserPosition, UserDevice \
        where User.approval = ? and User.id = UserBuilding.userID \
        and UserBuilding.userID = UserPosition.userID and UserBuilding.userID = UserDevice.userID \
        group by User.id";

      // SQL문을 실행합니다.
      var exec = conn.query(queryString, state, function(err, result) {
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
      });
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
      var queryString =
        "select User.*, group_concat(distinct UserBuilding.buildingID) as buildingList, \
        group_concat(distinct UserPosition.positionID) as positionList, \
        group_concat(distinct UserDevice.deviceID) as deviceList \
        from User, UserBuilding, UserPosition, UserDevice \
        where User.userType = ? and User.id = UserBuilding.userID \
        and UserBuilding.userID = UserPosition.userID and UserBuilding.userID = UserDevice.userID \
        group by User.id";

      // SQL문을 실행합니다.
      var exec = conn.query(queryString, type, function(err, result) {
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
      });
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
        phone: phone
        // buildingList: buildingList,
        // positionList: positionList,
        // deviceList: deviceList
      };

      // SQL문을 실행합니다.
      var exec = conn.query("insert into User set ?", data, function(
        err,
        result
      ) {
        //conn.release(); // 반드시 해제해야 합니다.
        console.log("실행 대상 SQL : " + exec.sql);

        if (err) {
          conn.release(); // 반드시 해제해야 합니다.
          console.log("SQL 실행 시 오류 발생함");
          console.dir(err);

          callback(err, null);
          return;
        }
        // 데이터를 객체로 만듭니다.
        if (buildingList) {
          var ids = buildingList.split(",");
          console.log(ids);
          for (i in ids) {
            var data = {
              userID: result.insertId,
              buildingID: ids[i]
            };
            conn.query("insert into UserBuilding set ?", data);
            // conn.release();
          }
        }

        if (positionList) {
          ids = positionList.split(",");
          console.log(ids);
          for (i in ids) {
            var data = {
              userID: result.insertId,
              positionID: ids[i]
            };
            conn.query("insert into UserPosition set ?", data);
            // conn.release();
          }
        }

        if (deviceList) {
          ids = deviceList.split(",");
          console.log(ids);
          for (i in ids) {
            var data = {
              userID: result.insertId,
              deviceID: ids[i]
            };
            conn.query("insert into UserDevice set ?", data);
            // conn.release();
          }
        } else {
          var data = {
            userID: result.insertId,
            deviceID: null
          };
          conn.query("insert into UserDevice set ?", data);
          // conn.release();
        }
        conn.release();
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
    // buildingList,
    // positionList,
    // deviceList,
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
      var data = [
        name,
        password,
        email,
        department,
        approval,
        userType,
        phone,
        // buildingList,
        // positionList,
        // deviceList,
        userId
      ];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "update User set name=?, password=?, email=?, department=?, approval=?, userType=?, phone=? where id=?",
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

  modifyUser: function(
    userId,
    name,
    email,
    department,
    userType,
    buildingList,
    positionList,
    deviceList,
    callback
  ) {
    console.log("modifyUser 호출됨");

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
      var data = [
        name,
        email,
        department,
        userType,
        // buildingList,
        // positionList,
        // deviceList,
        userId
      ];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "update User set name=?, email=?, department=?, userType=? where id=?",
        data,
        function(err, result) {
          //conn.release(); // 반드시 해제해야 합니다.
          console.log("실행 대상 SQL : " + exec.sql);

          if (err) {
            conn.release();
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            callback(err, null);
            return;
          }

          var queryStringByBuilding =
            "delete from UserBuilding where userID = ?";
          var queryStringByPosition =
            "delete from UserPosition where userID = ?";
          var queryStringByDevice = "delete from UserDevice where userID = ?";

          conn.query(queryStringByBuilding, userId, function(err, result) {
            if (err) console.log("delete Building error");
          });
          conn.query(queryStringByPosition, userId, function(err, result) {
            if (err) console.log("delete Position error");
          });
          conn.query(queryStringByDevice, userId, function(err, result) {
            if (err) console.log("delete Device error");
          });

          if (buildingList) {
            var ids = buildingList.split(",");
            console.log(ids);
            for (i in ids) {
              var data = {
                userID: userId,
                buildingID: ids[i]
              };
              conn.query("insert into UserBuilding set ?", data, function(
                err,
                result
              ) {
                if (err) console.log("add Building error");
              });
              // conn.release();
            }
          }

          if (positionList) {
            ids = positionList.split(",");
            console.log(ids);
            for (i in ids) {
              var data = {
                userID: userId,
                positionID: ids[i]
              };
              conn.query("insert into UserPosition set ?", data, function(
                err,
                result
              ) {
                if (err) console.log("add Position error");
              });
              // conn.release();
            }
          }

          if (deviceList) {
            ids = deviceList.split(",");
            console.log(ids);
            for (i in ids) {
              var data = {
                userID: userId,
                deviceID: ids[i]
              };
              conn.query("insert into UserDevice set ?", data, function(
                err,
                result
              ) {
                if (err) console.log("add Device error");
              });
              // conn.release();
            }
          } else {
            var data = {
              userID: userId,
              deviceID: null
            };
            conn.query("insert into UserDevice set ?", data, function(
              err,
              result
            ) {
              if (err) console.log("add Device null error");
            });
          }
          conn.release(); // 반드시 해제해야 합니다.
          var success = true;
          if (result.changedRows > 0) success = true;

          callback(null, success);
        }
      );
    });
  },

  updateUserBuildingList: function(userId, isAdd, buildingList) {
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

      if (isAdd) {
        var data = {
          userID: userId,
          buildingID: buildingList
        };
        conn.query("insert into UserBuilding set ?", data, function(
          err,
          result
        ) {
          conn.release(); // 반드시 해제해야 합니다.

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            //callback(err, null);
            return;
          }
          // var success = true;

          // callback(null, success);
        });
      } else {
        var queryString = "delete from UserBuilding where buildingID = ?";
        conn.query(queryString, buildingList, function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            //callback(err, null);
            return;
          }
          // var success = true;

          // callback(null, success);
        });
      }
    });
  },

  updateUserPositionList: function(userId, isAdd, positionList) {
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

      if (isAdd) {
        var data = {
          userID: userId,
          positionID: positionList
        };
        conn.query("insert into UserPosition set ?", data, function(
          err,
          result
        ) {
          conn.release(); // 반드시 해제해야 합니다.

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            //callback(err, null);
            return;
          }
          // var success = true;

          // callback(null, success);
        });
      } else {
        var queryString = "delete from UserPosition where positionID = ?";
        conn.query(queryString, positionList, function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            //callback(err, null);
            return;
          }
          // var success = true;

          // callback(null, success);
        });
      }
    });
  },

  updateUserDeviceList: function(userId, isAdd, deviceList) {
    console.log("updateUserDeviceList 호출됨");

    pool.getConnection(function(err, conn) {
      if (err) {
        if (conn) {
          conn.release(); // 반드시 해제해야 합니다.
        }

        //callback(err, null);
        return;
      }
      console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

      if (isAdd) {
        var data = {
          userID: userId,
          deviceID: deviceList
        };
        conn.query("insert into UserDevice set ?", data, function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            //callback(err, null);
            return;
          }
          // var success = true;

          // callback(null, success);
        });
      } else {
        var queryString = "delete from UserDevice where deviceID = ?";
        conn.query(queryString, deviceList, function(err, result) {
          conn.release(); // 반드시 해제해야 합니다.

          if (err) {
            console.log("SQL 실행 시 오류 발생함");
            console.dir(err);

            //callback(err, null);
            return;
          }
          // var success = true;

          // callback(null, success);
        });
      }
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
      var queryString =
        "select User.*, group_concat(distinct UserBuilding.buildingID) as buildingList, \
        group_concat(distinct UserPosition.positionID) as positionList, \
        group_concat(distinct UserDevice.deviceID) as deviceList \
        from User, UserBuilding, UserPosition, UserDevice";
      queryString =
        queryString + " where User.loginID = ?" + " and User.password = ?";
      queryString =
        queryString +
        " and User.id = UserBuilding.userID and User.id = UserPosition.userID and \
        User.id = UserDevice.userID group by User.id";

      // SQL문을 실행합니다.
      var exec = conn.query(queryString, data, function(err, result) {
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
      });
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
      if (userId) {
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
      }
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

      if (userId) {
        var ids = userId.split(",");
        var queryStringByBuilding = "delete from UserBuilding where ";
        var queryStringByPosition = "delete from UserPosition where ";
        var queryStringByDevice = "delete from UserDevice where ";
        console.log(ids);

        for (i in ids) {
          let str = "userID=" + ids[i];
          queryStringByBuilding = queryStringByBuilding + str;
          queryStringByPosition = queryStringByPosition + str;
          queryStringByDevice = queryStringByDevice + str;
          if (i < ids.length - 1) {
            queryStringByBuilding = queryStringByBuilding + " or ";
            queryStringByPosition = queryStringByPosition + " or ";
            queryStringByDevice = queryStringByDevice + " or ";
          }
        }
        conn.query(queryStringByBuilding);
        conn.query(queryStringByPosition);
        conn.query(queryStringByDevice);
      }

      // 데이터를 객체로 만듭니다.
      if (userId) {
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
      }
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
      var queryString =
        "select  User.*, group_concat(distinct buildingID) as buildingList, group_concat(distinct positionID) as positionList, \
        group_concat(distinct deviceID) as deviceList from User, \
        UserBuilding, UserPosition,UserDevice where  User.id = ";
      queryString =
        queryString +
        userId +
        " and User.id = UserBuilding.userID and User.id = UserPosition.userID and User.id = UserDevice.userID group by User.id";
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
        var user = json[0];

        callback(null, user);
      });
    });
  },
  checkPassword: function(id, oldPassword, callback) {
    console.log("checkPassword 호출됨");

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
      var exec = conn.query(
        "select password from User where id=?",
        id,
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
          var success = false;
          if (result[0].password === oldPassword) {
            success = true;
          }
          callback(null, success);
        }
      );
    });
  },
  changePassword: function(id, newPassword, callback) {
    console.log("changePassword 호출됨");

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
      var data = [newPassword, id];

      // SQL문을 실행합니다.
      var exec = conn.query(
        "update User set password=? where id=?",
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
          if (result.changedRows > 0) {
            success = true;
          }
          callback(null, success);
        }
      );
    });
  }
};
module.exports = User;
