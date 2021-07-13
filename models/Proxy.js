var rpn = require("request-promise-native");
var global = require("../global");

var Proxy = {
  get: function(url) {
    return rpn({
      uri: url,
      method: "GET"
    });
  },
  getToken: function(url) {
    var id = "aircok";
    var key = "179dbc6aec1c8c55c5ab47caf5bfa4a1";
    var encode = id + ":" + key;
    var keyStr = Buffer.from(encode).toString("base64");
    var options = {
      method: "POST",
      url: url,
      headers: {
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        authorization: "Basic " + keyStr
      },
      form: { grant_type: "client_credentials" }
    };

    return rpn(options);
  },
  sendSMS: function(phone, message) {
    var id = "aircok";
    var encode = id + ":" + global.smsToken;
    var keyStr = Buffer.from(encode).toString("base64");
    phone = phone.replace(/\-/g, "");
    phone = phone.slice(0, -1);
    var options = {
      method: "POST",
      url: "https://sms.gabia.com/api/send/sms",
      headers: {
        "cache-control": "no-cache",
        authorization: "Basic " + keyStr,
        "content-type": "application/x-www-form-urlencoded"
      },
      form: {
        phone: phone,
        callback: "025521947",
        message: message,
        reqdate: "0",
        refkey: "1212"
      }
    };

    return rpn(options);
  },
  sendLMS: function(phone, message) {
    var id = "aircok";
    var encode = id + ":" + global.smsToken;
    var keyStr = Buffer.from(encode).toString("base64");
    phone = phone.replace(/\-/g, "");
    phone = phone.slice(0, -1);
    var options = {
      method: "POST",
      url: "https://sms.gabia.com/api/send/lms",
      headers: {
        "cache-control": "no-cache",
        authorization: "Basic " + keyStr,
        "content-type": "application/x-www-form-urlencoded"
      },
      form: {
        phone: phone,
        callback: "025521947",
        message: message,
        subject: "",
        reqdate: "0",
        refkey: "1212"
      }
    };

    return rpn(options);
  }
};

module.exports = Proxy;
