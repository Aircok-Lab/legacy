var rpn = require("request-promise-native");

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
  sendSMS: function(url, token) {
    var id = "aircok";
    var encode = id + ":" + token;
    var keyStr = Buffer.from(encode).toString("base64");
    var options = {
      method: "POST",
      url: url,
      headers: {
        "cache-control": "no-cache",
        authorization: "Basic " + keyStr,
        "content-type": "application/x-www-form-urlencoded"
      },
      form: {
        phone: "01029724066",
        callback: "025521947",
        message: "test2 문자 발송입니다.",
        reqdate: "0",
        refkey: "1212"
      }
    };

    return rpn(options);
  },
  sendLMS: function(url, token) {
    var id = "aircok";
    var encode = id + ":" + token;
    var keyStr = Buffer.from(encode).toString("base64");
    var options = {
      method: "POST",
      url: url,
      headers: {
        "cache-control": "no-cache",
        authorization: "Basic " + keyStr,
        "content-type": "application/x-www-form-urlencoded"
      },
      form: {
        phone: "01029724066",
        callback: "025521947",
        message: "장문 문자 메세지 테스트입니다.",
        subject: "",
        reqdate: "",
        refkey: "1212"
      }
    };

    return rpn(options);
  }
};

module.exports = Proxy;
