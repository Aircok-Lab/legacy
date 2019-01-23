var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mailer = require('express-mailer');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var buildingRouter = require('./routes/Building');
var positionRouter = require('./routes/Position');
var deviceRouter = require('./routes/Device');
var productRouter = require('./routes/Product');
var settingRouter = require('./routes/Setting');
var dataRouter = require('./routes/Data');
var recentDataRouter = require('./routes/RecentData');
var indexTableRouter = require('./routes/IndexTable');
var global = require('./global');
var score = require('./sensor/score');
var pm10 = require('./sensor/pm10');
var pm25 = require('./sensor/pm25');
var co2 = require('./sensor/co2');
var hcho = require('./sensor/hcho');
var voc = require('./sensor/voc');
var temperature = require('./sensor/temperature');
var humidity = require('./sensor/humidity');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/building', buildingRouter);
app.use('/position', positionRouter);
app.use('/device', deviceRouter);
app.use('/product', productRouter);
app.use('/setting', settingRouter);
app.use('/data', dataRouter);
app.use('/recentData', recentDataRouter);
app.use('/IndexTable', indexTableRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

score.getSCOREScore();
pm10.getPM10Score();
pm25.getPM25Score();
co2.getCO2Score();
hcho.getHCHOScore();
voc.getVOCScore();
temperature.getTEMPScore();
humidity.getHUMIScore();
pm10.getPM10Alarm();
pm25.getPM25Alarm();
co2.getCO2Alarm();
hcho.getHCHOAlarm();
voc.getVOCAlarm();
temperature.getTEMPAlarm();
humidity.getHUMIAlarm();

module.exports = app;
