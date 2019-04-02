var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  var now = Date();
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(now);
});

module.exports = router;
