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
    var keyStr = new Buffer(encode, "base64").toString();
    var options = {
      method: "POST",
      url: url,
      headers: {
        "postman-token": "2c7e8d5e-6022-3ef3-a3b3-b9d69799db9c",
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
    var keyStr = new Buffer(encode, "base64").toString();
    var options = {
      method: "POST",
      url: url,
      headers: {
        "postman-token": "4b376613-30b7-cd72-b227-b7c3c9936810",
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
    var keyStr = new Buffer(encode, "base64").toString();
    var options = {
      method: "POST",
      url: url,
      headers: {
        "postman-token": "8b3b9c41-e302-02a0-625e-8f064633f604",
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
