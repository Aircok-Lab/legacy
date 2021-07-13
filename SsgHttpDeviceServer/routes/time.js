var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  var now = new Date();
  var tz = now.getTime() + 9 * 3600000;
  now.setTime(tz);
  now = now
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);
  now = "$$aircok:s$$"+now+"$$aircok:e$$"+"\r\n";  
  //now = now + "\r\n";
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(now);
});

module.exports = router;