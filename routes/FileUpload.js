import { OK, FAIL } from "../public/javascripts/defined";
var express = require("express");
var multer = require("multer");
var fs = require("fs");
var router = express.Router();

// multer 미들웨어 사용 : 미들웨어 사용 순서 중요 body-parser -> multer -> router
// 파일 제한 : 10개, 1G
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "uploads");
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname /* + Date.now()*/);
  }
});

var upload = multer({
  storage: storage,
  limits: {
    files: 1,
    fileSize: 1024 * 1024 * 1024
  }
});

router
  .route("/upload")
  .post(upload.single("firmware"), function(req, res, next) {
    console.log("/upload 호출됨.");
    var result = { statusCode: null, message: null, data: null };
    var data = {};
    try {
      var file = req.file;

      console.log("#=========== 업로드된 첫번째 파일 정보 ========#");
      console.dir(req.file);
      console.log("#===========#");

      var originalname = "",
        filename = "",
        mimetype = "",
        size = 0; // 현재의 파일 정보를 저장할 변수 선언

      // data.originalname = file.originalname;
      data.filename = file.filename;
      // data.mimetype = file.mimetype;
      data.size = file.size;

      console.log(
        "현재 파일 정보 : " +
          originalname +
          "," +
          filename +
          "," +
          mimetype +
          "," +
          size
      );

      //클라이언트에 응답 전송
      result.statusCode = OK;
      result.message = "성공";
      result.data = data;
      res.send(result);
    } catch (err) {
      console.dir(err.stack);
      result.statusCode = FAIL;
      result.message = "실패";
      res.send(result);
    }
  });

module.exports = router;
