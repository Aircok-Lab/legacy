import { OK, FAIL, APPROVE } from "../public/javascripts/defined";
var express = require("express");
var router = express.Router();
const passport = require("passport");
var User = require("../models/User");
var ursa = require("ursa");
var fs = require("fs");
var path = require("path");

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
  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;
  let password = privateKey.decrypt(paramPassword, "base64", "utf8");
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramId + "," + password);
  User.loginUser(paramId, password, function(err, loginUser) {
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
      if (loginUser.Approval) {
        res.cookie("user", {
          id: loginUser.UserID,
          name: loginUser.Name,
          authorized: true
        });
        result.statusCode = OK;
        result.message = "성공";
        result.data = loginUser;
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

  var paramId = req.body.id || req.query.id;
  var paramName = req.body.name || req.query.name;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramId);

  res.clearCookie("user");
  result.statusCode = OK;
  result.message = "성공";
  res.send(result);
});

/* INSERT user */
router.post("/addUser", function(req, res, next) {
  console.log("/addUser 호출됨.");

  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;
  var paramName = req.body.name || req.query.name;
  var paramEmail = req.body.email || req.query.email || null;
  var paramDepartment = req.body.department || req.query.department || null;
  var paramAaproval = true;
  var paramManager = req.body.manager || req.query.manager || false;
  var paramPhone = req.body.phone || req.query.phone || null;
  var paramBuildingList = req.body.buildinglist || req.query.buildinglist;
  var paramPositionList = req.body.positionlist || req.query.positionlist;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramId +
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
      paramManager +
      "," +
      paramPhone +
      "," +
      paramBuildingList +
      "," +
      paramPositionList
  );

  User.addUser(
    paramId,
    paramPassword,
    paramName,
    paramEmail,
    paramDepartment,
    paramManager,
    paramPhone,
    paramBuildingList,
    paramPositionList,
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

/* FIND user id */
router.post("/findUser", function(req, res, next) {
  console.log("/findUser 호출됨.");

  var paramName = req.body.name || req.query.name;
  var paramEmail = req.body.email || req.query.email;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramName + "," + paramEmail);

  User.getUserId(paramName, paramEmail, function(err, findUserID) {
    if (err) {
      console.error("사용자 찾기 중 오류 발생 :" + err.stack);

      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (findUserID) {
      console.dir(findUserID);
      result.statusCode = OK;
      result.message = "성공";
      result.data = findUserID;
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

  var paramUserID = req.body.id || req.query.id;
  var paramEmail = req.body.email || req.query.email;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramUserID + "," + paramEmail);

  User.getUserPassword(paramUserID, paramEmail, function(err, findPassword) {
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
      result.statusCode = OK;
      result.message = "성공";
      result.data = allUsers;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

/* user by id */
router.get("/getUserById", function(req, res, next) {
  console.log("/getUserById 호출됨.");

  var paramUserID = req.body.id || req.query.id;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramUserID);

  User.getUserById(paramUserID, function(err, users) {
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

/* all user list of BuildingId*/
router.post("/getUserByBuildingId", function(req, res, next) {
  console.log("/getUserByBuildingId 호출됨.");

  var paramBuildingID = req.body.id || req.query.id;
  var result = { statusCode: null, message: null, data: null };

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

router.post("/getUserByPositionId", function(req, res, next) {
  console.log("/getUserByPositionId 호출됨.");

  var paramPositionID = req.body.id || req.query.id;
  var result = { statusCode: null, message: null, data: null };

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

router.put("/updateUser", function(req, res, next) {
  console.log("/updateUser 호출됨.");

  var paramId = req.body.userId || req.query.userId;
  var paramPassword = req.body.password || req.query.password;
  var paramName = req.body.name || req.query.name;
  var paramEmail = req.body.email || req.query.email || null;
  var paramDepartment = req.body.department || req.query.department || null;
  var paramAaproval = true;
  var paramManager = req.body.manager || req.query.manager || false;
  var paramPhone = req.body.phone || req.query.phone || null;
  var paramBuildingList =
    req.body.buildinglist || req.query.buildinglist || null;
  var paramPositionList =
    req.body.positionlist || req.query.positionlist || null;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramId +
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
      paramManager +
      "," +
      paramPhone +
      "," +
      paramBuildingList +
      "," +
      paramPositionList
  );

  User.updateUser(
    paramId,
    paramPassword,
    paramName,
    paramEmail,
    paramDepartment,
    paramManager,
    paramPhone,
    paramBuildingList,
    paramPositionList,
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
        result.message = "실패";
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
