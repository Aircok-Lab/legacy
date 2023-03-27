const urlParams = new URLSearchParams(window.location.search);
const oper = urlParams.get('oper');
const date = urlParams.get('date');
//cj 추가
const sTime = urlParams.get('sTime');
const eTime = urlParams.get('eTime');
//까지
const host = urlParams.get('host');
const devId = urlParams.get('devId');
const sn = urlParams.get('sn');
const deviceSN = urlParams.get('deviceSN');
const buildingName = urlParams.get('buildingName');
const deviceName = urlParams.get('deviceName');
const e3Score = urlParams.get('e3Score');
const measurementList = urlParams.get('measurementList');


const startDate = getNotBeforeToPickmeup( date ) + " " + sTime +":00:00";
const endDate = getNotAfterToPickmeup( date ) + " " + eTime +":00:00";

const labelName = ["PM10", "PM2.5", "CO2", "HCHO", "VOC", "온도", "습도","소음"];
const labelvar = ["pm10", "pm25", "co2", "hcho", "voc", "temperature", "humidity"];


const bgColor = ["#2DA1DA", "#2FB983", "#E7A527", "#E34F20", "#D8071F", "#6D30A9"];
const indexlabelName = ["좋음", "보통", "약간나쁨", "나쁨", "매우나쁨", "최악"];


// const measurementList = "미세먼지(PM10), 초미세먼지(PM2.5), 이산화탄소(CO2), 포름알데히드(HCHO), 휘발성유기화합물(VOCs), 온도 ,습도";

var list4RecomendedVal = [100, 50, 1000, 100, 500, "-", "-","-"]; 

var avgPm10;
var avgPm25;
var avgCo2;
var avgHcho;
var avgVoc;
var avgTemperature;
var avgHumidity;
var avgNoise;

var maxPm10 = 0;
var maxPm25 = 0;
var maxCo2 = 0;
var maxHcho = 0;
var maxVoc = 0;
var maxTemperature = 0;
var maxHumidity = 0;
var maxNoise = 0;

var minPm10 = 100;
var minPm25 = 50;
var minCo2 = 1000;
var minHcho = 100;
var minVoc = 500;
var minTemperature = 25;
var minHumidity = 50;
var minNoise = 60;


var timeline = [];
var valPm10 = [];
var valPm25 = [];
var valCo2 = [];
var valHcho = [];
var valVoc = [];
var valTemperature = [];
var valHumidity = [];
var valNoise = [];

var alaramCntPm10 = [];
var alaramCntPm25 = [];
var alaramCntCo2 = [];
var alaramCntHcho = [];
var alaramCntVoc = [];
var alaramCntTemperature = [];
var alaramCntHumidity = [];
var alaramCntNoise = [];

var alaramPerDayValPm10 = 0;
var alaramPerDayValPm25 = 0;
var alaramPerDayValCo2 = 0;
var alaramPerDayValHcho = 0;
var alaramPerDayValVoc = 0;
var alaramPerDayValTemperature = 0;
var alaramPerDayValHumidity = 0;
var alaramPerDayValNoise = 0;

var weekendTimeline;
var weekendDataPm10 = [[]];
var weekendDataPm25 = [[]];
var weekendDataCo2 = [[]];
var weekendDataHcho = [[]];
var weekendDataVoc = [[]];
var weekendDataTemperature = [[]];
var weekendDataHumidity = [[]];
var weekendDataNoise = [[]];

var weekDayDataPm10 = [[]];
var weekDayDataPm25 = [[]];
var weekDayDataCo2 = [[]];
var weekDayDataHcho = [[]];
var weekDayDataVoc = [[]];
var weekDayDataTemperature = [[]];
var weekDayDataHumidity = [[]];
var weekDayDataNoise = [[]];

var scopeValPm10 = Array(6).fill(0);
var scopeValPm25 = Array(6).fill(0);
var scopeValCo2 = Array(6).fill(0);
var scopeValHcho = Array(6).fill(0);
var scopeValVoc = Array(6).fill(0);
var scopeValTemperature = Array(6).fill(0);
var scopeValHumidity = Array(6).fill(0);
var scopeValNoise = Array(6).fill(0);

var jsonObj;
var objArr;
var jsonAlaramObj;

window.onload = function() {
    initInfo();
    // generateChartData1();
}
function popReport4Pdf() {
    var reportDate = document.getElementById( 'reportDate' ).value;
    window.print( "./report_sample.html?oper=pdf&date=" + reportDate + "&host=" + host + "&devId=" + devId + "&sn=" + sn, "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=1000, height=900" );
}
function printPdf( oper ) {
    if ( oper == 'pdf' ) {
        window.printPdf();  
    }
}
function initInfo() {
    return new Promise( function( resolve ) {
        
        requestAjax( "POST", host + "/RecentData/getRecentDataByDeviceSN?deviceSN=" + sn, function( err, datums ) {
            resolve( datums );
        });
    })
    .then( function( result ) {
        var jsonObj = JSON.parse( result );
        initInfomation( jsonObj );
        // console.log(result);
    });
}

function initInfomation(jsonObj) {

    var deviceSN = jsonObj.data[0].deviceSN;
    var deviceName = jsonObj.data[0].deviceName;
    var buildingName = jsonObj.data[0].buildingName;
    var e3Score = jsonObj.data[0].e3Score;
    var indexlabelName = jsonObj.data[0].indexlabelName;
    var date = jsonObj.data[0].date;
    var dateTime = date.replace(/([^T]+)T([^\.]+).*/g, "$1 $2").slice(0, -3) + ":00"

    document.getElementById( 'reportDate' ).innerHTML = startDate +"~"+ endDate;
    document.getElementById( 'dName' ).innerHTML = deviceName;
    document.getElementById( 'serial' ).innerHTML = deviceSN;
    document.getElementById( 'mlist' ).innerHTML = labelName;

    
    generateChartData();
}

function setTotalSCore1(jsonObj) {
    var timePred = jsonObj.data[0].time_pred;
    var pm10Pred = jsonObj.data[0].pm10_pred;
    var pm25Pred = jsonObj.data[0].pm25_pred;
   

 
}



function generateChartData() {
    var scopeVals = [];    
    
    // get index(scope) val
    return getScopeVal( 'pm10' ).then( function( result ) {
        scopeVals[0] = JSON.parse( result ).data;
    }).then( function() {
        getScopeVal( 'pm25' ).then( function( result ) {
            scopeVals[1] = JSON.parse( result ).data;
        }).then( function() {
            getScopeVal( 'co2' ).then( function( result ) {
                scopeVals[2] = JSON.parse( result ).data;
            }).then( function() {
                getScopeVal( 'hcho' ).then( function( result ) {
                    scopeVals[3] = JSON.parse( result ).data;
                }).then( function() {
                    getScopeVal( 'voc' ).then( function( result ) {
                        scopeVals[4] = JSON.parse( result ).data;
                    }).then( function() {
                        getScopeVal( 'temperature' ).then( function( result ) {
                            scopeVals[5] = JSON.parse( result ).data;
                        }).then( function() {
                            getScopeVal( 'humidity' ).then( function( result ) {
                                scopeVals[6] = JSON.parse( result ).data;
                            }).then( function() {
                                getScopeVal( 'noise' ).then( function( result ) {
                                    scopeVals[7] = JSON.parse( result ).data;
                                }).then( function() {
                                    // get chart val
                                    new Promise( function( resolve ) {
                                        requestAjax( "POST", host + "/report/getChartDataByDate?serialNumber=" + sn + "&startDate=" + startDate + "&endDate=" + endDate, function( err, datums ) {
                                            resolve( datums );
                                        });
                                    })
                                    .then( function( result ) {
                                        jsonObj = JSON.parse( result );
                                        // get alaram val
                                        new Promise( function( resolve ) {
                                            requestAjax( "POST", host + "/AlarmTable/getAlarmValue", function( err, datums ) {
                                                resolve( datums );
                                            })
                                        })
                                        .then( function( alaramVal ) {
                                            jsonAlaramObj = JSON.parse( alaramVal );
                                            combineReportDatas( scopeVals );
                                        })
                                        .then( function() {
                                            write3word();
                                            write4word();
                                            write5Word();
                                            write6Word();
                                            write8Word();
                                        })
                                        .then( function() {
                                            draw3_HalfDoughnutChartTable( scopeVals );
                                            draw3_HalfDoughnutChart();
                                            draw4_1RadarChart();
                                            draw5_1LineChart();
                                            draw6_stackedBarChartSet();
                                         
                                        }).then( function() {
                                            buddyChart();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

var tmpHour = -1;
var weekendi = -1;
var weekdayi = -1;
function combineReportDatas( scopeVals ) {
    var dataLen = jsonObj.data.length;
    var totalPm10 = 0;
    var totalPm25 = 0;
    var totalCo2 = 0;
    var totalHcho = 0;
    var totalVoc = 0;
    var totalTemperature = 0;
    var totalHumidity = 0;
    var totalNoise = 0;

    jsonObj.data.forEach( function( item ) {
        // 이거 item.date에 박아 넣어야 함
        item.date = moment( item.date ).utc().format( 'YYYY-MM-DD HH:mm:ss' );

        // classify values
        timeline.push( item.date );
        valPm10.push( item.pm10 );
        valPm25.push( item.pm25 );
        valCo2.push( item.co2 );
        valHcho.push( item.hcho );
        valVoc.push( item.voc );
        valTemperature.push( item.temperature );
        valHumidity.push( item.humidity );
        valNoise.push( item.noise );

        // classify no 6 chart value
        if ( moment(item.date).day() == 0 || moment(item.date).day() == 6 ) {
            var hour = moment( item.date ).format( "HH" );
            
            if ( tmpHour != hour ) {               
                tmpHour = hour;
                weekendi = (weekendi + 1) % 24;

                if ( weekendDataPm10[weekendi] == 0 || weekendDataPm10[weekendi] == null ) {
                    weekendDataPm10[weekendi] = [];
                    weekendDataPm10[weekendi] = Array(6).fill(0);
                    weekendDataPm25[weekendi] = [];
                    weekendDataPm25[weekendi] = Array(6).fill(0);
                    weekendDataCo2[weekendi] = [];
                    weekendDataCo2[weekendi] = Array(6).fill(0);
                    weekendDataHcho[weekendi] = [];
                    weekendDataHcho[weekendi] = Array(6).fill(0);
                    weekendDataVoc[weekendi] = [];
                    weekendDataVoc[weekendi] = Array(6).fill(0);
                    weekendDataTemperature[weekendi] = [];
                    weekendDataTemperature[weekendi] = Array(6).fill(0);
                    weekendDataHumidity[weekendi] = [];
                    weekendDataHumidity[weekendi] = Array(4).fill(0);
                    weekendDataNoise[weekendi] = [];
                    weekendDataNoise[weekendi] = Array(4).fill(0);
                }
            } else { 
                for ( var j=0; j<scopeValPm10.length; j++ ) {
                    weekendDataPm10[weekendi][j] = calcScopVal( scopeVals[0][j], "pm10", item, weekendDataPm10[weekendi][j] );
                    weekendDataPm25[weekendi][j] = calcScopVal( scopeVals[1][j], "pm25", item, weekendDataPm25[weekendi][j] );
                    weekendDataCo2[weekendi][j] = calcScopVal( scopeVals[2][j], "co2", item, weekendDataCo2[weekendi][j] );
                    weekendDataHcho[weekendi][j] = calcScopVal( scopeVals[3][j], "hcho", item, weekendDataHcho[weekendi][j] );
                    weekendDataVoc[weekendi][j] = calcScopVal( scopeVals[4][j], "voc", item, weekendDataVoc[weekendi][j] );
                    weekendDataNoise[weekendi][j] = calcScopVal( scopeVals[7][j], "humidity", item, weekendDataNoise[weekendi][j] );

                    if ( j < scopeVals[5].length ) {
                        weekendDataTemperature[weekendi][j] = calcScopVal( scopeVals[5][j], "noise", item, weekendDataTemperature[weekendi][j] );
                        weekendDataHumidity[weekendi][j] = calcScopVal( scopeVals[6][j], "temperature", item, weekendDataHumidity[weekendi][j] );
                    }
                }
            }
        } else {
            var hour = moment( item.date ).format( "HH" );
            
            if ( tmpHour != hour ) {               
                tmpHour = hour;
                weekdayi = (weekdayi + 1) % 24;

                if ( weekDayDataPm10[weekdayi] == 0 || weekDayDataPm10[weekdayi] == null ) {
                    weekDayDataPm10[weekdayi] = [];
                    weekDayDataPm10[weekdayi] = Array(6).fill(0);
                    weekDayDataPm25[weekdayi] = [];
                    weekDayDataPm25[weekdayi] = Array(6).fill(0);
                    weekDayDataCo2[weekdayi] = [];
                    weekDayDataCo2[weekdayi] = Array(6).fill(0);
                    weekDayDataHcho[weekdayi] = [];
                    weekDayDataHcho[weekdayi] = Array(6).fill(0);
                    weekDayDataVoc[weekdayi] = [];
                    weekDayDataVoc[weekdayi] = Array(6).fill(0);
                    weekDayDataTemperature[weekdayi] = [];
                    weekDayDataTemperature[weekdayi] = Array(6).fill(0);
                    weekDayDataHumidity[weekdayi] = [];
                    weekDayDataHumidity[weekdayi] = Array(4).fill(0);
                    weekDayDataNoise[weekdayi] = [];
                    weekDayDataNoise[weekdayi] = Array(4).fill(0);
                }
            } else { 
                for ( var j=0; j<scopeValPm10.length; j++ ) {
                    weekDayDataPm10[weekdayi][j] = calcScopVal( scopeVals[0][j], "pm10", item, weekDayDataPm10[weekdayi][j] );
                    weekDayDataPm25[weekdayi][j] = calcScopVal( scopeVals[1][j], "pm25", item, weekDayDataPm25[weekdayi][j] );
                    weekDayDataCo2[weekdayi][j] = calcScopVal( scopeVals[2][j], "co2", item, weekDayDataCo2[weekdayi][j] );
                    weekDayDataHcho[weekdayi][j] = calcScopVal( scopeVals[3][j], "hcho", item, weekDayDataHcho[weekdayi][j] );
                    weekDayDataVoc[weekdayi][j] = calcScopVal( scopeVals[4][j], "voc", item, weekDayDataVoc[weekdayi][j] );
                    weekDayDataNoise[weekdayi][j] = calcScopVal( scopeVals[7][j], "humidity", item, weekDayDataNoise[weekdayi][j] );

                    if ( j < scopeVals[5].length ) {
                        weekDayDataTemperature[weekdayi][j] = calcScopVal( scopeVals[5][j], "noise", item, weekDayDataTemperature[weekdayi][j] );
                        weekDayDataHumidity[weekdayi][j] = calcScopVal( scopeVals[6][j], "temperature", item, weekDayDataHumidity[weekdayi][j] );
                        
                    }
                }
            }
        }

        // calc total val
        totalPm10 = totalPm10 + item.pm10;
        totalPm25 = totalPm25 + item.pm25;
        totalCo2 = totalCo2 + item.co2;
        totalHcho = totalHcho + item.hcho;
        totalVoc = totalVoc + item.voc;
        totalTemperature = totalTemperature + item.temperature;
        totalHumidity = totalHumidity + item.humidity;
        totalNoise = totalNoise + item.noise;
        
        // calc max val
        if ( maxPm10 < item.pm10 ){ 
            maxPm10 = item.pm10;
            maxTimePm10 = item.date;
            document.getElementById('maxTimePm10').innerHTML= maxTimePm10
        }
        if ( maxPm25 < item.pm25 ) {
            maxPm25 = item.pm25;
            maxTimePm25 = item.date;
            document.getElementById('maxTimePm25').innerHTML= maxTimePm25
        }
        if ( maxCo2 < item.co2 ) {
            maxCo2 = item.co2;
            maxTimeCo2 = item.date;
            document.getElementById('maxTimeCo2').innerHTML= maxTimeCo2
        }
        
        if ( maxHcho < item.hcho ){
            maxHcho = item.hcho;
            maxTimeHcho = item.date;
            if(maxHcho == 0 ){
                document.getElementById('maxTimeHcho').innerHTML= "0"
            }
            else{
                document.getElementById('maxTimeHcho').innerHTML= maxTimeHcho
            }
        } 

        if ( maxVoc < item.voc ) {
            maxVoc = item.voc;
            maxTimeVoc = item.date;
            document.getElementById('maxTimeVoc').innerHTML= maxTimeVoc
        }
        if ( maxTemperature < item.temperature ) {
            maxTemperature = item.temperature;
            maxTimeTemperature = item.date
            document.getElementById('maxTimeTemperature').innerHTML= maxTimeTemperature
        }
        
        if ( maxHumidity < item.humidity ){
            maxHumidity = item.humidity;
            maxTimeHumidity = item.date;
            document.getElementById('maxTimeHumidity').innerHTML= maxTimeHumidity
        }
        if ( maxNoise < item.noise ) {
            maxNoise = item.noise;
            maxTimeNoise = item.date;
            document.getElementById('maxTimeNoise').innerHTML= maxTimeNoise
        }
        
        
        // calc min val
        if ( minPm10 > item.pm10 ){
            minPm10 = item.pm10;
            minTimePm10 = item.date;
            document.getElementById('minTimePm10').innerHTML= minTimePm10
        }
        
        if ( minPm25 > item.pm25 ) {
            minPm25 = item.pm25;
            minTimePm25 = item.date;
            document.getElementById('minTimePm25').innerHTML= minTimePm25
        }

        if ( minCo2 > item.co2 ) {
            minCo2 = item.co2;
            minTimeCo2 = item.date;
            document.getElementById('minTimeCo2').innerHTML= minTimeCo2
        }
        
        if ( minHcho > item.hcho ) {
            minHcho = item.hcho;
            minTimehcho = item.date;
            if(minHcho == 0 ){
                document.getElementById('minTimeHcho').innerHTML= "-"
            }
            else{
                document.getElementById('minTimeHcho').innerHTML= minTimehcho
            }
        }
        
        if ( minVoc > item.voc ) {
            minVoc = item.voc;
            minTimeVoc = item.date;
            document.getElementById('minTimeVoc').innerHTML= minTimeVoc
        }
        
        if ( minTemperature > item.temperature ) {
            minTemperature = item.temperature;
            minTimeTemperature = item.date;
            document.getElementById('minTimeTemperature').innerHTML= minTimeTemperature
        }
        if ( minHumidity > item.humidity ) {
            minHumidity = item.humidity;
            minTimeHumidity = item.date;
            document.getElementById('minTimeHumidity').innerHTML= minTimeHumidity
        } 
        if ( minNoise > item.noise ) {
            minNoise = item.noise ;        
            minTimeNoise = item.date;
            document.getElementById('minTimeNoise').innerHTML= minTimeNoise
        }
        
        
        

        //calc over alaram val(No. 5 Chart ) 
        if ( jsonAlaramObj.data.pm10 <= item.pm10 ) alaramCntPm10.push( item.date );
        if ( jsonAlaramObj.data.pm25 <= item.pm25 ) alaramCntPm25.push( item.date );
        if ( jsonAlaramObj.data.co2 <= item.co2 ) alaramCntCo2.push( item.date );
        if ( jsonAlaramObj.data.hcho <= item.hcho ) alaramCntHcho.push( item.date );
        if ( jsonAlaramObj.data.voc <= item.voc ) alaramCntVoc.push( item.date );
        if ( jsonAlaramObj.data.temperature <= item.temperature ) alaramCntTemperature.push( item.date );
        if ( jsonAlaramObj.data.humidity <= item.humidity ) alaramCntHumidity.push( item.date );
        if ( jsonAlaramObj.data.noise <= item.noise ) alaramCntNoise.push( item.date );


        for ( var j=0; j<scopeValPm10.length; j++ ) {
            //calc distribution val(No. 3 Chart)
            scopeValPm10[ scopeVals[0][j].grade-1 ] = calcScopVal( scopeVals[0][j], "pm10", item, scopeValPm10[ scopeVals[0][j].grade-1 ] );
            scopeValPm25[ scopeVals[1][j].grade-1 ] = calcScopVal( scopeVals[1][j], "pm25", item, scopeValPm25[ scopeVals[1][j].grade-1 ] );
            scopeValCo2[ scopeVals[2][j].grade-1 ] = calcScopVal( scopeVals[2][j], "co2", item, scopeValCo2[ scopeVals[2][j].grade-1 ] );
            scopeValHcho[ scopeVals[3][j].grade-1 ] = calcScopVal( scopeVals[3][j], "hcho", item, scopeValHcho[ scopeVals[3][j].grade-1 ] );
            scopeValVoc[ scopeVals[4][j].grade-1 ] = calcScopVal( scopeVals[4][j], "voc", item, scopeValVoc[ scopeVals[4][j].grade-1 ] );
            scopeValNoise[ scopeVals[7][j].grade-1 ] = calcScopVal( scopeVals[7][j], "noise", item, scopeValNoise[ scopeVals[7][j].grade-1 ] );
            
            if ( j < scopeVals[5].length ) {
                scopeValTemperature[ scopeVals[5][j].grade-1 ] = calcScopVal( scopeVals[5][j], "temperature", item, scopeValTemperature[ scopeVals[5][j].grade-1 ] );
                scopeValHumidity[ scopeVals[6][j].grade-1 ] = calcScopVal( scopeVals[6][j], "humidity", item, scopeValHumidity[ scopeVals[6][j].grade-1 ] );
            }
        }
    });

    // 값 평균
    avgPm10 = Math.round( totalPm10 / dataLen, 2 );
    avgPm25 = Math.round( totalPm25 / dataLen, 2 );
    avgCo2 = Math.round( totalCo2 / dataLen, 2 );
    avgHcho = Math.round( totalHcho / dataLen, 2 );
    avgVoc = Math.round( totalVoc / dataLen, 2 );
    avgTemperature = Math.round( totalTemperature / dataLen, 2 );
    avgHumidity = Math.round( totalHumidity / dataLen, 2 );
    avgNoise = Math.round( totalNoise / dataLen, 2 );

    //calc alarm per day(No. 4 Chart ) 
    alaramPerDayValPm10 = calcAlaramPerDay( alaramCntPm10 );
    alaramPerDayValPm25 = calcAlaramPerDay( alaramCntPm25 );
    alaramPerDayValCo2 = calcAlaramPerDay( alaramCntCo2 );
    alaramPerDayValHcho = calcAlaramPerDay( alaramCntHcho );
    alaramPerDayValVoc = calcAlaramPerDay( alaramCntVoc );
    alaramPerDayValTemperature = calcAlaramPerDay( alaramCntTemperature );
    alaramPerDayValHumidity = calcAlaramPerDay( alaramCntHumidity );
    alaramPerDayValNoise = calcAlaramPerDay( alaramCntNoise );
    
    // calc no. 6 chart data
    
        if ( weekendDataPm10 != 0 ) {
            weekendDataPm10 = getDayByDay100Data( weekendDataPm10 );
            weekendDataPm25 = getDayByDay100Data( weekendDataPm25 );
            weekendDataCo2 = getDayByDay100Data( weekendDataCo2 );
            weekendDataHcho = getDayByDay100Data( weekendDataHcho );
            weekendDataVoc = getDayByDay100Data( weekendDataVoc );
            weekendDataTemperature = getDayByDay100Data( weekendDataTemperature );
            weekendDataHumidity = getDayByDay100Data( weekendDataHumidity );
            weekendDataNoise = getDayByDay100Data( weekendDataNoise );
        }

        if ( weekDayDataPm10 != 0 ) {
            weekDayDataPm10 = getDayByDay100Data( weekDayDataPm10 );
            weekDayDataPm25 = getDayByDay100Data( weekDayDataPm25 );
            weekDayDataCo2 = getDayByDay100Data( weekDayDataCo2 );
            weekDayDataHcho = getDayByDay100Data( weekDayDataHcho );
            weekDayDataVoc = getDayByDay100Data( weekDayDataVoc );
            weekDayDataTemperature = getDayByDay100Data( weekDayDataTemperature );
            weekDayDataHumidity = getDayByDay100Data( weekDayDataHumidity );
            weekDayDataNoise = getDayByDay100Data( weekDayDataNoise );
        }
 
}

function draw3_HalfDoughnutChartTable( scopeVals ) {
    var avgHalChartTable = new Array();
    avgHalChartTable[0] = document.getElementById( 'avgHalChartTablePm25');
    avgHalChartTable[1] = document.getElementById( 'avgHalChartTablePm10');
    avgHalChartTable[2] = document.getElementById( 'avgHalChartTableCo2');
    avgHalChartTable[3] = document.getElementById( 'avgHalChartTableHcho');
    avgHalChartTable[4] = document.getElementById( 'avgHalChartTableVoc');
    avgHalChartTable[5] = document.getElementById( 'avgHalChartTableTemperature');
    avgHalChartTable[6] = document.getElementById( 'avgHalChartTableHumidity');
    avgHalChartTable[7] = document.getElementById( 'avgHalChartTableNoise');
    var i=0;
    scopeVals.forEach( function( item ) {
        for ( var j=0; j<item.length; j++ ){
            avgHalChartTable[i].rows[1].cells[j].innerHTML = item[j].min + "~" + item[j].max;
                
        }
        i++;
    });
}

function draw3_HalfDoughnutChart() {
    draw3_HalfDoughnutChartDetail( "val_avg_half_pie_chart1", 'pg/m2', scopeValPm25, avgPm25 );
    draw3_HalfDoughnutChartDetail( "val_avg_half_pie_chart2", 'pg/m2', scopeValPm10, avgPm10 );
    draw3_HalfDoughnutChartDetail( "val_avg_half_pie_chart4", 'ppm', scopeValCo2, avgCo2 );
    draw3_HalfDoughnutChartDetail( "val_avg_half_pie_chart5", 'pg/m2', scopeValHcho, avgHcho );
    draw3_HalfDoughnutChartDetail( "val_avg_half_pie_chart6", 'pg/m2', scopeValVoc, avgVoc );
    // draw3_HalfDoughnutChartDetail( "val_avg_half_pie_chart7", '.C', scopeValTemperature, avgTemperature );
    // draw3_HalfDoughnutChartDetail( "val_avg_half_pie_chart8", '%', scopeValHumidity, avgHumidity );
    draw3_HalfDoughnutChartDetail( "val_avg_half_pie_chart9", 'dbl', scopeValNoise, avgNoise );
}

function draw3_HalfDoughnutChartDetail( chartName, unit, datas, centerVal ) {
    var centerValLength = centerVal.toString().length;
    var centerValSize;
    if ( centerValLength == 1) {
        centerValSize = 270;
    } 

    new Chart(document.getElementById(chartName), {
        type: 'bar',
        data: {
            datasets: [
                {
                    backgroundColor: bgColor,
                    data: datas,
                }
            ],
            labels: indexlabelName
        },
        options: {
            responsive: true,
            legend: {
                display: false
                
            },
            elements: {
                center: {
                    text: centerVal,
                    textSupport: unit,
                    fontSize: centerValSize
                }
            },
            plugins: {
                datalabels: {
                    formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map(data => {
                            sum += data;
                        });
                        let percentage = (value*100 / sum).toFixed(0)+"%";
                        return percentage;
                    },
                    color: '#fff'
                }
            },
            rotation: 1 * Math.PI,
            circumference: 1 * Math.PI,
        }
    });
}

function draw4_1RadarChartTable( avgVal, maxVal, recomendedVal,minVal ) {
    var radarChartTable = document.getElementById( 'air_element_anal_table');
   
    if(maxVal[0] <= 150){
        document.getElementById( 'maxPm10' ).innerHTML =  "권장수치인 PM10 = 100, PM2.5 = 50 이하의 수치로 잘 관리되고 있습니다.";
    }else{
        document.getElementById( 'maxPm10' ).innerHTML =  "권장수치인 PM10 = 100, PM2.5 = 50 이상일 때에 추가적인 관리(공기청정기 가동 또는 환기 등)가 필요합니다.";
    }

    if(maxVal[2] <= 1000){
        document.getElementById( 'maxCo2' ).innerHTML =  "권장수치인 1000 이하의 수치로 잘 관리되고 있습니다.";
    }else{
        document.getElementById( 'maxCo2' ).innerHTML =  "권장수치인 1000 이상일 때에 추가적인 관리(환기 또는 공조기 가동 등)가 필요합니다.";
    }

    if(maxVal[4] <= 500){
        document.getElementById( 'maxVoc' ).innerHTML =  "권장수치인 500 이하의 수치로 잘 관리되고 있습니다.";
    }else{
        document.getElementById( 'maxVoc' ).innerHTML =  "권장수치인 500 이상일 때에 추가적인 관리(환기 또는 공조기 가동 등)가 필요합니다.";
    }

    if(maxVal[3] <= 500){
        document.getElementById( 'maxHcho' ).innerHTML =  "권장수치인 100 이하의 수치로 잘 관리되고 있습니다.";
    }else{
        document.getElementById( 'maxHcho' ).innerHTML =  "권장수치인 500 이상일 때에 추가적인 관리(환기 또는 공조기 가동 등)가 필요합니다.";
    }

    for ( var i=0; i<radarChartTable.rows.length-1; i++ ) {
        radarChartTable.rows[i+1].cells[2].innerHTML = recomendedVal[i];
        radarChartTable.rows[i+1].cells[3].innerHTML = avgVal[i];
        radarChartTable.rows[i+1].cells[4].innerHTML = maxVal[i];
        radarChartTable.rows[i+1].cells[5].innerHTML = minVal[i];

    }
    
}


/* 4-1 radar chart */

function draw4_1RadarChart() {
    var avgVal = [avgPm10, avgPm25, avgCo2, avgHcho, avgVoc, avgTemperature, avgHumidity,avgNoise]
    var maxVal = [maxPm10, maxPm25, maxCo2, maxHcho, maxVoc, maxTemperature, maxHumidity,maxNoise]
    var minVal = [minPm10, minPm25, minCo2, minHcho, minVoc, minTemperature, minHumidity,minNoise]
    var maxtime = [maxTimePm10,maxTimePm25,maxTimeCo2,maxTimeVoc,maxTimeHcho,maxTimeHumidity,maxTimeTemperature,maxTimeNoise]
    var mintime = [minTimePm10,minTimePm25,minTimeCo2,minTimeVoc,minTimeHcho,minTimeHumidity,minTimeTemperature,minTimeNoise]
    console.log(maxVal);
    console.log(minVal);
    console.log(maxtime);
    console.log(mintime);
    draw4_1RadarChartTable( avgVal, maxVal, list4RecomendedVal,minVal );

    new Chart(document.getElementById("air_element_anal"), {
        type: 'line',
        data: {
            labels: labelName,
            datasets: [
                {
                    label: "평균값",
                    data: avgVal,
                    borderColor: "#0000ff",
                    fill: false
                },
                {
                    label: "최대값",
                    data: maxVal,
                    borderColor: "#ff9204",
                    fill: false
                },
                {
                    label: "최소값",
                    data: minVal,
                    borderColor: "#ff9204",
                    fill: false
                },
                {
                    label: "권고값",
                    data: list4RecomendedVal,
                    borderDash: [10, 5],
                    borderColor: "#dd88ff",
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'bottom'
            },
            plugins: {
                datalabels: {
                    display:false
                }
            }
            
        }
    });
}

/* 5-1 line chart */
function draw5_1LineChart() {
    draw5_1LineChartRepeatly( 1, "PM10", timeline, valPm10, jsonAlaramObj.data.pm10 );
    draw5_1LineChartRepeatly( 2, "PM25", timeline, valPm25, jsonAlaramObj.data.pm25 );
    draw5_1LineChartRepeatly( 3, "CO2", timeline, valCo2, jsonAlaramObj.data.co2 );
    draw5_1LineChartRepeatly( 4, "HCHO", timeline, valHcho, jsonAlaramObj.data.hcho );
    draw5_1LineChartRepeatly( 5, "VOC", timeline, valVoc, jsonAlaramObj.data.voc );
    draw5_1LineChartRepeatly( 6, "온도", timeline, valTemperature, jsonAlaramObj.data.temperature );
    draw5_1LineChartRepeatly( 7, "습도", timeline, valHumidity, jsonAlaramObj.data.humidity );
    draw5_1LineChartRepeatly( 8, "소음", timeline, valNoise, jsonAlaramObj.data.noise );
}

function draw5_1LineChartRepeatly( i, labelName, label, datas, alaramVal ) {
    new Chart(document.getElementById("air_polution_line_chart" + i), {
        type: 'line',
        data: {
            labels: label,
            datasets: [{
                data: datas,
                label: labelName,
                borderColor: "#3e95cd",
                fill: false,
                pointRadius: 0
            }, {
                data: getDataAsSame( datas.length, alaramVal ),
                label:"권장수치",
                borderColor: "#D8071F",
                fill: false,
                pointRadius: 0
            }
        ]
        },
        options: {
            responsive: false,
            plugins: {
                datalabels: {
                    display:false
                }
            }
        }
    });
}


function draw6_stackedBarChartSet() {
    if ( weekDayDataPm10 != 0 ) {
        draw6_stackedBarChart( 3, weekDayDataPm10 );
        draw6_stackedBarChart( 5, weekDayDataPm25 );
        draw6_stackedBarChart( 7, weekDayDataCo2 );
        draw6_stackedBarChart( 9, weekDayDataHcho );
        draw6_stackedBarChart( 11, weekDayDataVoc );
        draw6_stackedBarChart( 13, weekDayDataTemperature );
        draw6_stackedBarChart( 15, weekDayDataHumidity );
    }
  
    if ( weekendDataPm10 != 0 ) {
        draw6_stackedBarChart( 4, weekendDataPm10 );
        draw6_stackedBarChart( 6, weekendDataPm25 );
        draw6_stackedBarChart( 8, weekendDataCo2 );
        draw6_stackedBarChart( 10, weekendDataHcho );
        draw6_stackedBarChart( 12, weekendDataVoc );
        draw6_stackedBarChart( 14, weekendDataTemperature );
        draw6_stackedBarChart( 16, weekendDataHumidity );
    }


}

function draw6_stackedBarChart( i, datas ) {
    var datasSum = 0;
    datas.forEach( function(item) {
        datasSum = datasSum + item;
    });

    // stacked bar chart
    new Chart(document.getElementById("tot_air_qual_bar_chart" + i), {
        type: 'bar',
        data: {
            visible: true,
            labels: ['0:00','1:00','2:00','3:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00',
                    '13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
            datasets: [{
                data: getStackedBarChartDatas( datas, 0 ),
                label: "좋음",
                backgroundColor: '#2a85fd'
            },{
                data: getStackedBarChartDatas( datas, 1 ),
                label:"보통",
                backgroundColor: "#78c9a7"
            },{
                data: getStackedBarChartDatas( datas, 2 ),
                label:"약간나쁨",
                backgroundColor: "#f8ce12"
            },{
                data: getStackedBarChartDatas( datas, 3 ),
                label:"나쁨",
                backgroundColor: "#ee7b1c"
            },{
                data: getStackedBarChartDatas( datas, 4 ),
                label:"매우나쁨",
                backgroundColor: "#ff0404"
            },{
                data: getStackedBarChartDatas( datas, 5 ),
                label:"최악",
                backgroundColor: "#000000"
            }
        ]
        },
        options: {
            responsive: false,
            scales: {
                xAxes: [{ stacked: true }],
                yAxes: [{ stacked: true }]
            },
            legend: {
                position: 'bottom',
                labels: {
                    fontSize:10
                }
            },
            plugins: {
                datalabels: {
                    display:false
                }
            }
        }
    });
}



function write3word() {
    var pm10MaxIdx = largestIndexInArr( scopeValPm10 );
    var pm25MaxIdx = largestIndexInArr( scopeValPm25 );
    var co2MaxIdx = largestIndexInArr( scopeValCo2 );
    var hchoMaxIdx = largestIndexInArr( scopeValHcho );
    var vocMaxIdx = largestIndexInArr( scopeValVoc );
    var temperatureMaxIdx = largestIndexInArr( scopeValTemperature );
    var humidityMaxIdx = largestIndexInArr( scopeValHumidity );
    
    var pmMsg = "";
    var harmfulMsg = "";
    var airMsg = "";
    
    //pmMsg
    if( pm10MaxIdx <= 1 || pm25MaxIdx <= 1 ) {
        if ( pm10MaxIdx <= 1 ) { 
            pmMsg = pmMsg + "미세먼지, ";
        } 
        if ( pm25MaxIdx <= 1 ) {
            pmMsg = pmMsg + "초미세먼지, ";
        }
        pmMsg = pmMsg.substring( 0, pmMsg.length - 2 );
        pmMsg = pmMsg + " 항목은 잘 관리되고 있습니다. <br>";
    }    

    if( pm10MaxIdx >= 3 || pm25MaxIdx >= 3 ) {
        if ( pm10MaxIdx >= 3 ) {
            pmMsg = pmMsg + "미세먼지, ";
        }
        if ( pm25MaxIdx >= 3 ) {
            pmMsg = pmMsg + "초미세먼지, ";
        }
        pmMsg = pmMsg.substring( 0, pmMsg.length - 2 );
        pmMsg = pmMsg + " 항목의 관리가 요망됩니다. <br>";
    }

    if( pm10MaxIdx <= 1 && pm25MaxIdx <= 1 ) {
        pmMsg = pmMsg + "미세먼지 관리가 잘되고 있습니다. 공기청정기를 가동하여 지속적으로 미세먼지를 관리해주세요. <br><br>";
    } else if ( pm10MaxIdx > 1 || pm25MaxIdx > 1 ) {
        pmMsg = pmMsg + "미세먼지 관리가 요망되므로, 공기청정기를 가동하여 미세먼지를 관리하여 주시기 바랍니다.<br><br>";
    }

    //harmfulMsg
    if( co2MaxIdx <= 1 || hchoMaxIdx <= 1 || vocMaxIdx <= 1 ) {
        if ( co2MaxIdx <= 1 ) { 
            harmfulMsg = harmfulMsg + "이산화탄소, ";
        } 
        if ( hchoMaxIdx <= 1 ) {
            harmfulMsg = harmfulMsg + "포름알데히드, ";
        }
        if ( vocMaxIdx <= 1 ) {
            harmfulMsg = harmfulMsg + "휘발성유기화합물, ";
        }
        harmfulMsg = harmfulMsg.substring( 0, harmfulMsg.length - 2 );
        harmfulMsg = harmfulMsg + " 항목은 잘 관리되고 있습니다. <br>";

    } 

    if( co2MaxIdx >= 3 || hchoMaxIdx >= 3 || vocMaxIdx >= 3 ) {
        if ( co2MaxIdx >= 3 ) { 
            harmfulMsg = harmfulMsg + "이산화탄소, ";
        } 
        if ( hchoMaxIdx >= 3 ) {
            harmfulMsg = harmfulMsg + "포름알데히드, ";
        }
        if ( vocMaxIdx >= 3 ) {
            harmfulMsg = harmfulMsg + "휘발성유기화합물, ";
        }
        harmfulMsg = harmfulMsg.substring( 0, harmfulMsg.length - 2 );
        harmfulMsg = harmfulMsg + " 항목의 관리가 요망됩니다. <br>";
    }   

    if( co2MaxIdx <= 1 && hchoMaxIdx <= 1 && vocMaxIdx <= 1 ) {
        harmfulMsg = harmfulMsg + "유해물질 관리가 잘되고 있습니다. 공기 환기를 통하여 유해물질이 없도록 관리해주세요.<br><br>";
    } else if ( co2MaxIdx > 1 || hchoMaxIdx > 1 || vocMaxIdx > 1 ) {
        harmfulMsg = harmfulMsg + "공기 중 유해물질 관리가 요망되므로, 적절한 환기가 요구됩니다. 단, 환기에 의한 미세먼지 유입이 진행될 수 있으니 이점 주의하시기 바랍니다.<br><br>";
    }

    //airMsg
    if( temperatureMaxIdx <= 1 || humidityMaxIdx <= 1 ) {
        if ( temperatureMaxIdx <= 1 ) { 
            airMsg = airMsg + "온도, ";
        } 
        if ( humidityMaxIdx <= 1 ) {
            airMsg = airMsg + "습도, ";
        }
        airMsg = airMsg.substring( 0, airMsg.length - 2 );
        airMsg = airMsg + " 항목은 잘 관리되고 있습니다. <br>";
    }    

    if( temperatureMaxIdx >= 3 || humidityMaxIdx >= 3 ) {
        if ( temperatureMaxIdx >= 3 ) {
            airMsg = airMsg + "온도, ";
        }
        if ( humidityMaxIdx >= 3 ) {
            airMsg = airMsg + "습도, ";
        }
        airMsg = airMsg.substring( 0, airMsg.length - 2 );
        airMsg = airMsg + " 항목의 관리가 요망됩니다.<br>";
    }

    if( temperatureMaxIdx <= 1 && humidityMaxIdx <= 1 ) {
        airMsg = airMsg + "온도/습도 관리가 잘되고 있습니다. 에어컨 등을 이용하여 지속적으로 관리해주세요.<br>";
    } else if ( temperatureMaxIdx > 1 || humidityMaxIdx > 1 ) {
        airMsg = airMsg + "온도/습도에 대한 관리가 요망되므로, 에어컨 등을 이용한 관리를 하여주시기 바랍니다.<br>";
    }

    document.getElementById("list3Word1").innerHTML = pmMsg;
    document.getElementById("list3Word2").innerHTML = harmfulMsg;
    // document.getElementById("list3Word3").innerHTML = airMsg;
    // document.getElementById("list3Word4").innerHTML = pmMsg+harmfulMsg+airMsg;
}

function write4word() {
    var avgVal = [avgPm10, avgPm25, avgCo2, avgHcho, avgVoc, avgTemperature, avgHumidity]
    var maxVal = [maxPm10, maxPm25, maxCo2, maxHcho, maxVoc, maxTemperature, maxHumidity]
    var list4Word1 = "";    
    var list4Word2 = "";  
    var list4Word3 = "";
    var list4Word4 = "";
    var i=0;



    list4RecomendedVal.forEach( function( item ) {
        if ( item < avgVal[i] ) {
            var percent = Math.round( avgVal[i] / item * 100 - 100, 2 );
            list4Word1 = list4Word1 + labelName[i] + ", ";
            list4Word2 = list4Word2 + labelName[i] + " - 항목은 측정결과 평균수치가 " + avgVal[i] + "으로 권장수치 대비 " + percent + "%이상 초과하는 것으로 조사되었습니다. <br>"
        }

        if ( item < maxVal[i] ) {
            var percent = Math.round( maxVal[i] / item * 100 - 100, 2 );
            list4Word3 = list4Word3 + labelName[i] + ", ";
            list4Word4 = list4Word4 + labelName[i] + " - 항목은 측정결과 최대수치가 " + maxVal[i] + "으로 권장수치 대비 " + percent + "%이상 초과하는 것으로 조사되었습니다. <br>"
        }
        i++;
    });

    if ( list4Word1 != "" || list4Word3 != "" ) {
        // document.getElementById( "list4Word0" ).innerHTML = "기간 중, 측정된 결과는 다음과 같습니다.<br><br>"
    }

    if ( list4Word1 != "" ) {
        list4Word1 = list4Word1.substring( 0, list4Word1.length - 2 );
        // document.getElementById( "list4Word1" ).innerHTML = list4Word1 + " 항목의 평균수치가 권장수치율을 초과하는 것으로 조사되어 이에 대한 집중적인 관리가 요망됩니다.<br>";
        // document.getElementById( "list4Word2" ).innerHTML = list4Word2 ; 
    }
    if ( list4Word3 != "" ) {
        list4Word3 = list4Word3.substring( 0, list4Word3.length - 2 );
        // document.getElementById( "list4Word3" ).innerHTML = list4Word3 + " 항목의 최대수치가 권장수치율을 초과하는 것으로 조사되어 이에 대한 집중적인 관리가 요망됩니다.<br>";
        // document.getElementById( "list4Word4" ).innerHTML = list4Word4;
    }
}

function write5Word() {
    var totalAlaramPerDayVal = alaramPerDayValPm10 + alaramPerDayValPm25 +  alaramPerDayValCo2 + alaramPerDayValHcho + alaramPerDayValHcho + alaramPerDayValTemperature + alaramPerDayValHumidity;
    var totalAlaramCnt = alaramCntPm10.length + alaramCntPm25.length + alaramCntCo2.length + alaramCntHcho.length + alaramCntVoc.length + alaramCntTemperature.length +alaramCntHumidity.length;

    // document.getElementById( "list5Word0" ).innerHTML = "　측정 기간 동안 측정항목 7가지에 대하여 권장수치를 초과한 회수는 " + totalAlaramPerDayVal + " 회 이며, 해당 회수동안 초과가 지속된 시간은 " + totalAlaramCnt + "분입니다.";

    // document.getElementById( "list5Word1" ).innerHTML = "º 측정기간 중 미세먼지가 권장수치를 초과한 회수는 " + alaramPerDayValPm10 + "회 이며, 해당 회수동안 초과가 지속된 시간은 " + alaramCntPm10.length + "분입니다."
    // document.getElementById( "list5Word2" ).innerHTML = "º 측정기간 중 초미세먼지가 권장수치를 초과한 회수는 " + alaramPerDayValPm25 + "회 이며, 해당 회수동안 초과가 지속된 시간은 " + alaramCntPm25.length + "분입니다."
    // document.getElementById( "list5Word3" ).innerHTML = "º 측정기간 중 이산화탄소가 권장수치를 초과한 회수는 " + alaramPerDayValCo2 + "회 이며, 해당 회수동안 초과가 지속된 시간은 " + alaramCntCo2.length + "분입니다."
    // document.getElementById( "list5Word4" ).innerHTML = "º 측정기간 중 휘발성유기화합물이 권장수치를 초과한 회수는 " + alaramPerDayValHcho + "회 이며, 해당 회수동안 초과가 지속된 시간은 " + alaramCntHcho.length + "분입니다."
    // document.getElementById( "list5Word5" ).innerHTML = "º 측정기간 중 포름알데히드가 권장수치를 초과한 회수는 " + alaramPerDayValVoc + "회 이며, 해당 회수동안 초과가 지속된 시간은 " + alaramCntVoc.length + "분입니다."
    // document.getElementById( "list5Word6" ).innerHTML = "º 측정기간 중 온도가 권장수치를 초과한 회수는 " + alaramPerDayValTemperature + "회 이며, 해당 회수동안 초과가 지속된 시간은 " + alaramCntTemperature.length + "분입니다."
    // document.getElementById( "list5Word7" ).innerHTML = "º 측정기간 중 습도가 권장수치를 초과한 회수는 " + alaramPerDayValHumidity + "회 이며, 해당 회수동안 초과가 지속된 시간은 " + alaramCntHumidity.length + "분입니다."

}

function write6Word() {
    
    var weekDayPm10Arr;
    var weekDayPm25Arr;
    var weekDayCo2Arr;
    var weekDayHchoArr;
    var weekDayVocArr;
    var weekDayTemperatureArr;
    var weekDayHumidityArr;
    var weekendPm10Arr; 
    var weekendPm25Arr; 
    var weekendCo2Arr; 
    var weekendHchoArr; 
    var weekendVocArr; 
    var weekendTemperatureArr; 
    var weekendHumidityArr; 


    if ( weekDayDataPm10 != 0 ) {
        weekDayPm10Arr = word6MsgCompose( weekDayDataPm10 ); 
        weekDayPm25Arr = word6MsgCompose( weekDayDataPm25 ); 
        weekDayCo2Arr = word6MsgCompose( weekDayDataCo2 ); 
        weekDayHchoArr = word6MsgCompose( weekDayDataHcho ); 
        weekDayVocArr = word6MsgCompose( weekDayDataVoc ); 
        weekDayTemperatureArr = word6MsgCompose( weekDayDataTemperature ); 
        weekDayHumidityArr = word6MsgCompose( weekDayDataHumidity ); 

        document.getElementById( "list6Word3" ).innerHTML = word6Print( weekDayPm10Arr, "평일" );
        document.getElementById( "list6Word5" ).innerHTML = word6Print( weekDayPm25Arr, "평일" );
        document.getElementById( "list6Word7" ).innerHTML = word6Print( weekDayCo2Arr, "평일" );
        document.getElementById( "list6Word9" ).innerHTML = word6Print( weekDayHchoArr, "평일" );
        document.getElementById( "list6Word11" ).innerHTML = word6Print( weekDayVocArr, "평일" );
        document.getElementById( "list6Word13" ).innerHTML = word6Print( weekDayTemperatureArr, "평일" );
        document.getElementById( "list6Word15" ).innerHTML = word6Print( weekDayHumidityArr, "평일" );

    }     

    if ( weekendDataPm10 != 0 ) {
        weekendPm10Arr = word6MsgCompose( weekendDataPm10 );
        weekendPm25Arr = word6MsgCompose( weekendDataPm25 );
        weekendCo2Arr = word6MsgCompose( weekendDataCo2 );
        weekendHchoArr = word6MsgCompose( weekendDataHcho );
        weekendVocArr = word6MsgCompose( weekendDataVoc );
        weekendTemperatureArr = word6MsgCompose( weekendDataTemperature );
        weekendHumidityArr = word6MsgCompose( weekendDataHumidity );

        document.getElementById( "list6Word4" ).innerHTML = word6Print( weekendPm10Arr, "주말" );
        document.getElementById( "list6Word6" ).innerHTML = word6Print( weekendPm25Arr, "주말" );
        document.getElementById( "list6Word8" ).innerHTML = word6Print( weekendCo2Arr, "주말" );
        document.getElementById( "list6Word10" ).innerHTML = word6Print( weekendHchoArr, "주말" );
        document.getElementById( "list6Word12" ).innerHTML = word6Print( weekendVocArr, "주말" );
        document.getElementById( "list6Word14" ).innerHTML = word6Print( weekendTemperatureArr, "주말" );
        document.getElementById( "list6Word16" ).innerHTML = word6Print( weekendHumidityArr, "주말" );
    }

    if ( weekDayDataPm10 != 0 && weekendDataPm10 != 0 ) {

        var pm10TotalMsg;
        if ( weekDayPm10Arr.length >= 1 && weekendPm10Arr.length >= 1 ) {
            pm10TotalMsg = "평일대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekDayPm10Arr.length + "회이며, 주말 상태가 나쁨으로 측정된 시간대는 총 " + weekendPm10Arr.length + "회로서 입자성물질인 미세먼지에 대한 지속적인 관리가 필요한 것으로 측정되었습니다.";
        } else if ( weekDayPm10Arr.length == 0 && weekendPm10Arr.length == 0 ) {
            pm10TotalMsg = "해당 측정장소의 미세먼지 관리는 평일과 주말 모두 잘 관리되고 있는 것으로 분석되었습니다.";
        } else if ( weekDayPm10Arr.length >= 1 ) {
            pm10TotalMsg = "평일대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekDayPm10Arr.length + "회이며, 주말에는 관리가 원활했던 것으로 분석되었습니다."
        } else if ( weekendPm10Arr.length >= 1 ) {
            pm10TotalMsg = "주말대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekendPm10Arr.length + "회이며, 평일에는 관리가 원활했던 것으로 분석되었습니다."
        }
        document.getElementById( "list6Word3-4-ret" ).innerHTML = pm10TotalMsg;

        var pm25TotalMsg;
        if ( weekDayPm25Arr.length >= 1 && weekendPm25Arr.length >= 1 ) {
            pm25TotalMsg = "평일대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekDayPm25Arr.length + "회이며, 주말 상태가 나쁨으로 측정된 시간대는 총 " + weekendPm25Arr.length + "회로서 입자성물질인 초미세먼지에 대한 지속적인 관리가 필요한 것으로 측정되었습니다.";
        } else if ( weekDayPm25Arr.length == 0 && weekendPm25Arr.length == 0 ) {
            pm25TotalMsg = "해당 측정장소의 초미세먼지 관리는 평일과 주말 모두 잘 관리되고 있는 것으로 분석되었습니다.";
        } else if ( weekDayPm25Arr.length >= 1 ) {
            pm25TotalMsg = "평일대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekDayPm25Arr.length + "회이며, 주말에는 관리가 원활했던 것으로 분석되었습니다."
        } else if ( weekendPm25Arr.length >= 1 ) {
            pm25TotalMsg = "주말대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekendPm25Arr.length + "회이며, 평일에는 관리가 원활했던 것으로 분석되었습니다."
        }
        document.getElementById( "list6Word5-6-ret" ).innerHTML = pm25TotalMsg;

        var co2TotalMsg;
        if ( weekDayCo2Arr.length >= 1 && weekendCo2Arr.length >= 1 ) {
            co2TotalMsg = "평일대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekDayCo2Arr.length + "회이며, 주말 상태가 나쁨으로 측정된 시간대는 총 " + weekendCo2Arr.length + "회로서 유해물질인 이산화탄소에 대한 지속적인 관리가 필요한 것으로 측정되었습니다.";
        } else if ( weekDayCo2Arr.length == 0 && weekendCo2Arr.length == 0 ) {
            co2TotalMsg = "해당 측정장소의 이산화탄소 관리는 평일과 주말 모두 잘 관리되고 있는 것으로 분석되었습니다.";
        } else if ( weekDayCo2Arr.length >= 1 ) {
            co2TotalMsg = "평일대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekDayCo2Arr.length + "회이며, 주말에는 관리가 원활했던 것으로 분석되었습니다."
        } else if ( weekendCo2Arr.length >= 1 ) {
            co2TotalMsg = "주말대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekendCo2Arr.length + "회이며, 평일에는 관리가 원활했던 것으로 분석되었습니다."
        }
        document.getElementById( "list6Word7-8-ret" ).innerHTML = co2TotalMsg;

        var hchoTotalMsg;
        if ( weekDayHchoArr.length >= 1 && weekendHchoArr.length >= 1 ) {
            hchoTotalMsg = "평일대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekDayHchoArr.length + "회이며, 주말 상태가 나쁨으로 측정된 시간대는 총 " + weekendHchoArr.length + "회로서 유해물질인 포름알데히드에 대한 지속적인 관리가 필요한 것으로 측정되었습니다.";
        } else if ( weekDayHchoArr.length == 0 && weekendHchoArr.length == 0 ) {
            hchoTotalMsg = "해당 측정장소의 포름알데히드 관리는 평일과 주말 모두 잘 관리되고 있는 것으로 분석되었습니다.";
        } else if ( weekDayHchoArr.length >= 1 ) {
            hchoTotalMsg = "평일대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekDayHchoArr.length + "회이며, 주말에는 관리가 원활했던 것으로 분석되었습니다."
        } else if ( weekendHchoArr.length >= 1 ) {
            hchoTotalMsg = "주말대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekendHchoArr.length + "회이며, 평일에는 관리가 원활했던 것으로 분석되었습니다."
        }
        document.getElementById( "list6Word9-10-ret" ).innerHTML = hchoTotalMsg;

        var vocTotalMsg;
        if ( weekDayVocArr.length >= 1 && weekendVocArr.length >= 1 ) {
            vocTotalMsg = "평일대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekDayVocArr.length + "회이며, 주말 상태가 나쁨으로 측정된 시간대는 총 " + weekendVocArr.length + "회로서 유해물질인 휘발성유기화합물에 대한 지속적인 관리가 필요한 것으로 측정되었습니다.";
        } else if ( weekDayVocArr.length == 0 && weekendVocArr.length == 0 ) {
            vocTotalMsg = "해당 측정장소의 휘발성유기화합물 관리는 평일과 주말 모두 잘 관리되고 있는 것으로 분석되었습니다.";
        } else if ( weekDayVocArr.length >= 1 ) {
            vocTotalMsg = "평일대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekDayVocArr.length + "회이며, 주말에는 관리가 원활했던 것으로 분석되었습니다."
        } else if ( weekendVocArr.length >= 1 ) {
            vocTotalMsg = "주말대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekendVocArr.length + "회이며, 평일에는 관리가 원활했던 것으로 분석되었습니다."
        }
        document.getElementById( "list6Word11-12-ret" ).innerHTML = vocTotalMsg;

        var temperatureTotalMsg;
        if ( weekDayTemperatureArr.length >= 1 && weekendTemperatureArr.length >= 1 ) {
            temperatureTotalMsg = "평일대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekDayTemperatureArr.length + "회이며, 주말 상태가 나쁨으로 측정된 시간대는 총 " + weekendTemperatureArr.length + "회로서 컨디션에 큰 영향을 미치는 온도에 대한 지속적인 관리가 필요한 것으로 측정되었습니다.";
        } else if ( weekDayTemperatureArr.length == 0 && weekendTemperatureArr.length == 0 ) {
            temperatureTotalMsg = "해당 측정장소의 온도 관리는 평일과 주말 모두 잘 관리되고 있는 것으로 분석되었습니다.";
        } else if ( weekDayTemperatureArr.length >= 1 ) {
            temperatureTotalMsg = "평일대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekDayTemperatureArr.length + "회이며, 주말에는 관리가 원활했던 것으로 분석되었습니다."
        } else if ( weekendTemperatureArr.length >= 1 ) {
            temperatureTotalMsg = "주말대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekendTemperatureArr.length + "회이며, 평일에는 관리가 원활했던 것으로 분석되었습니다."
        }
        document.getElementById( "list6Word13-14-ret" ).innerHTML = temperatureTotalMsg;

        var humidityTotalMsg;
        if ( weekDayHumidityArr.length >= 1 && weekendHumidityArr.length >= 1 ) {
            humidityTotalMsg = "평일대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekDayHumidityArr.length + "회이며, 주말 상태가 나쁨으로 측정된 시간대는 총 " + weekendHumidityArr.length + "회로서 컨디션에 큰 영향을 미치는 온도에 대한 지속적인 관리가 필요한 것으로 측정되었습니다.";
        } else if ( weekDayHumidityArr.length == 0 && weekendHumidityArr.length == 0 ) {
            humidityTotalMsg = "해당 측정장소의 온도 관리는 평일과 주말 모두 잘 관리되고 있는 것으로 분석되었습니다.";
        } else if ( weekDayHumidityArr.length >= 1 ) {
            humidityTotalMsg = "평일대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekDayHumidityArr.length + "회이며, 주말에는 관리가 원활했던 것으로 분석되었습니다."
        } else if ( weekendHumidityArr.length >= 1 ) {
            humidityTotalMsg = "주말대의 해당 항목 상태가 나쁨으로 측정된 시간대는 총 " + weekendHumidityArr.length + "회이며, 평일에는 관리가 원활했던 것으로 분석되었습니다."
        }
        document.getElementById( "list6Word15-16-ret" ).innerHTML = humidityTotalMsg;
    }
}

function write8Word() {
    
    var granularMsg = new StringBuilder();

    granularMsg.append( "본 항목은 입자상 물질에 대한 내용으로 미세먼지(PM10)와 초미세먼지(PM2.5)에 대한 내용으로 공기청정기 사용에 활용하시기 바랍니다.<br><br>" );
    granularMsg.append( "먼저 미세먼지(PM10)에 대한 상태를 분석해보면 <br><br> " );
    
    if ( avgPm10 <= 20 && maxPm10 <= 50 ) {
        granularMsg.append( "미세먼지 농도의 평균치는 쾌적한 상태였으며, 최대수치 역시 쾌적한 것으로 분석되었습니다. <br><br>" );
    } else if ( avgPm10 <= 20 && maxPm10 <= 99 ) {
        granularMsg.append( "미세먼지 농도의 평균치는 쾌적한 상태였으며, 최대수치 역시 기준치 내인 것으로 분석되었으나 일부분 관리가 필요한것으로 분석되었습니다. <br><br>" );
    } else if ( (avgPm10 <= 50 && maxPm10 <= 50) || (avgPm10 <= 50 && maxPm10 <= 99) ) {
        granularMsg.append( "미세먼지 농도의 평균치와 최대수치 모두 권장수치에 미달하였으나 일부 관리가 필요한 것으로 분석되었습니다. <br><br>" );
    } else if ( avgPm10 <= 100 && maxPm10 <= 99 ) {
        granularMsg.append( "미세먼지 농도의 평균치와 최대수치 모두 권장 한계 수치에 근접하여 상당히 높은 수준의 오염으로 관리가 필요할 것으로 분석되었습니다. <br><br>" );
    } else if ( avgPm10 <= 20 && maxPm10 >= 120 ) {
        granularMsg.append( "미세먼지 농도의 평균치는 쾌적한 상태였으나, 최대수치 부분에서 일정 시간대에는 관리 필요성이 매우 높은 것으로 분석되었습니다. <br><br>" );
    } else if ( avgPm10 <= 50 && maxPm10 >= 120 ) {
        granularMsg.append( "미세먼지 농도의 평균치는 일부 관리가 필요하였으나, 최대수치 부분에서 일정 시간대에는 관리 필요성이 매우 높은 것으로 분석되었습니다. <br><br>" );
    } else if ( avgPm10 <= 100 && maxPm10 >= 120 ) {
        granularMsg.append( "미세먼지 농도의 평균치는 권장 한계 수치에 근접하여 상당히 높은 수준의 오염이 발생한 것으로 분석되었으며, 특히 일정 시간대에는 관리 필요성이 매우 높은 것으로 분석되었습니다. <br><br>" );
    } else if ( avgPm10 >= 101 && maxPm10 <= 120 ) {
        granularMsg.append( "미세먼지 농도의 평균치와 최대수치 모두 권장 한계 수치를 초과하여 상당히 높은 수준의 오염으로 관리가 필요할 것으로 분석되었습니다. <br><br>" );
    } else if ( avgPm10 >= 101 && maxPm10 > 120 ) {
        granularMsg.append( "미세먼지 농도의 평균치는 권장 한계 수치를 초과하여 상당히 높은 수준의 오염이 발생한 것으로 분석되었으며, 특히 일정 시간대에는 관리 필요성이 매우 높은 것으로 분석되었습니다. <br><br>" );
    }

    if ( alaramPerDayValPm10 > 3 && alaramCntPm10.length > 250 ) {
        granularMsg.append( "귀하의 실내 미세먼지 농도의 기준치 이상 노출은 " + alaramPerDayValPm10 + "회 " + alaramCntPm10.length + "분으로서 일반적인 기준에 비하여 매우 오염 빈도와 노출이많았던 것으로 집계되었습니다. <br><br>" );
    } else if ( alaramPerDayValPm10 > 3 && alaramCntPm10.length < 250 ) {
        granularMsg.append( "귀하의 실내 미세먼지 농도의 기준치 이상 노출은 " + alaramPerDayValPm10 + "회 " + alaramCntPm10.length + "분으로서 총 오염시간은 길지 않았으나 오염 노출 빈도는상대적으로 높았던 것으로 집계되었습니다. <br><br>" );
    } else if ( alaramPerDayValPm10 < 3 && alaramCntPm10.length > 250 ) {
        granularMsg.append( "귀하의 실내 미세먼지 농도의 기준치 이상 노출은 " + alaramPerDayValPm10 + "회 " + alaramCntPm10.length + "분으로서 오염 빈도는 높지 않았으나 총 오염시간은 상대적으로 길게 노출되었던 것으로 집계되었습니다. <br><br>" );
    } else if ( alaramPerDayValPm10 < 3 && alaramCntPm10.length < 250 ) {
        granularMsg.append( "귀하의 실내 미세먼지 농도의 기준치 이상 노출은 " + alaramPerDayValPm10 + "회 " + alaramCntPm10.length + "분으로서 일반적인 기준 대비 비교적 쾌적하였던 것으로 집계되었습니다 <br><br>" );
    }

    granularMsg.append( "먼저 초미세먼지(PM2.5)에 대한 상태를 분석해보면 <br><br>" );

    if ( avgPm25 <= 20 && maxPm25 <= 50 ) {
        granularMsg.append( "초미세먼지 농도의 평균치는 쾌적한 상태였으며, 최대수치 역시 쾌적한 것으로 분석되었습니다. <br><br>" );
    } else if ( avgPm25 <= 20 && maxPm25 <= 99 ) {
        granularMsg.append( "초미세먼지 농도의 평균치는 쾌적한 상태였으며, 최대수치 역시 기준치 내인 것으로 분석되었으나 일부분 관리가 필요한것으로 분석되었습니다. <br><br>" );
    } else if ( (avgPm25 <= 50 && maxPm25 <= 50) || (avgPm25 <= 50 && maxPm25 <= 99) ) {
        granularMsg.append( "초미세먼지 농도의 평균치와 최대수치 모두 권장수치에 미달하였으나 일부 관리가 필요한 것으로 분석되었습니다. <br><br>" );
    } else if ( avgPm25 <= 100 && maxPm25 <= 99 ) {
        granularMsg.append( "초미세먼지 농도의 평균치와 최대수치 모두 권장 한계 수치에 근접하여 상당히 높은 수준의 오염으로 관리가 필요할 것으로 분석되었습니다. <br><br>" );
    } else if ( avgPm25 <= 20 && maxPm25 >= 120 ) {
        granularMsg.append( "초미세먼지 농도의 평균치는 쾌적한 상태였으나, 최대수치 부분에서 일정 시간대에는 관리 필요성이 매우 높은 것으로 분석되었습니다. <br><br>" );
    } else if ( avgPm25 <= 50 && maxPm25 >= 120 ) {
        granularMsg.append( "초미세먼지 농도의 평균치는 일부 관리가 필요하였으나, 최대수치 부분에서 일정 시간대에는 관리 필요성이 매우 높은 것으로 분석되었습니다. <br><br>" );
    } else if ( avgPm25 <= 100 && maxPm25 >= 120 ) {
        granularMsg.append( "초미세먼지 농도의 평균치는 권장 한계 수치에 근접하여 상당히 높은 수준의 오염이 발생한 것으로 분석되었으며, 특히 일정 시간대에는 관리 필요성이 매우 높은 것으로 분석되었습니다. <br><br>" );
    } else if ( avgPm25 >= 101 && maxPm25 <= 120 ) {
        granularMsg.append( "초미세먼지 농도의 평균치와 최대수치 모두 권장 한계 수치를 초과하여 상당히 높은 수준의 오염으로 관리가 필요할 것으로 분석되었습니다. <br><br>" );
    } else if ( avgPm25 >= 101 && maxPm25 > 120 ) {
        granularMsg.append( "초미세먼지 농도의 평균치는 권장 한계 수치를 초과하여 상당히 높은 수준의 오염이 발생한 것으로 분석되었으며, 특히 일정 시간대에는 관리 필요성이 매우 높은 것으로 분석되었습니다. <br><br>" );
    }

    if ( alaramPerDayValPm25 > 3 && alaramCntPm25.length > 250 ) {
        granularMsg.append( "귀하의 실내 초미세먼지 농도의 기준치 이상 노출은 " + alaramPerDayValPm25 + "회 " + alaramCntPm25.length + "분으로서 일반적인 기준에 비하여 매우 오염 빈도와 노출이많았던 것으로 집계되었습니다. <br><br>" );
    } else if ( alaramPerDayValPm25 > 3 && alaramCntPm25.length < 250 ) {
        granularMsg.append( "귀하의 실내 초미세먼지 농도의 기준치 이상 노출은 " + alaramPerDayValPm25 + "회 " + alaramCntPm25.length + "분으로서 총 오염시간은 길지 않았으나 오염 노출 빈도는상대적으로 높았던 것으로 집계되었습니다. <br><br>" );
    } else if ( alaramPerDayValPm25 < 3 && alaramCntPm25.length > 250 ) {
        granularMsg.append( "귀하의 실내 초미세먼지 농도의 기준치 이상 노출은 " + alaramPerDayValPm25 + "회 " + alaramCntPm25.length + "분으로서 오염 빈도는 높지 않았으나 총 오염시간은 상대적으로 길게 노출되었던 것으로 집계되었습니다. <br><br>" );
    } else if ( alaramPerDayValPm25 < 3 && alaramCntPm25.length < 250 ) {
        granularMsg.append( "귀하의 실내 초미세먼지 농도의 기준치 이상 노출은 " + alaramPerDayValPm25 + "회 " + alaramCntPm25.length + "분으로서 일반적인 기준 대비 비교적 쾌적하였던 것으로 집계되었습니다 <br><br>" );
    }

    granularMsg.append( "미세먼지와 초미세먼지는 중금속 등이 포함되어 상기도 및 하기도에 치명적일 수 있으며, 눈의 피로가 발생하는 등 건강에 많은 영향을 끼치므로 항상 주의하시어 관리하시기 바랍니다.통상적인 미세먼지 및 초미세먼지 증가 수치의 원인은 외부 공기 유입, 청소에 의한 비산먼지 발생, 공기청정기 또는 공조시설의 필터 및 관리부족에 의한 경우가 많으므로, 외부 환기 시 외부 미세먼지 농도를 한번 더 확인하시기 바라며, 공기청정기 및 공조기 등의 관리에 항상 신경써주시기 바랍니다.<br><br>" );
    
    var gasMsg = new StringBuilder();

    var avgGas = (avgCo2 + avgHcho + avgVoc) / 3;
    var maxGas = (maxCo2 + maxHcho + maxVoc) / 3;
    var alaramPerDayGas = alaramPerDayValCo2 + alaramPerDayValVoc + alaramPerDayValHcho;
    var alaramCntGas = alaramCntCo2.length + alaramCntVoc.length + alaramCntHcho.length;

    gasMsg.append( "본 항목은 가스상 물질에 대한 내용으로 이산화탄소(CO2), 휘발성유기화합물(VOCs), 포름알데히드(HCHO) 등 우리 몸에유해한 물질에 대한 항목으로 공기 환기하는데 활용하시기 바랍니다.<br><br>" );

    if ( avgGas <= 20 && maxGas <= 50 ) {
        gasMsg.append( "대기중 유해물질 농도의 평균치는 쾌적한 상태였으며, 최대수치 역시 쾌적하게 유지된 것으로 분석되었습니다. <br><br>" );
    } else if ( avgGas <= 20 && maxGas <= 99 ) {
        gasMsg.append( "대기중 유해물질 농도의 평균치는 쾌적한 상태였으며, 최대수치 역시 기준치 내인 것으로 분석되었으나 일부분 환기 등공기 관리가 필요한 것으로 분석되었습니다. <br><br>" );
    } else if ( (avgGas <= 50 && maxGas <= 50) || (avgGas <= 50 && maxGas <= 99) ) {
        gasMsg.append( "대기중 유해물질 농도의 평균치와 최대수치 모두 권장수치에 미달하였으나 일부 공기 관리가 필요한 것으로 분석되었습니다. <br><br>" );
    } else if ( avgGas <= 100 && maxGas <= 99 ) {
        gasMsg.append( "대기중 유해물질 농도의 평균치와 최대수치 모두 권장 한계 수치에 근접하여 상당히 높은 수준의 공기 오염으로 관리가필요할 것으로 분석되었습니다. <br><br>" );
    } else if ( avgGas <= 20 && maxGas >= 120 ) {
        gasMsg.append( "대기중 유해물질 농도의 평균치는 쾌적한 상태였으나, 최대수치 부분에서 일정 시간대에는 환기 등 공기 관리 필요성이매우 높은 것으로 분석되었습니다. <br><br>" );
    } else if ( avgGas <= 50 && maxGas >= 120 ) {
        gasMsg.append( "대기중 유해물질 농도의 평균치는 일부 공기 관리가 필요하였으나, 최대수치 부분에서 일정 시간대에는 공기 관리 필요성이 매우 높은 것으로 분석되었습니다. <br><br>" );
    } else if ( avgGas <= 100 && maxGas >= 120 ) {
        gasMsg.append( "대기중 유해물질 농도의 평균치는 권장 한계 수치에 근접하여 상당히 높은 수준의 공기 오염이 발생한 것으로 분석되었으며, 특히 일정 시간대에는 관리 필요성이 매우 높은 것으로 분석되었습니다. <br><br>" );
    } else if ( avgGas >= 101 && maxGas <= 99 ) {
        gasMsg.append( "대기중 유해물질 농도의 평균치와 최대수치 모두 권장 한계 수치를 초과하여 상당히 높은 수준의 공기 오염으로 관리가필요할 것으로 분석되었습니다. <br><br>" );
    } else if ( avgGas >= 101 && maxGas > 120 ) {
        gasMsg.append( "대기중 유해물질 농도의 평균치는 권장 한계 수치를 초과하여 상당히 높은 수준의 공기 오염이 발생한 것으로 분석되었으며, 특히 일정 시간대에는 관리 필요성이 매우 높은 것으로 분석되었습니다. <br><br>" );
    }

    if ( alaramPerDayGas > 5 && alaramCntGas > 250 ) {
        gasMsg.append( "귀하의 실내 공기 중 유해물질 농도의 기준치 이상 노출은 " + alaramPerDayGas + "회 " + alaramCntGas + "분으로서 일반적인 기준에 비하여 매우 오염 빈도와 노출이 많았던 것으로 집계되었으며, 이에 따라 자주 환기가 요망됩니다. <br><br>" );
    } else if ( alaramPerDayGas > 5 && alaramCntGas < 250 ) {
        gasMsg.append( "귀하의 실내 공기 중 유해물질 농도의 기준치 이상 노출은 " + alaramPerDayGas + "회 " + alaramCntGas + "분으로서 총 오염시간은 길지 않았으나 오염 노출빈도는 상대적으로 높았던 것으로 집계되어 해당 오염시간 전후로 환기가 필요합니다. <br><br>" );
    } else if ( alaramPerDayGas < 5 && alaramCntGas > 250 ) {
        gasMsg.append( "귀하의 실내 공기 중 유해물질 농도의 기준치 이상 노출은 " + alaramPerDayGas + "회 " + alaramCntGas + "분으로서 오염 빈도는 높지 않았으나 총 오염시간은 상대적으로 길게 노출되었던 것으로 집계되어 전반적인 관리 및 환기가 필요합니다. <br><br>" );
    } else if ( alaramPerDayGas < 5 && alaramCntGas < 250 ) {
        gasMsg.append( "귀하의 실내 공기 중 유해물질 농도의 기준치 이상 노출은 " + alaramPerDayGas + "회 " + alaramCntGas + "분으로서 일반적인 기준 대비 비교적 쾌적하였던것으로 집계되었습니다. <br><br>" );
    }

    gasMsg.append( "가스상물질은 인간의 신체에 치명적인 문제를 불러 일으킬 수 있으므로, 매우 주의하여야 하며, 각각의 가스상 물질이끼치는 문제는 아래의 가스상물질 유형별 원인 및 문제점 항목을 참조하여 주시기 바랍니다.이러한 가스상물질의 농도를 희석시키기 위해서는 주기적인 환기가 필수적입니다. 하지만 최근 실외공기의 미세먼지가문제가 되는 경우가 많으므로, 그 날의 실외 미센먼지 농도를 확인하여 환기 횟수를 조절하시거나, 환기를 시킨 다음에는 공기청정기 등을 사용하여 외부에서 유입된 미세먼지 혹은 초미세먼지를 줄이기 위한 노력을 병행하여 주시기 바랍니다.<br><br>" );

    var airMsg = new StringBuilder();

    alaramPerDayAir = alaramPerDayValTemperature + alaramPerDayValHumidity;
    alaramCntAir = alaramCntTemperature.length + alaramCntHumidity.length;

    airMsg.append( "본 항목은 온도와 습도에 항목으로서 불쾌지수 등 우리 몸이 직접 느끼는 항목에 대한 사항으로 사무실 공간의 쾌적성과 공간 목적에 따라 에어컨,가습기,제습기 등 용품 사용에 활용하시기 바랍니다.<br><br>" );
    
    if ( avgTemperature <= list4RecomendedVal[5] && avgHumidity <= list4RecomendedVal[6] ) {
        airMsg.append( "금주 실내 환경의 온도와 습도는 권장 수치에 비하여 쾌적하게 관리되었습니다. <br><br>" );
    } else if ( avgTemperature <= list4RecomendedVal[5] && avgHumidity >= list4RecomendedVal[6] ) {
        airMsg.append( "금주 실내 환경의 온도는 쾌적하게 관리되었으나 습도 수치가 나쁜 것으로 분석되어 습도에 대한 관리를 하지 않을 경우, 거주자에게 불쾌한 감정이나 건조한 증상 등을 줄 수 있습니다. <br><br>" );
    } else if ( avgTemperature >= list4RecomendedVal[5] && avgHumidity <= list4RecomendedVal[6] ) {
        airMsg.append( "금주 실내 환경의 습도는 쾌적하게 관리되었으나 온도 수치가 나쁜 것으로 분석되어 온도에 대한 관리를 하지 않을 경우, 고온 또는 저온으로 인한 거주자의 건강에 매우 안좋은 영향을 미칠 수 있으므로, 관리가 요망됩니다. <br><br>" );
    } else if ( avgTemperature >= list4RecomendedVal[5] && avgHumidity >= list4RecomendedVal[6] ) {
        airMsg.append( "금주 실내 환경은 온도와 습도 모두 좋지 않은 것으로 분석되었으며, 거주자 건강을 위하여 반드시 이 부분에 대한 세심한 관리를 해주시기 바랍니다. <br><br>" );
    }

    if ( alaramPerDayAir > 5 && alaramCntAir > 250 ) {
        airMsg.append( "귀하의 실내 환경 중 온도와 습도가 기준조건을 상회하여 좋지 않았던 경우는 " + alaramPerDayAir + "회 " + alaramCntAir + "분으로서 거주자가 느끼는 불편함과 문제점이 많았던 것으로 분석되었으며, 이에 따른 세심한 관리가 요망됩니다. <br><br>" );
    } else if ( alaramPerDayAir > 5 && alaramCntAir < 250 ) {
        airMsg.append( "귀하의 실내 환경 중 온도와 습도가 기준조건을 상회하여 좋지 않았던 경우는 " + alaramPerDayAir + "회 " + alaramCntAir + "분으로서 총 초과시간은 길지않았으나 환경적 문제에 거주자가 노출된 빈도는 상대적으로 높았던 것으로 집계되어 지속적인 공기 환경 관리가 필요할 것으로 분석되었습니다. <br><br>" );
    } else if ( alaramPerDayAir < 5 && alaramCntAir > 250 ) {
        airMsg.append( "귀하의 실내 환경 중 온도와 습도가 기준조건을 상회하여 좋지 않았던 경우는 " + alaramPerDayAir + "회 " + alaramCntAir + "분으로서 좋지않은 환경에 노출된 빈도는 높지 않았으나 총 노출시간이 상대적으로 길게 노출되었던 것으로 집계되어 전반적인 공기 환경 관리가 필요할 것으로 분석되었습니다. <br><br>" );
    } else if ( alaramPerDayAir < 5 && alaramCntAir < 250 ) {
        airMsg.append( "귀하의 실내 환경 중 온도와 습도가 기준조건을 상회하여 좋지 않았던 경우는 " + alaramPerDayAir + "회 " + alaramCntAir + "분으로서 거주자의 쾌적도가 양호하였던 것으로 분석되었으며, 이러한 공기 환경 유지를 지속하여 주시기 바랍니다. <br><br>" );
    }

    airMsg.append( "공기 환경을 구성하는 온도와 습도는 거주자가 느끼는 직접적인 환경 요소로서 해당 요소가 좋지 않을 경우, 거주자는불쾌감을 느낄 수 있습니다. 또한 면역력 저하 및 감기 등 질병의 원인이 될 수 있으며, 높은 습도 등은 곰팡이 발생 등비위생적인 환경을 만드는 요소가 될 수 있으므로, 세심한 관리가 필요합니다.해당 온도와 습도의 관리를 위하여 에어컨을 가동하거나, 제습기/가습기, 혹은 별도의 냉.난방 시스템을 이용하여 관리하여 주시기 바랍니다. 특히 온도와 습도는 거주자의 효율성, 집중도 등에 가장 직접적으로 영향을 미칠 수 있으므로, 이점에 주의하여 관리하여 주시기 바랍니다. <br><br>" );

    document.getElementById( "list8Word1" ).innerHTML = granularMsg.toString();
    document.getElementById( "list8Word2" ).innerHTML = gasMsg.toString();
    document.getElementById( "list8Word3" ).innerHTML = airMsg.toString();
}

function buddyChart() {
    new Chart(document.getElementById("buddyChart"), {
        type: 'line',
        data: {
            datasets: []
        },
        options: {
            responsive: false,
            animation: {
                onComplete: function() {
                    printPdf( oper );
                }
            }            
        }
    });
}
// support method
function getScopeVal( item ) {
    return new Promise( function( resolve ) {
        requestAjax( "POST", host + "/indextable/getIndexTableBySensorType?sensorType=" + item, function( err, datums ) {
            resolve( datums );
        });
    });
}

function calcScopVal( scopeVal, map, item, returnVal ) {

    if ( scopeVal.min <= item[map] && scopeVal.max >= item[map] ) {
        return returnVal = returnVal + 1;
    } else {
        return returnVal;
    }
}

function calcAlaramPerDay( data ) {
    var len = data.length;
    var returnVal = 0;
    var tempDay = -1;
    var day;
    for ( var i=0; i<len; i++ ) {
        day = moment( data[i] ).format('DD');
        if ( tempDay != day ) {
            tempDay = day;
            returnVal = returnVal + 1;
        }
    }

    return returnVal;
}

function getDataAsSame( len, data ) {
    var returnVal = [];
    for ( var i=0; i<len; i++ ) {
        returnVal.push( data );
    }

    return returnVal;
}

function getDayByDay100Data( data ) {
    for ( var idx=0; idx<data.length; idx++ ) {
        var tmpTotal = 0;
        for ( var j=0; j<data[idx].length; j++ ) {
            tmpTotal = tmpTotal + data[idx][j];
        }
    
        for ( var j=0; j<data[idx].length; j++ ) {
            data[idx][j] = data[idx][j] / tmpTotal * 100;
        } 
    }
    
    return data;
}

function getStackedBarChartDatas( datas, idx ) {
    var returnVal = [];

    for ( var i=0; i<datas.length; i++ ) {
        returnVal.push( datas[i][idx] );
    }

    return returnVal;
}

function largestIndexInArr( arr ) {
    var returnVal = 0;
    var maxVal = 0;

    for ( var i=0; i<arr.length; i++ ) {
        if ( arr[i] > maxVal ) {
            returnVal = i;
            maxVal = arr[i];
        }
    }

    return returnVal;
}

function largestIndexAndTimeInArr( arr ) {
    var arrCnt = Array(6).fill(0);
    
    for ( var i=0; i<6; i++ ) {
        arrCnt[i] = [];
    }

    for ( var i=0; i<arr.length; i++ ) {
        var tmpIdx = largestIndexInArr( arr[i] );
        arrCnt[tmpIdx].push( i );
    }

    return arrCnt;
}

// function largestArrLengthInArr( arr ) {
//     var tmpMaxVal = 0;
//     var returnVal = 0;

//     for( var i=0; i<arr.length; i++ ) {
//         if ( arr[i].length > tmpMaxVal ) {
//             returnVal = i;
//             tmpMaxVal = arr[i].length;
//         }
//     }

//     return returnVal;
// }

function appendMsg( arr, msg ) {
    arr.forEach( function( data ) {
        msg = msg + data + ' ';
    });

    return msg;
}

function word6MsgCompose( weekData ) {
    var datas = largestIndexAndTimeInArr( weekData );
    
    var tmpMsg = "";
    var retMsg = [];

    var badStat = [];
    badStat = badStat.concat( datas[3], datas[4], datas[5] );
    badStat.sort( function(a, b) {
        return a-b;
    });

    if ( badStat.length >= 1 ) {
        for ( var i=0; i < badStat.length; i++ ) {
         
            if ( (i+1) == badStat.length ) {
                tmpMsg = tmpMsg + badStat[i];
                if ( retMsg == "" ) {
                    retMsg.push( tmpMsg );
                } else {
                    retMsg.push(", " + tmpMsg );
                }
            } else if ( (badStat[i] + 1) == badStat[i+1] ) {
                if ( tmpMsg == "" ) {
                    tmpMsg = badStat[i] + " ~ ";
                }
            } else {
                tmpMsg = tmpMsg + badStat[i];
                if ( retMsg == "" ) {
                    retMsg.push( tmpMsg );
                } else {
                    retMsg.push(", " + tmpMsg );
                }
                tmpMsg = "";
            }
        }
    }

    return retMsg;
}

function word6Print( arr, weekWord ) {
    var msg = "";

    if ( arr.length >= 1 ) {
        arr.forEach( function( item ) {
            msg = msg + item;
        });

        msg = "● " + weekWord + " 기간 중 나쁨 이상으로 분석된 시간대는 " + msg + "대인 것으로 분석되었습니다.<br>";
    } else {
        msg = "● " + weekWord + " 기간 중 관리는 잘 관리된 것으로 분석되었습니다.<br>";
    }
    
    return msg;
}


