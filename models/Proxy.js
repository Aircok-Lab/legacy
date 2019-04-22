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
    var key = "c72309fd64cddec926c9e367f4855f03";
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
    if (phone.endsWith("-")) phone = phone.replace("-", "");
    return rpn(options);
  },
  sendLMS: function(phone, message) {
    var id = "aircok";
    var encode = id + ":" + global.smsToken;
    var keyStr = Buffer.from(encode).toString("base64");
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
    if (phone.endsWith("-")) phone = phone.replace("-", "");
    return rpn(options);
  }
};

module.exports = Proxy;
