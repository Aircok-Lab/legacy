import { OK, FAIL } from "../public/javascripts/defined";
import axios from "axios";
var express = require("express");
var router = express.Router();

/* INSERT setting */
router.post("/getToken", function(req, res, next) {
  console.log("/getToken 호출됨.");

  const api = axios.create({
    baseURL: `https://sms.gabia.com/`,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      authorization:
        "Basic YWlyY29rOmM3MjMwOWZkNjRjZGRlYzkyNmM5ZTM2N2Y0ODU1ZjAz"
    }
  });

  api
    .post(`oauth/token`, {
      grant_type: "client_credentials"
    })
    .then(function(response) {
      console.dir(response);
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = OK;
      result.message = "성공";
      result.data = res.data;
      res.send(result);
    })
    .catch(function(error) {
      var result = { statusCode: null, message: null, data: null };
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    });
});

module.exports = router;
