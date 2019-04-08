var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  var now = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(now);
});

module.exports = router;
