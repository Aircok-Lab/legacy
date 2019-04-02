import { OK, FAIL, APPROVE } from "../public/javascripts/defined";
var express = require("express");
var router = express.Router();
var User = require("../models/User");
var ursa = require("ursa");
var fs = require("fs");
var path = require("path");
var userPattern = require("../utils/UserPattern");

const publicKey = fs.readFileSync(path.resolve("ssl/public.pem"));
const privateKey = ursa.createPrivateKey(
  fs.readFileSync(path.resolve("ssl/private.pem"))
);

router.get("/pkey", function(req, res) {
  return res.send(publicKey);
});

/* LOGIN user */
router.post("/login", function(req, res, next) {
  console.log("/login 호출됨.");
  var paramLoginId = req.body.loginId || req.query.loginId;
  var paramPassword = req.body.password || req.query.password;
  let password = privateKey.decrypt(paramPassword, "base64", "utf8");
  var result = { statusCode: null, message: null, data: null };

  if (!paramLoginId || !paramPassword) {
    result.statusCode = FAIL;
    result.message = "입력 값을 확인하세요";
    res.send(result);
    return;
  }

  console.log("요청 파라미터 : " + paramLoginId + "," + password);
  User.loginUser(paramLoginId, password, function(err, loginUser) {
    if (err) {
      console.error("사용자 추가 중 오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (loginUser) {
      console.dir(loginUser);
      if (loginUser.approval) {
        res.cookie("user", {
          loginId: loginUser.loginID,
          name: loginUser.name,
          authorized: true
        });
        var user = userPattern.deletePattern(loginUser);

        result.statusCode = OK;
        result.message = "성공";
        result.data = user;

        res.send(result);
      } else {
        result.statusCode = APPROVE;
        result.message = "승인완료 후 로그인이 가능합니다.";
        res.send(result);
      }
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

/*LOGOUT user */
router.get("/logout", function(req, res, next) {
  console.log("/logout 호출됨.");

  var paramLoginId = req.body.loginId || req.query.loginId;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramLoginId);

  res.clearCookie("user");
  result.statusCode = OK;
  result.message = "성공";
  res.send(result);
});

/* INSERT user */
router.post("/addUser", function(req, res, next) {
  console.log("/addUser 호출됨.");

  var paramLoginId = req.body.loginId || req.query.loginId;
  var paramPassword = req.body.password || req.query.password;
  var paramName = req.body.name || req.query.name;
  var paramEmail = req.body.email || req.query.email || null;
  var paramDepartment = req.body.department || req.query.department || null;
  var paramAaproval = true;
  var paramUserType = req.body.userType || req.query.userType || "user";
  var paramPhone = req.body.phone || req.query.phone || null;
  var paramBuildingList = req.body.buildingList || req.query.buildingList;
  var paramPositionList = req.body.positionList || req.query.positionList;
  var paramDeviceList = req.body.deviceList || req.query.deviceList || null;
  var result = { statusCode: null, message: null, data: null };

  if (
    !paramLoginId ||
    !paramPassword ||
    !paramName ||
    !paramBuildingList ||
    !paramPositionList
  ) {
    result.statusCode = FAIL;
    result.message = "입력 값을 확인하세요";
    res.send(result);
    return;
  }

  paramBuildingList = userPattern.setBuildingListPattern(paramBuildingList);
  paramPositionList = userPattern.setPositionListPattern(paramPositionList);
  paramDeviceList = userPattern.setPositionListPattern(paramDeviceList);

  console.log(
    "요청 파라미터 : " +
      paramLoginId +
      "," +
      paramPassword +
      "," +
      paramName +
      "," +
      paramEmail +
      "," +
      paramDepartment +
      "," +
      paramAaproval +
      "," +
      paramUserType +
      "," +
      paramPhone +
      "," +
      paramBuildingList +
      "," +
      paramPositionList +
      "," +
      paramDeviceList
  );
  User.addUser(
    paramLoginId,
    paramPassword,
    paramName,
    paramEmail,
    paramDepartment,
    paramAaproval,
    paramUserType,
    paramPhone,
    paramBuildingList,
    paramPositionList,
    paramDeviceList,
    function(err, addedUser) {
      // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
      if (err) {
        console.error("사용자 추가 중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (addedUser) {
        console.dir(addedUser);
        console.log("추가된 레코드의 아이디 : " + addedUser.insertId);
        result.statusCode = OK;
        result.message = "회원가입 승인 요청이 완료되었습니다.";
        result.data = addedUser.insertId;
        res.send(result);
      } else {
        result.statusCode = FAIL;
        result.message = "실패";
        res.send(result);
      }
    }
  );
});

/* FIND user loginId */
router.post("/findUser", function(req, res, next) {
  console.log("/findUser 호출됨.");

  var paramName = req.body.name || req.query.name;
  var paramEmail = req.body.email || req.query.email;
  var result = { statusCode: null, message: null, data: null };

  if (!paramName || !paramEmail) {
    result.statusCode = FAIL;
    result.message = "입력 값을 확인하세요";
    res.send(result);
    return;
  }

  console.log("요청 파라미터 : " + paramName + "," + paramEmail);

  User.getLoginId(paramName, paramEmail, function(err, findLoginID) {
    if (err) {
      console.error("사용자 찾기 중 오류 발생 :" + err.stack);

      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (findLoginID) {
      console.dir(findLoginID);
      result.statusCode = OK;
      result.message = "성공";
      result.data = findLoginID;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

/* FIND user password */
router.post("/findPassword", function(req, res, next) {
  console.log("/findPassword 호출됨.");

  var paramLoginID = req.body.loginId || req.query.loginId;
  var paramEmail = req.body.email || req.query.email;
  var result = { statusCode: null, message: null, data: null };

  if (!paramLoginID || !paramEmail) {
    result.statusCode = FAIL;
    result.message = "입력 값을 확인하세요";
    res.send(result);
    return;
  }

  console.log("요청 파라미터 : " + paramLoginID + "," + paramEmail);

  User.getUserPassword(paramLoginID, paramEmail, function(err, findPassword) {
    if (err) {
      console.error("패스워드 찾기 중 오류 발생 :" + err.stack);

      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (findPassword) {
      console.dir(findPassword);
      //console.log('DB에 임시비번 변경 후 임시 비번 메일 전송');
      result.statusCode = OK;
      result.message = "임시 비번 메일 전송";
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

/* all user list */
router.get("/allUser", function(req, res, next) {
  console.log("/allUser 호출됨.");
  var result = { statusCode: null, message: null, data: null };

  User.getAllUsers(function(err, allUsers) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (allUsers) {
      console.dir(allUsers);
      var users = [];
      allUsers.map(user => {
        users.push(userPattern.deletePattern(user));
      });

      result.statusCode = OK;
      result.message = "성공";
      result.data = users;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

/* user by loginId */
router.get("/getUserInfo", function(req, res, next) {
  console.log("/getUserInfo 호출됨.");

  var paramUserID = req.body.id || req.query.id;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramUserID);

  User.getUserInfo(paramUserID, function(err, users) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (users) {
      console.dir(users);
      var user = userPattern.deletePattern(users);

      result.statusCode = OK;
      result.message = "성공";
      result.data = user;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

/* all user list of BuildingId*/
router.post("/getUserByBuildingId", function(req, res, next) {
  console.log("/getUserByBuildingId 호출됨.");

  var paramBuildingID = req.body.buildingID || req.query.buildingID;
  var result = { statusCode: null, message: null, data: null };

  paramBuildingID = paramBuildingID.replace(/(\s*)/gi, "");
  console.log("요청 파라미터 : " + paramBuildingID);

  User.getUserByBuildingId(paramBuildingID, function(err, users) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (users) {
      console.dir(users);
      var retUsers = [];
      users.map(user => {
        retUsers.push(userPattern.deletePattern(user));
      });
      result.statusCode = OK;
      result.message = "성공";
      result.data = retUsers;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

router.post("/getUserByPositionId", function(req, res, next) {
  console.log("/getUserByPositionId 호출됨.");

  var paramPositionID = req.body.positionID || req.query.positionID;
  var result = { statusCode: null, message: null, data: null };

  paramPositionID = paramPositionID.replace(/(\s*)/gi, "");
  console.log("요청 파라미터 : " + paramPositionID);

  User.getUserByPositionId(paramPositionID, function(err, users) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (users) {
      console.dir(users);
      var retUsers = [];
      users.map(user => {
        retUsers.push(userPattern.deletePattern(user));
      });
      result.statusCode = OK;
      result.message = "성공";
      result.data = retUsers;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

router.put("/setApprovalUser", function(req, res, next) {
  console.log("/setApprovalUser 호출됨.");

  var paramUserID = req.body.id || req.query.id;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramUserID);

  User.setApprovalUser(paramUserID, function(err, success) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (success) {
      console.dir(success);
      result.statusCode = OK;
      result.message = "성공";
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

router.get("/approvalUser", function(req, res, next) {
  console.log("/ApprovalUser 호출됨.");

  var state = req.body.state || req.query.state;
  var result = { statusCode: null, message: null, data: null };

  User.approvalUser(state, function(err, success) {
    if (err) {
      console.error("오류 발생 :" + err.stack);

      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (success) {
      console.dir(users);
      var retUsers = [];
      users.map(user => {
        retUsers.push(userPattern.deletePattern(user));
      });
      result.statusCode = OK;
      result.message = "성공";
      result.data = retUsers;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

router.get("/getUserByUserType", function(req, res, next) {
  console.log("/getUserByUserType 호출됨.");

  var type = req.body.type || req.query.type;
  var result = { statusCode: null, message: null, data: null };

  //입력값이 master, manager, monitoring, user가 맞는지 판단
  if (
    type == "master" ||
    type == "manager" ||
    type == "monitoring" ||
    type == "user"
  ) {
    User.getUserByUserType(type, function(err, users) {
      if (err) {
        console.error("오류 발생 :" + err.stack);

        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (users) {
        console.dir(users);
        var retUsers = [];
        users.map(user => {
          retUsers.push(userPattern.deletePattern(user));
        });
        result.statusCode = OK;
        result.message = "성공";
        result.data = retUsers;
        res.send(result);
      } else {
        result.statusCode = FAIL;
        result.message = "실패";
        res.send(result);
      }
    });
  } else {
    console.log("입력값 오류");
    result.statusCode = FAIL;
    result.message = "입력값 오류";
    res.send(result);
  }
});

router.put("/updateUser", function(req, res, next) {
  console.log("/updateUser 호출됨.");

  var paramUserID = req.body.id || req.query.id;
  var paramLoginID = req.body.loginID || req.query.loginID;
  var paramPassword = req.body.password || req.query.password;
  var paramName = req.body.name || req.query.name;
  var paramEmail = req.body.email || req.query.email;
  var paramDepartment = req.body.department || req.query.department;
  var paramAaproval = true;
  var paramUserType = req.body.userType || req.query.userType;
  var paramPhone = req.body.phone || req.query.phone;
  var paramBuildingList = req.body.buildingList || req.query.buildingList;
  var paramPositionList = req.body.positionList || req.query.positionList;
  var paramDeviceList = req.body.deviceList || req.query.deviceList;
  var result = { statusCode: null, message: null, data: null };
  let password = privateKey.decrypt(paramPassword, "base64", "utf8");

  paramBuildingList = userPattern.setBuildingListPattern(paramBuildingList);
  paramPositionList = userPattern.setPositionListPattern(paramPositionList);
  paramDeviceList = userPattern.setPositionListPattern(paramDeviceList);
  console.log(
    "요청 파라미터 : " +
      paramLoginID +
      "," +
      paramUserID +
      "," +
      password +
      "," +
      paramName +
      "," +
      paramEmail +
      "," +
      paramDepartment +
      "," +
      paramAaproval +
      "," +
      paramUserType +
      "," +
      paramPhone +
      "," +
      paramBuildingList +
      "," +
      paramPositionList +
      "," +
      paramDeviceList
  );

  User.checkPassword(paramUserID, password, function(err, success) {
    if (err) {
      console.error("사용자 비번 확인중 오류 발생 :" + err.stack);
      return;
    }
    //결과 객체 있으면 성공 응답 전송
    if (success) {
      User.updateUser(
        paramUserID,
        password,
        paramName,
        paramEmail,
        paramDepartment,
        paramAaproval,
        paramUserType,
        paramPhone,
        paramBuildingList,
        paramPositionList,
        paramDeviceList,
        function(err, success) {
          // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
          if (err) {
            console.error("사용자 추가 중 오류 발생 :" + err.stack);
            result.statusCode = FAIL;
            result.message = "오류 발생";
            res.send(result);
            return;
          }

          //결과 객체 있으면 성공 응답 전송
          if (success) {
            console.dir(success);
            result.statusCode = OK;
            result.message = "성공";
            res.send(result);
          } else {
            result.statusCode = FAIL;
            result.message = "수정된 내용이 없습니다.";
            res.send(result);
          }
        }
      );
    } else {
      result.statusCode = FAIL;
      result.message = "비밀번호가 안 맞습니다. 다시 확인바랍니다.";
      res.send(result);
    }
  });
});

router.put("/changePassword", function(req, res, next) {
  console.log("/changePassword 호출됨.");

  var paramUserID = req.body.id || req.query.id;
  var paramOldPassword = req.body.oldPassword || req.query.oldPassword;
  var paramNewPassword = req.body.newPassword || req.query.newPassword;
  let oldPassword = privateKey.decrypt(paramOldPassword, "base64", "utf8");
  let newPassword = privateKey.decrypt(paramNewPassword, "base64", "utf8");

  console.log(
    "요청 파라미터 : " + paramUserID + "," + oldPassword + "," + newPassword
  );

  User.checkPassword(paramUserID, oldPassword, function(err, success) {
    // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
    if (err) {
      console.error("사용자 비번 확인중 오류 발생 :" + err.stack);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (success) {
      User.changePassword(paramUserID, newPassword, function(err, success) {
        if (err) {
          console.error("사용자 비번 변경중 오류 발생 :" + err.stack);
          return;
        }
        if (success) {
          result.statusCode = OK;
          result.message = "성공";
          res.send(result);
        }
      });
    } else {
      result.statusCode = FAIL;
      result.message = "비밀번호가 안 맞습니다. 다시 확인바랍니다.";
      res.send(result);
    }
  });
});

router.put("/modifyUser", function(req, res, next) {
  console.log("/modifyUser 호출됨.");

  var paramUserID = req.body.id || req.query.id;
  var paramName = req.body.name || req.query.name;
  var paramEmail = req.body.email || req.query.email;
  var paramDepartment = req.body.department || req.query.department;
  var paramUserType = req.body.userType || req.query.userType;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramUserID +
      "," +
      paramName +
      "," +
      paramEmail +
      "," +
      paramDepartment +
      "," +
      paramUserType
  );

  User.modifyUser(
    paramUserID,
    paramName,
    paramEmail,
    paramDepartment,
    paramUserType,
    function(err, success) {
      // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
      if (err) {
        console.error("사용자 추가 중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (success) {
        console.dir(success);
        result.statusCode = OK;
        result.message = "성공";
        res.send(result);
      } else {
        result.statusCode = FAIL;
        result.message = "수정된 내용이 없습니다.";
        res.send(result);
      }
    }
  );
});

router.delete("/deleteUser", function(req, res, next) {
  console.log("/deleteUser 호출됨.");

  var paramUserID = req.body.id || req.query.id;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramUserID);

  User.deleteUser(paramUserID, function(err, success) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (success) {
      console.dir(success);
      result.statusCode = OK;
      result.message = "성공";
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

module.exports = router;
