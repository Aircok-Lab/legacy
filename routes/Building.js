import { OK, FAIL } from "../public/javascripts/defined";
var express = require("express");
var router = express.Router();
var Building = require("../models/Building");
var User = require("../models/User");
var Position = require("../models/Position");
var userPattern = require("../utils/UserPattern");

/* INSERT user */
router.post("/addBuilding", function(req, res, next) {
  console.log("/addBuilding 호출됨.");

  var paramName = req.body.name || req.query.name;
  var paramAddress = req.body.address || req.query.address || null;
  var paramLatitude = req.body.latitude || req.query.latitude || null;
  var paramLongitude = req.body.longitude || req.query.longitude || null;
  var paramBuildingType = req.body.buildingType || req.query.buildingType;
  var paramIsPublicBuilding =
    req.body.isPublicBuilding || req.query.isPublicBuilding || 0;
  var paramUserID = req.body.userID || req.query.userID;
  var result = { statusCode: null, message: null, data: null };

  if (!paramName) {
    result.statusCode = FAIL;
    result.message = "입력 값을 확인하세요";
    res.send(result);
    return;
  }

  console.log(
    "요청 파라미터 : " +
      paramName +
      "," +
      paramAddress +
      "," +
      paramLatitude +
      "," +
      paramLongitude +
      "," +
      paramBuildingType +
      "," +
      paramIsPublicBuilding +
      "," +
      paramUserID
  );

  Building.addBuilding(
    paramName,
    paramAddress,
    paramLatitude,
    paramLongitude,
    paramBuildingType,
    paramIsPublicBuilding,
    function(err, addedBuilding) {
      // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
      if (err) {
        console.error("빌딩 추가 중 오류 발생 :" + err.stack);
        result.statusCode = FAIL;
        result.message = "오류 발생";
        res.send(result);
        return;
      }

      //결과 객체 있으면 성공 응답 전송
      if (addedBuilding) {
        console.dir(addedBuilding);

        User.getUserInfo(paramUserID, function(err, userInfo) {
          if (err) {
            console.error("층 추가 중 오류 발생 :" + err.stack);
            return;
          }

          if (userInfo) {
            userInfo.buildingList =
              userInfo.buildingList + addedBuilding.insertId + ",/";
            User.updateUserBuildingList(paramUserID, userInfo.buildingList);
            let userData = userPattern.deletePattern(userInfo);
            console.log("추가된 레코드의 아이디 : " + addedBuilding.insertId);
            result.statusCode = OK;
            result.message = "성공";
            result.data = userData;
            res.send(result);
          }
        });
      } else {
        console.log("빌딩 추가 정보 없음");
        result.statusCode = FAIL;
        result.message = "실패";
        res.send(result);
      }
    }
  );
});

/* all building list */
router.get("/allBuilding", function(req, res, next) {
  console.log("/allBuilding 호출됨.");
  var result = { statusCode: null, message: null, data: null };

  Building.getAllBuilding(function(err, allBuildings) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (allBuildings) {
      console.dir(allBuildings);
      result.statusCode = OK;
      result.message = "성공";
      result.data = allBuildings;
      res.send(result);
    } else {
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

/* Building information of BuildingId*/
router.post("/getBuildingById", function(req, res, next) {
  console.log("/getBuildingById 호출됨.");

  var paramBuildingID = req.body.id || req.query.id;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramBuildingID);

  Building.getBuildingById(paramBuildingID, function(err, buildings) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      result.statusCode = FAIL;
      result.message = "오류 발생";
      res.send(result);
      return;
    }

    //결과 객체 있으면 성공 응답 전송
    if (buildings) {
      console.dir(buildings);
      result.statusCode = OK;
      result.message = "성공";
      result.data = buildings;
      res.send(result);
    } else {
      console.log("빌딩 정보 없음");
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });
});

router.put("/updateBuilding", function(req, res, next) {
  console.log("/updateBuilding 호출됨.");

  var paramBuildingID = req.body.id || req.query.id;
  var paramName = req.body.name || req.query.name;
  var paramAddress = req.body.address || req.query.address;
  var paramLatitude = req.body.latitude || req.query.latitude;
  var paramLongitude = req.body.longitude || req.query.longitude;
  var paramBuildingType = req.body.buildingType || req.query.buildingType;
  var paramIsPublicBuilding =
    req.body.isPublicBuilding || req.query.isPublicBuilding || 0;
  var result = { statusCode: null, message: null, data: null };

  console.log(
    "요청 파라미터 : " +
      paramBuildingID +
      "," +
      paramName +
      "," +
      paramAddress +
      "," +
      paramLatitude +
      "," +
      paramLongitude +
      "," +
      paramBuildingType +
      "," +
      paramIsPublicBuilding
  );

  Building.updateBuilding(
    paramBuildingID,
    paramName,
    paramAddress,
    paramLatitude,
    paramLongitude,
    paramBuildingType,
    paramIsPublicBuilding,
    function(err, success) {
      if (err) {
        console.error("빌딩 정보 수정 중 오류 발생 :" + err.stack);
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

router.delete("/deleteBuilding", function(req, res, next) {
  console.log("/deleteBuilding 호출됨.");

  var paramBuildingID = req.body.id || req.query.id;
  var paramUserID = req.body.userID || req.query.userID;
  var result = { statusCode: null, message: null, data: null };

  console.log("요청 파라미터 : " + paramBuildingID + paramUserID);
  Position.getPositionCountByBuildingId(paramBuildingID, function(
    err,
    positionCount
  ) {
    if (err) {
      console.error("오류 발생 :" + err.stack);
      return;
    }
    console.error("positionCount :" + positionCount);
    if (positionCount == 0) {
      Building.deleteBuilding(paramBuildingID, function(err, success) {
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

          User.getUserByBuildingId(paramBuildingID, function(err, users) {
            if (users) {
              users.map(user => {
                let delStr = "/" + paramBuildingID + ",/";
                let inStr = "/";
                let buildingList = user.buildingList.replace(delStr, inStr);

                User.updateUserBuildingList(user.id, buildingList);
                if (user.id == paramUserID) {
                  user.buildingList = buildingList;
                  let userData = userPattern.deletePattern(user);
                  result.statusCode = OK;
                  result.message = "성공";
                  result.data = userData;
                  res.send(result);
                }
              });
            }
          });
        }
      });
    } else {
      result.statusCode = FAIL;
      result.message = "층이 존재합니다. 층을 삭제 후 삭제 바랍니다.";
      res.send(result);
    }
  });
});

module.exports = router;
