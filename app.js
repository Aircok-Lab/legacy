var createError = require("http-errors");
var express = require("express");
var path = require("path");

var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var static = require("serve-static");
var expressErrorHandler = require("express-error-handler");
var expressSession = require("express-session");

var cors = require("cors");

var logger = require("morgan");
//var mailer = require('express-mailer');

// express 객체 생성
var app = express();
var fileRouter = require("./routes/FileUpload");
var userRouter = require("./routes/User");
var buildingRouter = require("./routes/Building");
var positionRouter = require("./routes/Position");
var deviceRouter = require("./routes/Device");
var productRouter = require("./routes/Product");
var settingRouter = require("./routes/Setting");
var dataRouter = require("./routes/Data");
var recentDataRouter = require("./routes/RecentData");
var indexTableRouter = require("./routes/IndexTable");
var alarmTableRouter = require("./routes/AlarmTable");
var proxyRouter = require("./routes/Proxy");
var score = require("./sensor/score");
var pm10 = require("./sensor/pm10");
var pm25 = require("./sensor/pm25");
var co2 = require("./sensor/co2");
var hcho = require("./sensor/hcho");
var voc = require("./sensor/voc");
var temperature = require("./sensor/temperature");
var humidity = require("./sensor/humidity");
var temperaturePublic = require("./sensor/temperaturePublic");
var humidityPublic = require("./sensor/humidityPublic");
var noise = require("./sensor/noise");
var co = require("./sensor/co");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));

// body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

// public 폴더와 uploads 폴더 오픈
app.use("/public", static(path.join(__dirname, "public")));
app.use("/uploads", static(path.join(__dirname, "uploads")));

// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true
  })
);

// 클라이언트에서 ajax로 요청했을 때 CORS(다중 서버 접속) 지원
app.use(cors());
app.use(logger("dev"));

app.use("/file", fileRouter);
app.use("/user", userRouter);
app.use("/building", buildingRouter);
app.use("/position", positionRouter);
app.use("/device", deviceRouter);
app.use("/product", productRouter);
app.use("/setting", settingRouter);
app.use("/data", dataRouter);
app.use("/recentData", recentDataRouter);
app.use("/indexTable", indexTableRouter);
app.use("/alarmTable", alarmTableRouter);
app.use("/proxy", proxyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

score.getSCOREScore();
pm10.getPM10Score();
pm25.getPM25Score();
co2.getCO2Score();
hcho.getHCHOScore();
voc.getVOCScore();
temperature.getTEMPScore();
humidity.getHUMIScore();
temperaturePublic.getTEMPScore();
humidityPublic.getHUMIScore();
noise.getNOISEScore();
co.getCOScore();
pm10.getPM10Alarm();
pm25.getPM25Alarm();
co2.getCO2Alarm();
hcho.getHCHOAlarm();
voc.getVOCAlarm();
temperature.getTEMPAlarm();
humidity.getHUMIAlarm();
temperaturePublic.getTEMPAlarm();
humidityPublic.getHUMIAlarm();
noise.getNOISEAlarm();
co.getCOAlarm();

module.exports = app;
