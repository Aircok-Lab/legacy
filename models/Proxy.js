var rpn = require("request-promise-native");

var Proxy = {
  get: function(url) {
    return rpn({
      uri: url,
      method: "GET"
    });
  },
  getToken: function(url) {
    var options = {
      method: "POST",
      url: url,
      headers: {
        "postman-token": "2c7e8d5e-6022-3ef3-a3b3-b9d69799db9c",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        authorization:
          "Basic YWlyY29rOmM3MjMwOWZkNjRjZGRlYzkyNmM5ZTM2N2Y0ODU1ZjAz"
      },
      form: { grant_type: "client_credentials" }
    };

    return rpn(options);
  }
};

module.exports = Proxy;
