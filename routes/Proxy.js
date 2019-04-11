import { OK, FAIL } from "../public/javascripts/defined";
// import axios from "axios";
var express = require("express");
var router = express.Router();
var Proxy = require("../models/Proxy");
var global = require("../global");

/* INSERT setting */
router.post("/getToken", function(req, res, next) {
  console.log("/getToken 호출됨.");

  var promise = Proxy.getToken("https://sms.gabia.com/oauth/token");
  promise
    .then(function(response) {
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = OK;
      result.message = "성공";
      // result.data = response;
      // console.dir(response);
      var string = JSON.stringify(response);
      var json = JSON.parse(string);
      global.smsToken = json.access_token;
      result.data = global.smsToken;
      res.send(result);
    })
    .catch(function(err) {
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    });
});

router.post("/sendSMS", function(req, res, next) {
  console.log("/sendSMS 호출됨.");

  var promise = Proxy.sendSMS(
    "https://sms.gabia.com/api/send/sms",
    global.smsToken
  );
  promise
    .then(function(response) {
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = OK;
      result.message = "성공";
      // result.data = response;
      res.send(result);
    })
    .catch(function(err) {
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    });
});

router.post("/sendLMS", function(req, res, next) {
  console.log("/sendLMS 호출됨.");

  var promise = Proxy.sendLMS(
    "https://sms.gabia.com/api/send/lms",
    global.smsToken
  );
  promise
    .then(function(response) {
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = OK;
      result.message = "성공";
      // result.data = response;
      res.send(result);
    })
    .catch(function(err) {
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    });
});

module.exports = router;
