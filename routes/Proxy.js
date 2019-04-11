import { OK, FAIL } from "../public/javascripts/defined";
// import axios from "axios";
var express = require("express");
var router = express.Router();
var Proxy = require("../models/Proxy");
var global = require("../global");

router.get("/", function(req, res, next) {
  var promise = Proxy.get(req.query.url);
  promise
    .then(function(result) {
      // res.send(result);
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = OK;
      result.message = "성공";
      var json = JSON.parse(response);
      result.data = json;
      res.send(result);
    })
    .catch(function(err) {
      console.dir(err);
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    });
});

/* INSERT setting */
router.post("/getToken", function(req, res, next) {
  console.log("/getToken 호출됨.");

  var promise = Proxy.getToken("https://sms.gabia.com/oauth/token");
  promise
    .then(function(response) {
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = OK;
      result.message = "성공";
      var json = JSON.parse(response);
      global.smsToken = json.access_token;
      res.send(result);
    })
    .catch(function(err) {
      console.dir(err);
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
      res.send(result);
    })
    .catch(function(err) {
      console.dir(err);
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
      res.send(result);
    })
    .catch(function(err) {
      console.dir(err);
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    });
});

module.exports = router;
