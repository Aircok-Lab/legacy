
const urlParams = new URLSearchParams(window.location.search);
const devId = urlParams.get('devId');
const deviceSN = urlParams.get('deviceSN');
const sn = urlParams.get('sn');
const predict_yn = urlParams.get('predict_yn');
const buildingName = urlParams.get('buildingName');
const deviceName = urlParams.get('deviceName');
const date = urlParams.get('date');
const latitude = urlParams.get('latitude');
const longitude = urlParams.get('longitude');
const phraseTotAirQualSentence = ['통합공기질 관리지수가(', ')으로 유지되고 있습니다.'];
const phraseNothingChartData = '표시될 데이터 없음';
const positionID = urlParams.get('positionID');
const outdoorDustData = urlParams.get('outdoorDustData');
const outdoorDustData1 = urlParams.get('outdoorDustData1');
const host = "http://smart.aircok.com:13701";

const weatherHost = "http://api.openweathermap.org";
const serviceKey = "31S4nflH1AiLDJKl%2FGNpLNGtX%2BAjV%2BF0fBINwijd0J4Ae5iKVa93pUgKwanhykObOgR12hzq1fUyQKA7hR5BqA%3D%3D "
const proxyURL = "https://smart.aircok.com/proxy";
const DeviceInfo ="./deviceInfo.js";

const totalIndexKeyValue = {
    1: "좋음",
    2: "보통",
    3: "약간나쁨",
    4: "나쁨",
    5: "매우나쁨",
    6: "최악"
  };
const totalIndexMessage = [
    'none',
    '[GOOD] 공기질 관리가 잘되고 있습니다.',
    '[NORMAL] 공기질 관리가 보통입니다.',
    '[주의요망] 공기질 관리에 신경써주세요.',
    '[주의] 공기질 관리가 필요합니다.',
    '[BAD] 즉시 공기질을 확인하세요.',
    '[DANGER] 공기질이 최악입니다.'
];
const indexlabelName = ["좋음", "보통", "약간나쁨", "나쁨", "매우나쁨", "최악"];
const stationName ="성동구";



var timeline = [];
var valPm10 = [];
var valPm25 = [];
var valCo2 = [];
var valHcho = [];
var valVoc = [];
var valTemperature = [];
var valHumidity = [];
var valNoise = [];
var jsonObj;
var objArr;
var jsonAlaramObj;
var ranCnt = 1;
var whatYouNeed = 'co2';
 
window.onload = function(){
    init();
    initInfo();
    weatherinit();
    generateChartData2();

    var datePickerInput = document.getElementById('chartDatePicker');
    datePickerInput.addEventListener('pickmeup-change', function(e) {
        drawIndexChart( whatYouNeed );
    });
    datePickerInput.addEventListener('change', drawIndexChart( whatYouNeed ) );
}

function genCsv() {
    
    var timeline = [];
    var valPm10 = [];
    var valPm25 = [];
    var valCo2 = [];
    var valHcho = [];
    var valVoc = [];
    var valTemperature = [];
    var valHumidity = [];
    var valNoise = [];


    new Promise( function( resolve ) {
        var datePickerInput = document.getElementById('reportDatePicker');
        var startDate = getNotBeforeToPickmeup( datePickerInput.value ) + " 00:00:00";
        var endDate = getNotAfterToPickmeup( datePickerInput.value ) + " 24:00:00";

        requestAjax( "POST", host + "/report/getChartDataByDate?serialNumber=" + sn + "&startDate=" + startDate + "&endDate=" + endDate, function( err, datums ) {
            resolve( datums );
        });
    }).then( function( result ) {
        jsonObj = JSON.parse( result );
        jsonObj.data.forEach( function( item ) {
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
        });
        
        var sb = new StringBuilder();
        sb.append( 'data:text/csv;charset=utf-8,'  );
        sb.append( "Date, PM10, PM25, CO2, HCHO, VOC, Temperature, Humidity, Noise");
        sb.append( "\n" );
        
        for( var i=0; i<timeline.length; i++ ) {
            sb.append( timeline[i] + "," );
            sb.append( valPm10[i] + "," );
            sb.append( valPm25[i] + "," );
            sb.append( valCo2[i] + "," );
            sb.append( valHcho[i] + "," );
            sb.append( valVoc[i] + "," );
            sb.append( valTemperature[i] + "," );
            sb.append( valHumidity[i] + "," );
            sb.append( valNoise[i] + "\n" );
        }



        var csv =sb.toString();
        
        var encodedUri = encodeURI( csv );
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", sn + ".csv");

        document.body.appendChild(link); // Required for FF
        
       link.click(); 
       // This will download the data file named "my_data.csv".
    });        
}


function init() {
    return new Promise( function( resolve ) { 
        requestAjax( "POST", host + "/RecentData/getRecentDataById?id=" + devId, function( err, datums ) {
            resolve( datums );
        });
    })
    // set 
    //  Total Score, humidity, temperature
    .then( function( result ) {
        var jsonObj = JSON.parse( result );
        setTotalScore( jsonObj )
    })
};

function setTotalScore( jsonObj ) {
    var airScore = jsonObj.data[0].e3Score;
    var airScoreIdx = jsonObj.data[0].e3Index;
    var temIdx = jsonObj.data[0].temperatureIndex;
    var temperature = jsonObj.data[0].temperature;
    var humidity = jsonObj.data[0].humidity;
    var humidityIdx = jsonObj.data[0].humidityIndex;
    var fineDust = jsonObj.data[0].pm25;
    var fineDustIdx = jsonObj.data[0].pm25Index;
    var ultraFineDust = jsonObj.data[0].pm10;
    var ultraFineDustIdx = jsonObj.data[0].pm10Index;
    var hcho = jsonObj.data[0].hcho;
    var hchoIdx = jsonObj.data[0].hchoIndex;
    var voc = jsonObj.data[0].voc;
    var vocIdx = jsonObj.data[0].vocIndex;
    var noise = jsonObj.data[0].noise;
    var noiseIdx = jsonObj.data[0].noiseIndex;
    var co2 = jsonObj.data[0].co2;
    var co2Idx = jsonObj.data[0].co2Index;
    var co = jsonObj.data[0].co;
    var coIdx = jsonObj.data[0].coIndex;
    
    
    var pmMsg = "";
    var harmfulMsg = "";
    var airMsg = "";


    if(voc == '99999' || noise == '99999'){
        airScoreIdx = '1';
    }else{
    //   alert('aa1');
    }

    if (humidityIdx == 1) {
        document.getElementById('ultraFineDustIdxColor').style.backgroundImage = "url('images/db_a03_s01_ic_1.png')";
        document.getElementById('ultraFineDustIdxColor').style.height  = "166px"
        document.getElementById('ultraFineDustIdxColor').style.width  = "132px"
        document.getElementById('ultraFineDustIdxColor').style.left  = "60px"
        document.getElementById('ultraFineDustIdxColor').style.top  = "-17px"
        document.getElementById('ultraFineDustIdxColor').style.display = "block" 
    }
    else if (humidityIdx == 2) {
        document.getElementById('ultraFineDustIdxColor').style.backgroundImage = "url('images/db_a03_s01_ic_2.png')";
        document.getElementById('ultraFineDustIdxColor').style.height  = "166px"
        document.getElementById('ultraFineDustIdxColor').style.width  = "132px"
        document.getElementById('ultraFineDustIdxColor').style.left  = "60px"
        document.getElementById('ultraFineDustIdxColor').style.top  = "-17px"
        document.getElementById('ultraFineDustIdxColor').style.display = "block" 
    }
    else if (humidityIdx == 3){
        document.getElementById('ultraFineDustIdxColor').style.backgroundImage = "url('images/db_a03_s01_ic_3.png')";
        document.getElementById('ultraFineDustIdxColor').style.height  = "166px"
        document.getElementById('ultraFineDustIdxColor').style.width  = "132px"
        document.getElementById('ultraFineDustIdxColor').style.left  = "60px"
        document.getElementById('ultraFineDustIdxColor').style.top  = "-17px"
        document.getElementById('ultraFineDustIdxColor').style.display = "block" 
    }
    else if (humidityIdx == 4){
        document.getElementById('ultraFineDustIdxColor').style.backgroundImage = "url('images/db_a03_s01_ic_4.png')";
        document.getElementById('ultraFineDustIdxColor').style.height  = "166px"
        document.getElementById('ultraFineDustIdxColor').style.width  = "132px"
        document.getElementById('ultraFineDustIdxColor').style.left  = "60px"
        document.getElementById('ultraFineDustIdxColor').style.top  = "-17px"
        document.getElementById('ultraFineDustIdxColor').style.display = "block" 
    }
    else if (humidityIdx == 5) {
        document.getElementById('ultraFineDustIdxColor').style.backgroundImage = "url('images/db_a03_s01_ic_5.png')";
        document.getElementById('ultraFineDustIdxColor').style.height  = "166px"
        document.getElementById('ultraFineDustIdxColor').style.width  = "132px"
        document.getElementById('ultraFineDustIdxColor').style.left  = "60px"
        document.getElementById('ultraFineDustIdxColor').style.top  = "-17px"
        document.getElementById('ultraFineDustIdxColor').style.display = "block" 
    }
    else if (humidityIdx == 6){
        document.getElementById('ultraFineDustIdxColor').style.backgroundImage = "url('images/db_a03_s01_ic_6.png')";
        document.getElementById('ultraFineDustIdxColor').style.height  = "166px"
        document.getElementById('ultraFineDustIdxColor').style.width  = "132px"
        document.getElementById('ultraFineDustIdxColor').style.left  = "60px"
        document.getElementById('ultraFineDustIdxColor').style.top  = "-17px"
        document.getElementById('ultraFineDustIdxColor').style.display = "block" 
    }
    

    if (hchoIdx == 1) {
        document.getElementById('hchoIdxColor').style.backgroundImage = "url('images/db_a04_ic05_1.png')";
        document.getElementById('hchoIdxColor').style.height  = "166px"
        document.getElementById('hchoIdxColor').style.width  = "132px"
        document.getElementById('hchoIdxColor').style.left  = "60px"
        document.getElementById('hchoIdxColor').style.top  = "-17px"
        document.getElementById('hchoIdxColor').style.display = "block" 
    }
    else if (hchoIdx == 2) {
        document.getElementById('hchoIdxColor').style.backgroundImage = "url('images/db_a04_ic05_2.png')";
        document.getElementById('hchoIdxColor').style.height  = "166px"
        document.getElementById('hchoIdxColor').style.width  = "132px"
        document.getElementById('hchoIdxColor').style.left  = "60px"
        document.getElementById('hchoIdxColor').style.top  = "-17px"
        document.getElementById('hchoIdxColor').style.display = "block" 
    }
    else if (hchoIdx == 3){
        document.getElementById('hchoIdxColor').style.backgroundImage = "url('images/db_a04_ic05_3.png')";
        document.getElementById('hchoIdxColor').style.height  = "166px"
        document.getElementById('hchoIdxColor').style.width  = "132px"
        document.getElementById('hchoIdxColor').style.left  = "60px"
        document.getElementById('hchoIdxColor').style.top  = "-17px"
        document.getElementById('hchoIdxColor').style.display = "block" 
    }
    else if (hchoIdx == 4){
        document.getElementById('hchoIdxColor').style.backgroundImage = "url('images/db_a04_ic05_4.png')";
        document.getElementById('hchoIdxColor').style.height  = "166px"
        document.getElementById('hchoIdxColor').style.width  = "132px"
        document.getElementById('hchoIdxColor').style.left  = "60px"
        document.getElementById('hchoIdxColor').style.top  = "-17px"
        document.getElementById('hchoIdxColor').style.display = "block" 
    }
    else if (hchoIdx == 5) {
        document.getElementById('hchoIdxColor').style.backgroundImage = "url('images/db_a04_ic05_5.png')";
        document.getElementById('hchoIdxColor').style.height  = "166px"
        document.getElementById('hchoIdxColor').style.width  = "132px"
        document.getElementById('hchoIdxColor').style.left  = "60px"
        document.getElementById('hchoIdxColor').style.top  = "-17px"
        document.getElementById('hchoIdxColor').style.display = "block" 
    }
    else if (hchoIdx == 6){
        document.getElementById('hchoIdxColor').style.backgroundImage = "url('images/db_a04_ic05_6.png')";
        document.getElementById('hchoIdxColor').style.height  = "166px"
        document.getElementById('hchoIdxColor').style.width  = "132px"
        document.getElementById('hchoIdxColor').style.left  = "60px"
        document.getElementById('hchoIdxColor').style.top  = "-17px"
        document.getElementById('hchoIdxColor').style.display = "block" 
    }


    if (vocIdx == 1) {
        document.getElementById('vocIdxColor').style.backgroundImage = "url('images/db_a04_ic03_1.png')";
        document.getElementById('vocIdxColor').style.height  = "166px"
        document.getElementById('vocIdxColor').style.width  = "132px"
        document.getElementById('vocIdxColor').style.left  = "60px"
        document.getElementById('vocIdxColor').style.top  = "-17px"
        document.getElementById('vocIdxColor').style.display = "block" 
    }
    else if (vocIdx == 2) {
        document.getElementById('vocIdxColor').style.backgroundImage = "url('images/db_a04_ic03_2.png')";
        document.getElementById('vocIdxColor').style.height  = "166px"
        document.getElementById('vocIdxColor').style.width  = "132px"
        document.getElementById('vocIdxColor').style.left  = "60px"
        document.getElementById('vocIdxColor').style.top  = "-17px"
        document.getElementById('vocIdxColor').style.display = "block" 
    }
    else if (vocIdx == 3){
        document.getElementById('vocIdxColor').style.backgroundImage = "url('images/db_a04_ic03_3.png')";
        document.getElementById('vocIdxColor').style.height  = "166px"
        document.getElementById('vocIdxColor').style.width  = "132px"
        document.getElementById('vocIdxColor').style.left  = "60px"
        document.getElementById('vocIdxColor').style.top  = "-17px"
        document.getElementById('vocIdxColor').style.display = "block" 
    }
    else if (vocIdx == 4){
        document.getElementById('vocIdxColor').style.backgroundImage = "url('images/db_a04_ic03_4.png')";
        document.getElementById('vocIdxColor').style.height  = "166px"
        document.getElementById('vocIdxColor').style.width  = "132px"
        document.getElementById('vocIdxColor').style.left  = "60px"
        document.getElementById('vocIdxColor').style.top  = "-17px"
        document.getElementById('vocIdxColor').style.display = "block" 
    }
    else if (vocIdx == 5) {
        document.getElementById('vocIdxColor').style.backgroundImage = "url('images/db_a04_ic03_5.png')";
        document.getElementById('vocIdxColor').style.height  = "166px"
        document.getElementById('vocIdxColor').style.width  = "132px"
        document.getElementById('vocIdxColor').style.left  = "60px"
        document.getElementById('vocIdxColor').style.top  = "-17px"
        document.getElementById('vocIdxColor').style.display = "block" 
    }
    else if (vocIdx == 6){
        document.getElementById('vocIdxColor').style.backgroundImage = "url('images/db_a04_ic03_6.png')";
        document.getElementById('vocIdxColor').style.height  = "166px"
        document.getElementById('vocIdxColor').style.width  = "132px"
        document.getElementById('vocIdxColor').style.left  = "60px"
        document.getElementById('vocIdxColor').style.top  = "-17px"
        document.getElementById('vocIdxColor').style.display = "block"  
    }
   

    
    if (noiseIdx == 1) {
        document.getElementById('noiseIdxColor').style.backgroundImage = "url('images/db_a04_ic06_1.png')";
        document.getElementById('noiseIdxColor').style.height  = "166px"
        document.getElementById('noiseIdxColor').style.width  = "132px"
        document.getElementById('noiseIdxColor').style.left  = "60px"
        document.getElementById('noiseIdxColor').style.top  = "-17px"
        document.getElementById('noiseIdxColor').style.display = "block"
    }
    else if (noiseIdx == 2) {
        document.getElementById('noiseIdxColor').style.backgroundImage = "url('images/db_a04_ic06_2.png')";
        document.getElementById('noiseIdxColor').style.height  = "166px"
        document.getElementById('noiseIdxColor').style.width  = "132px"
        document.getElementById('noiseIdxColor').style.left  = "60px"
        document.getElementById('noiseIdxColor').style.top  = "-17px"
        document.getElementById('noiseIdxColor').style.display = "block"
    }
    else if (noiseIdx == 3){
        document.getElementById('noiseIdxColor').style.backgroundImage = "url('images/db_a04_ic06_3.png')";
        document.getElementById('noiseIdxColor').style.height  = "166px"
        document.getElementById('noiseIdxColor').style.width  = "132px"
        document.getElementById('noiseIdxColor').style.left  = "60px"
        document.getElementById('noiseIdxColor').style.top  = "-17px"
        document.getElementById('noiseIdxColor').style.display = "block"
    }
    else if (noiseIdx == 4) {
        document.getElementById('noiseIdxColor').style.backgroundImage = "url('images/db_a04_ic06_4.png')";
        document.getElementById('noiseIdxColor').style.height  = "166px"
        document.getElementById('noiseIdxColor').style.width  = "132px"
        document.getElementById('noiseIdxColor').style.left  = "60px"
        document.getElementById('noiseIdxColor').style.top  = "-17px"
        document.getElementById('noiseIdxColor').style.display = "block"
    }
    else if (noiseIdx == 5) {
        document.getElementById('noiseIdxColor').style.backgroundImage = "url('images/db_a04_ic06_5.png')";
        document.getElementById('noiseIdxColor').style.height  = "166px"
        document.getElementById('noiseIdxColor').style.width  = "132px"
        document.getElementById('noiseIdxColor').style.left  = "60px"
        document.getElementById('noiseIdxColor').style.top  = "-17px"
        document.getElementById('noiseIdxColor').style.display = "block"
    }
    else if (noiseIdx == 6){
        document.getElementById('noiseIdxColor').style.backgroundImage = "url('images/db_a04_ic06_6.png')";
        document.getElementById('noiseIdxColor').style.height  = "166px"
        document.getElementById('noiseIdxColor').style.width  = "132px"
        document.getElementById('noiseIdxColor').style.left  = "60px"
        document.getElementById('noiseIdxColor').style.top  = "-17px"
        document.getElementById('noiseIdxColor').style.display = "block"
    }
    

    if (co2Idx == 1) {    
    document.getElementById('co2IdxColor').style.backgroundImage = "url('images/db_a04_ic04_1.png')";
    document.getElementById('co2IdxColor').style.height  = "166px"
    document.getElementById('co2IdxColor').style.width  = "132px"
    document.getElementById('co2IdxColor').style.left  = "60px"
    document.getElementById('co2IdxColor').style.top  = "-17px"
    document.getElementById('co2IdxColor').style.display = "block" }
    else if (co2Idx == 2) {    
    document.getElementById('co2IdxColor').style.backgroundImage = "url('images/db_a04_ic04_2.png')";
    document.getElementById('co2IdxColor').style.height  = "166px"
    document.getElementById('co2IdxColor').style.width  = "132px"
    document.getElementById('co2IdxColor').style.left  = "60px"
    document.getElementById('co2IdxColor').style.top  = "-17px"
    document.getElementById('co2IdxColor').style.display = "block" }
    else if (co2Idx == 3){    
    document.getElementById('co2IdxColor').style.backgroundImage = "url('images/db_a04_ic04_3.png')";
    document.getElementById('co2IdxColor').style.height  = "166px"
    document.getElementById('co2IdxColor').style.width  = "132px"
    document.getElementById('co2IdxColor').style.left  = "60px"
    document.getElementById('co2IdxColor').style.top  = "-17px"
    document.getElementById('co2IdxColor').style.display = "block" }
    else if (co2Idx == 4){    
    document.getElementById('co2IdxColor').style.backgroundImage = "url('images/db_a04_ic04_4.png')";
    document.getElementById('co2IdxColor').style.height  = "166px"
    document.getElementById('co2IdxColor').style.width  = "132px"
    document.getElementById('co2IdxColor').style.left  = "60px"
    document.getElementById('co2IdxColor').style.top  = "-17px"
    document.getElementById('co2IdxColor').style.display = "block" }
    else if (co2Idx == 5) {    
    document.getElementById('co2IdxColor').style.backgroundImage = "url('images/db_a04_ic04_5.png')";
    document.getElementById('co2IdxColor').style.height  = "166px"
    document.getElementById('co2IdxColor').style.width  = "132px"
    document.getElementById('co2IdxColor').style.left  = "60px"
    document.getElementById('co2IdxColor').style.top  = "-17px"
    document.getElementById('co2IdxColor').style.display = "block" }
    else if (co2Idx == 6){    
    document.getElementById('co2IdxColor').style.backgroundImage = "url('images/db_a04_ic04_6.png')";
    document.getElementById('co2IdxColor').style.height  = "166px"
    document.getElementById('co2IdxColor').style.width  = "132px"
    document.getElementById('co2IdxColor').style.left  = "60px"
    document.getElementById('co2IdxColor').style.top  = "-17px"
    document.getElementById('co2IdxColor').style.display = "block" }
    
    if (coIdx == 1) {
        document.getElementById('coIdxColor').style.backgroundImage = "url('images/db_a04_ic07_1.png')";
        document.getElementById('coIdxColor').style.height  = "166px"
        document.getElementById('coIdxColor').style.width  = "132px"
        document.getElementById('coIdxColor').style.left  = "60px"
        document.getElementById('coIdxColor').style.top  = "-17px"
        document.getElementById('coIdxColor').style.display = "block"
    }
    else if (coIdx == 2) {
        document.getElementById('coIdxColor').style.backgroundImage = "url('images/db_a04_ic07_2.png')";
        document.getElementById('coIdxColor').style.height  = "166px"
        document.getElementById('coIdxColor').style.width  = "132px"
        document.getElementById('coIdxColor').style.left  = "60px"
        document.getElementById('coIdxColor').style.top  = "-17px"
        document.getElementById('coIdxColor').style.display = "block"
    }
    else if (coIdx == 3){
        document.getElementById('coIdxColor').style.backgroundImage = "url('images/db_a04_ic07_3.png')";
        document.getElementById('coIdxColor').style.height  = "166px"
        document.getElementById('coIdxColor').style.width  = "132px"
        document.getElementById('coIdxColor').style.left  = "60px"
        document.getElementById('coIdxColor').style.top  = "-17px"
        document.getElementById('coIdxColor').style.display = "block"
    }
    else if (coIdx == 4){
        document.getElementById('coIdxColor').style.backgroundImage = "url('images/db_a04_ic07_4.png')";
        document.getElementById('coIdxColor').style.height  = "166px"
        document.getElementById('coIdxColor').style.width  = "132px"
        document.getElementById('coIdxColor').style.left  = "60px"
        document.getElementById('coIdxColor').style.top  = "-17px"
        document.getElementById('coIdxColor').style.display = "block"
    }
    else if (coIdx == 5){
        document.getElementById('coIdxColor').style.backgroundImage = "url('images/db_a04_ic07_5.png')";
        document.getElementById('coIdxColor').style.height  = "166px"
        document.getElementById('coIdxColor').style.width  = "132px"
        document.getElementById('coIdxColor').style.left  = "60px"
        document.getElementById('coIdxColor').style.top  = "-17px"
        document.getElementById('coIdxColor').style.display = "block"
    }
    else if (coIdx == 6){
        document.getElementById('coIdxColor').style.backgroundImage = "url('images/db_a04_ic07_6.png')";
        document.getElementById('coIdxColor').style.height  = "166px"
        document.getElementById('coIdxColor').style.width  = "132px"
        document.getElementById('coIdxColor').style.left  = "60px"
        document.getElementById('coIdxColor').style.top  = "-17px"
        document.getElementById('coIdxColor').style.display = "block"
    }


 

   
    document.getElementById( 'humidityScore' ).innerHTML = humidity+"%";
    document.getElementById( 'temperatureScore' ).innerHTML = temperature+"℃";
    document.getElementById( 'fineDustScore' ).innerHTML =   fineDust + "㎍/㎥" ;
    if (fineDustIdx == 1) 
    document.getElementById("fineDustScore").style.color = "#2DA1DA";
    else if (fineDustIdx == 2) 
    document.getElementById("fineDustScore").style.color = "#2FB983";
    else if (fineDustIdx == 3)
    document.getElementById("fineDustScore").style.color = "#E7A527";
    else if (fineDustIdx == 4)
    document.getElementById("fineDustScore").style.color = "#E34F20";
    else if (fineDustIdx == 5) 
    document.getElementById("fineDustScore").style.color = "#D8071F";
    else if (fineDustIdx == 6)
    document.getElementById("fineDustScore").style.color = "#6D30A9";  

    document.getElementById( 'fineDustScore1' ).innerHTML =   "("+totalIndexKeyValue[fineDustIdx]+")";
     if (fineDustIdx == 1) 
    document.getElementById("fineDustScore1").style.color = "#2DA1DA";
    else if (fineDustIdx == 2) 
    document.getElementById("fineDustScore1").style.color = "#2FB983";
    else if (fineDustIdx == 3)
    document.getElementById("fineDustScore1").style.color = "#E7A527";
    else if (fineDustIdx == 4)
    document.getElementById("fineDustScore1").style.color = "#E34F20";
    else if (fineDustIdx == 5) 
    document.getElementById("fineDustScore1").style.color = "#D8071F";
    else if (fineDustIdx == 6)
    document.getElementById("fineDustScore1").style.color = "#6D30A9";  

    if(fineDustIdx == 1){
        document.getElementById('fineDustScore2').style.backgroundImage = "url('images/icon_bg_weather-good.png')";
        document.getElementById('fineDustScore2').style.height  = "166px"
        document.getElementById('fineDustScore2').style.width  = "132px"
        document.getElementById('fineDustScore2').style.left  = "60px"
        document.getElementById('fineDustScore2').style.top  = "40px"
        document.getElementById('fineDustScore2').style.display = "block" 
    }else if (fineDustIdx == 2) {
        document.getElementById('fineDustScore2').style.backgroundImage = "url('images/icon_bg_weather-normal.png')";
        document.getElementById('fineDustScore2').style.height  = "166px"
        document.getElementById('fineDustScore2').style.width  = "132px"
        document.getElementById('fineDustScore2').style.left  = "60px"
        document.getElementById('fineDustScore2').style.top  = "40px"
        document.getElementById('fineDustScore2').style.display = "block" 
    }else if (fineDustIdx == 3) {
        document.getElementById('fineDustScore2').style.backgroundImage = "url('images/icon_bg_weather-bad.png')";
        document.getElementById('fineDustScore2').style.height  = "166px"
        document.getElementById('fineDustScore2').style.width  = "132px"
        document.getElementById('fineDustScore2').style.left  = "60px"
        document.getElementById('fineDustScore2').style.top  = "40px"
        document.getElementById('fineDustScore2').style.display = "block" 
    }else if (fineDustIdx == 4) {
        document.getElementById('fineDustScore2').style.backgroundImage ="url('images/icon_bg_weather-bad1.png')";
        document.getElementById('fineDustScore2').style.height  = "166px"
        document.getElementById('fineDustScore2').style.width  = "132px"
        document.getElementById('fineDustScore2').style.left  = "60px"
        document.getElementById('fineDustScore2').style.top  = "40px"
        document.getElementById('fineDustScore2').style.display = "block" 
    }else if (fineDustIdx == 5) {
        document.getElementById('fineDustScore2').style.backgroundImage ="url('images/icon_bg_weather-very-bad.png')";
        document.getElementById('fineDustScore2').style.height  = "166px"
        document.getElementById('fineDustScore2').style.width  = "132px"
        document.getElementById('fineDustScore2').style.left  = "60px"
        document.getElementById('fineDustScore2').style.top  = "40px"
        document.getElementById('fineDustScore2').style.display = "block" 
    }else if (fineDustIdx == 6) {
        document.getElementById('fineDustScore2').style.backgroundImage ="url('images/icon_bg_weather-very-bad1.png')";
        document.getElementById('fineDustScore2').style.height  = "166px"
        document.getElementById('fineDustScore2').style.width  = "132px"
        document.getElementById('fineDustScore2').style.left  = "60px"
        document.getElementById('fineDustScore2').style.top  = "40px"
        document.getElementById('fineDustScore2').style.display = "block" 
    }      

   if (temIdx == 1) {
        document.getElementById('fineDustIdxColor').style.height  = "166px"
        document.getElementById('fineDustIdxColor').style.width  = "132px"
        document.getElementById('fineDustIdxColor').style.left  = "60px"
        document.getElementById('fineDustIdxColor').style.top  = "-17px"
        document.getElementById('fineDustIdxColor').style.display = "block" 
        document.getElementById("fineDustIdxColor").style.backgroundImage = "url('images/db_a03_s02_ic_1.png')";
    }
    else if (temIdx == 2){
        document.getElementById('fineDustIdxColor').style.height  = "166px"
        document.getElementById('fineDustIdxColor').style.width  = "132px"
        document.getElementById('fineDustIdxColor').style.left  = "60px"
        document.getElementById('fineDustIdxColor').style.top  = "-17px"
        document.getElementById('fineDustIdxColor').style.display = "block" 
        document.getElementById("fineDustIdxColor").style.backgroundImage = "url('images/db_a03_s02_ic_2.png')";
    }
    else if (temIdx == 3){
        document.getElementById('fineDustIdxColor').style.height  = "166px"
        document.getElementById('fineDustIdxColor').style.width  = "132px"
        document.getElementById('fineDustIdxColor').style.left  = "60px"
        document.getElementById('fineDustIdxColor').style.top  = "-17px"
        document.getElementById('fineDustIdxColor').style.display = "block" 
        document.getElementById("fineDustIdxColor").style.backgroundImage = "url('images/db_a03_s02_ic_3.png')";
    }
    else if (temIdx == 4){
        document.getElementById('fineDustIdxColor').style.height  = "166px"
        document.getElementById('fineDustIdxColor').style.width  = "132px"
        document.getElementById('fineDustIdxColor').style.left  = "60px"
        document.getElementById('fineDustIdxColor').style.top  = "-17px"
        document.getElementById('fineDustIdxColor').style.display = "block" 
        document.getElementById("fineDustIdxColor").style.backgroundImage = "url('images/db_a03_s02_ic_4.png')";
    }
    else if (temIdx == 5) {
        document.getElementById('fineDustIdxColor').style.height  = "166px"
        document.getElementById('fineDustIdxColor').style.width  = "132px"
        document.getElementById('fineDustIdxColor').style.left  = "60px"
        document.getElementById('fineDustIdxColor').style.top  = "-17px"
        document.getElementById('fineDustIdxColor').style.display = "block" 
        document.getElementById("fineDustIdxColor").style.backgroundImage = "url('images/db_a03_s02_ic_5.png')";
    }
    else if (temIdx == 6){
        document.getElementById('fineDustIdxColor').style.height  = "166px"
        document.getElementById('fineDustIdxColor').style.width  = "132px"
        document.getElementById('fineDustIdxColor').style.left  = "60px"
        document.getElementById('fineDustIdxColor').style.top  = "-17px"
        document.getElementById('fineDustIdxColor').style.display = "block" 
        document.getElementById("fineDustIdxColor").style.backgroundImage = "url('images/db_a03_s02_ic_6.png')";
    }
    

    // ultraFineDustIdx------------------------------
    document.getElementById( 'ultraFineDustScore' ).innerHTML =  "<em>" + ultraFineDust +"㎍/㎥"+ "</em>" ;
    if (ultraFineDustIdx == 1) 
    document.getElementById("ultraFineDustScore").style.color = "#2DA1DA";
    else if (ultraFineDustIdx == 2) 
    document.getElementById("ultraFineDustScore").style.color = "#2FB983";
    else if (ultraFineDustIdx == 3)
    document.getElementById("ultraFineDustScore").style.color = "#E7A527";
    else if (ultraFineDustIdx == 4)
    document.getElementById("ultraFineDustScore").style.color = "#E34F20";
    else if (ultraFineDustIdx == 5) 
    document.getElementById("ultraFineDustScore").style.color = "#D8071F";
    else if (ultraFineDustIdx == 6)
    document.getElementById("ultraFineDustScore").style.color = "#6D30A9";  

    document.getElementById( 'ultraFineDustScore1' ).innerHTML =  "("+totalIndexKeyValue[ultraFineDustIdx] + ")" ;
    if (ultraFineDustIdx ==1) 
    document.getElementById("ultraFineDustScore1").style.color = "#2DA1DA";
    else if (ultraFineDustIdx == 2) 
    document.getElementById("ultraFineDustScore1").style.color = "#2FB983";
    else if (ultraFineDustIdx == 3)
    document.getElementById("ultraFineDustScore1").style.color = "#E7A527";
    else if (ultraFineDustIdx == 4)
    document.getElementById("ultraFineDustScore1").style.color = "#E34F20";
    else if (ultraFineDustIdx == 5) 
    document.getElementById("ultraFineDustScore1").style.color = "#D8071F";
    else if (ultraFineDustIdx == 6)
    document.getElementById("ultraFineDustScore1").style.color = "#6D30A9";  

    if(ultraFineDustIdx == 1 ){
        document.getElementById('ultraFineDustScore2').style.backgroundImage = "url('images/icon_bg_weather-good.png')";
        document.getElementById('ultraFineDustScore2').style.height  = "166px"
        document.getElementById('ultraFineDustScore2').style.width  = "132px"
        document.getElementById('ultraFineDustScore2').style.left  = "60px"
        document.getElementById('ultraFineDustScore2').style.top  = "40px"
    }else if (ultraFineDustIdx == 2) {
        document.getElementById('ultraFineDustScore2').style.backgroundImage = "url('images/icon_bg_weather-normal.png')";
        document.getElementById('ultraFineDustScore2').style.height  = "166px"
        document.getElementById('ultraFineDustScore2').style.width  = "132px"
        document.getElementById('ultraFineDustScore2').style.left  = "60px"
        document.getElementById('ultraFineDustScore2').style.top  = "40px"
    }else if (ultraFineDustIdx == 3) {
        document.getElementById('ultraFineDustScore2').style.backgroundImage = "url('images/icon_bg_weather-bad.png')";
        document.getElementById('ultraFineDustScore2').style.height  = "166px"
        document.getElementById('ultraFineDustScore2').style.width  = "132px"
        document.getElementById('ultraFineDustScore2').style.left  = "60px"
        document.getElementById('ultraFineDustScore2').style.top  = "40px"
    } else if (ultraFineDustIdx ==4) {
        document.getElementById('ultraFineDustScore2').style.backgroundImage ="url('images/icon_bg_weather-bad1.png')";
        document.getElementById('ultraFineDustScore2').style.height  = "166px"
        document.getElementById('ultraFineDustScore2').style.width  = "132px"
        document.getElementById('ultraFineDustScore2').style.left  = "60px"
        document.getElementById('ultraFineDustScore2').style.top  = "40px"
    } else if (ultraFineDustIdx == 5) {
        document.getElementById('ultraFineDustScore2').style.backgroundImage ="url('images/icon_bg_weather-very-bad.png')";
        document.getElementById('ultraFineDustScore2').style.height  = "166px"
        document.getElementById('ultraFineDustScore2').style.width  = "132px"
        document.getElementById('ultraFineDustScore2').style.left  = "60px"
        document.getElementById('ultraFineDustScore2').style.top  = "40px"
    } else if (ultraFineDustIdx == 6) {
        document.getElementById('ultraFineDustScore2').style.backgroundImage ="url('images/icon_bg_weather-very-bad1.png')";
        document.getElementById('ultraFineDustScore2').style.height  = "166px"
        document.getElementById('ultraFineDustScore2').style.width  = "132px"
        document.getElementById('ultraFineDustScore2').style.left  = "60px"
        document.getElementById('ultraFineDustScore2').style.top  = "40px"
    }
  

    if(airScoreIdx < 1){
        document.getElementById('total').style.backgroundImage = "url('images/1_humun.png')";
        document.getElementById('total').style.height  = "218px"
        document.getElementById('total').style.width  = "217px"
        document.getElementById('total').style.left  = "58px"
        document.getElementById('total').style.top  = "39px"
    }else if (airScoreIdx < 2) {
        document.getElementById('total').style.backgroundImage = "url('images/2_humun.png')";
        document.getElementById('total').style.height  = "218px"
        document.getElementById('total').style.width  = "217px"
        document.getElementById('total').style.left  = "58px"
        document.getElementById('total').style.top  = "39px"
    }else if (airScoreIdx < 3) {
        document.getElementById('total').style.backgroundImage = "url('images/3_humun.png')";
        document.getElementById('total').style.height  = "218px"
        document.getElementById('total').style.width  = "217px"
        document.getElementById('total').style.left  = "58px"
        document.getElementById('total').style.top  = "39px"
    } else if (airScoreIdx < 4) {
        document.getElementById('total').style.backgroundImage ="url('images/4_humun.png')";
        document.getElementById('total').style.height  = "218px"
        document.getElementById('total').style.width  = "217px"
        document.getElementById('total').style.left  = "58px"
        document.getElementById('total').style.top  = "39px"
    } else if (airScoreIdx < 5) {
        document.getElementById('total').style.backgroundImage ="url('images/5_humun.png')";
        document.getElementById('total').style.height  = "218px"
        document.getElementById('total').style.width  = "217px"
        document.getElementById('total').style.left  = "58px"
        document.getElementById('total').style.top  = "39px"
    } else if (airScoreIdx < 6) {
        document.getElementById('total').style.backgroundImage ="url('images/6_humun.png')";
        document.getElementById('total').style.height  = "218px"
        document.getElementById('total').style.width  = "217px"
        document.getElementById('total').style.left  = "58px"
        document.getElementById('total').style.top  = "39px"
    }
  
    document.getElementById( 'vocScore' ).innerHTML = totalIndexKeyValue[vocIdx] + "<em>" + voc + 'ppb'+ "</em>" ;
    document.getElementById( 'noiseScore' ).innerHTML = totalIndexKeyValue[noiseIdx] + "<em>" + noise + 'db'+"</em>";
    document.getElementById( 'co2Score' ).innerHTML = totalIndexKeyValue[co2Idx] + "<em>" + co2 + 'ppm' + "</em>";
    document.getElementById( 'hchoScore' ).innerHTML =  totalIndexKeyValue[hchoIdx] + "<em>" + hcho + 'μg/㎥'+"</em>";
    document.getElementById( 'coScore' ).innerHTML =  totalIndexKeyValue[coIdx] + "<em>" + co +  "</em>";


   
//pmMsg
if( fineDustIdx <= 1 || fineDustIdx <= 1 ) {
    if ( fineDustIdx <= 1 ) { 
        pmMsg = pmMsg + "미세먼지, ";
    } 
    if ( fineDustIdx <= 1 ) {
        pmMsg = pmMsg + "초미세먼지, ";
    }
    pmMsg = pmMsg.substring( 0, pmMsg.length - 2 );
    pmMsg = pmMsg + " 항목은 잘 관리되고 있습니다. ";
}    

if( fineDustIdx >= 3 || fineDustIdx >= 3 ) {
    if ( fineDustIdx >= 3 ) {
        pmMsg = pmMsg + "미세먼지, ";
    }
    if ( fineDustIdx >= 3 ) {
        pmMsg = pmMsg + "초미세먼지, ";
    }
    pmMsg = pmMsg.substring( 0, pmMsg.length - 2 );
    pmMsg = pmMsg + " 항목의 관리가 요망됩니다.";
}

if( fineDustIdx <= 1 && fineDustIdx <= 1 ) {
    pmMsg = pmMsg + "미세먼지 관리가 잘되고 있습니다. 공기청정기를 가동하여 지속적으로 미세먼지를 관리해주세요.";
} else if ( fineDustIdx > 1 || fineDustIdx > 1 ) {
    pmMsg = pmMsg + "미세먼지 관리가 요망되므로, 공기청정기를 가동하여 미세먼지를 관리하여 주시기 바랍니다.";
}
//harmfulMsg
if( co2Idx <= 1 || hchoIdx <= 1 || vocIdx <= 1 ) {
    if ( co2Idx <= 1 ) { 
        harmfulMsg = harmfulMsg + "이산화탄소, ";
    } 
    if ( hchoIdx <= 1 ) {
        harmfulMsg = harmfulMsg + "포름알데히드, ";
    }
    if ( vocIdx <= 1 ) {
        harmfulMsg = harmfulMsg + "휘발성유기화합물, ";
    }
    harmfulMsg = harmfulMsg.substring( 0, harmfulMsg.length - 2 );
    harmfulMsg = harmfulMsg + " 항목은 잘 관리되고 있습니다. ";
} 
if( co2Idx >= 2 || hchoIdx >= 2 || vocIdx >= 2 ) {
    if ( co2Idx >= 2 ) { 
        harmfulMsg = harmfulMsg + "이산화탄소, ";
    } 
    if ( hchoIdx >= 2 ) {
        harmfulMsg = harmfulMsg + "포름알데히드, ";
    }
    if ( vocIdx >= 2 ) {
        harmfulMsg = harmfulMsg + "휘발성유기화합물, ";
    }
    harmfulMsg = harmfulMsg.substring( 0, harmfulMsg.length - 2 );
    harmfulMsg = harmfulMsg + " 항목의 관리가 요망됩니다. ";
}   
if( co2Idx <= 1 && hchoIdx <= 1 && vocIdx <= 1 ) {
    harmfulMsg = harmfulMsg + "유해물질 관리가 잘되고 있습니다. 공기 환기를 통하여 유해물질이 없도록 관리해주세요.<br><br>";
} else if ( co2Idx > 1 || hchoIdx > 1 || vocIdx > 1 ) {
    harmfulMsg = harmfulMsg + "공기 중 유해물질 관리가 요망되므로, 적절한 환기가 요구됩니다. 단, 환기에 의한 미세먼지 유입이 진행될 수 있으니 이점 주의하시기 바랍니다.<br><br>";
}
document.getElementById("list3Word2").innerHTML = pmMsg+harmfulMsg+airMsg;
    
}
var alarmCri = 80;
var updateChart;
var circleChart;
function drawIndexChart( whatYouNeed ) {

    if ( updateChart != null ) {
        updateChart.destroy();
    }

    if ( circleChart != null ) {
        circleChart.destroy();
    }
    
    getLineChartDetailInfo()
    // lineChart
    .then( function( result ) {
        var jsonObj = JSON.parse( result );
        var chartLabel = [];
        var chartDatas = [];
        var tmpHour = -1;
 
        
        jsonObj.data.forEach( function( item ) {
            var utcTime = moment( item.date ).utc();
            var hour = utcTime.format( "HH:00" );
           
            if ( tmpHour != hour ) {
                tmpHour = hour;
                
                chartLabel.push( utcTime.format( 'YYYY-MM-DD HH:00' ) );
                chartDatas.push( item[whatYouNeed] );
            }
            
        });
        console.log(chartDatas);

        console.log(chartLabel);
        draw5_1LineChartRepeatly2();
        

        // alarm
        var alarmCriCnt = 0;
        new Promise( function( resolve ) {
            requestAjax( "POST", host + "/AlarmTable/getAlarmValue", function( err, datums ) {
                resolve( datums );
            })
        }).then( function( alaramVal ) {
            var jsonalaramObj = JSON.parse( alaramVal );
            alarmCri = jsonalaramObj.data[whatYouNeed];
            chartDatas.forEach( function(item) {
                if ( item >= alarmCri ) {
                    alarmCriCnt = alarmCriCnt + 1;
                }
            });
        })
        return result;

        function draw5_1LineChartRepeatly2() {
            new Chart(
                document.getElementById("oneChart"), {
                type: 'line',
                data: {
                fill: false,
                borderWidth: 1,
                labels: chartLabel,
                datasets: [{
                label:"온도",
                data:chartDatas,
                    }]
                },
                options: {
                    plugins:{
                        datalabels:{
                            color:"white",
                            display:false  // 데이터 표시 
                        },
                    },
                    animation: {
                        duration: 2000,
                    },
                    legend: {
                        display: false
                     },
                     tooltips: {
                        enabled: false
                     },   
                    // 범례 제거
                    labels: {
                        fontColor: 'white' // label color
                       },
                    fontColor : "red",
                }
            });
    }
    })
    // doughnutChart
    .then( function( result ) {
        var jsonObj = JSON.parse( result );
        var indexVal = Array(6).fill(0);

        new Promise( function( resolve ) {           
            requestAjax( "POST", host + "/indextable/getIndexTableBySensorType?sensorType=" + whatYouNeed, function( err, datums ) {
                resolve( datums );
            })
        }).then( function( result2 ) {
            var indexScope = JSON.parse( result2 );
            indexScope.data.forEach( function( scopeVal ) {
                jsonObj.data.forEach( function ( item ) {
                    if ( item[whatYouNeed] <= scopeVal.max && item[whatYouNeed] >= scopeVal.min ) {
                        indexVal[scopeVal.grade-1] = indexVal[scopeVal.grade-1] + 1;
                    }
                });
            });
        }).then( function() {
           
        });

        
    });
}





function openSpecificPop( whatYouNeed ) {
    this.whatYouNeed = whatYouNeed;
       
    if ( updateChart != null ) {
        updateChart.destroy();
    }

    if ( circleChart != null ) {
        circleChart.destroy();
    }

    
    $('.pu_bg').fadeIn(200);
    $('.pu_d_data').fadeIn(200);
    $('html').addClass('on');

    drawIndexChart( whatYouNeed );
}

function openReportInitPop() {
    document.getElementById( 'reportDatePicker' ).value = document.getElementById( 'windowDatePicker' ).value;
}

function getLineChartDetailInfo() {
    return new Promise( function( resolve ) {
        var datePickerInput = document.getElementById('reportDatePicker');
        var startDate = getNotBeforeToPickmeup( datePickerInput.value ) + " 00:00:00";
        var endDate = getNotAfterToPickmeup( datePickerInput.value ) + " 24:00:00";
        requestAjax( "POST", host + "/report/getChartDataByDate?serialNumber=" + sn + "&startDate=" + startDate + "&endDate=" + endDate, function( err, datums ) {
            resolve( datums );
        });
    });
}

function popReport() {
    var reportDate = document.getElementById( 'reportDatePicker' ).value;
    window.open( "./report_sample.html?oper=view&date=" + reportDate + "&host=" + host + "&devId=" + devId + "&sn=" + sn, "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=1200, height=900" );
}



function initInfomation(jsonObj) {
    var deviceSN = jsonObj.data[0].deviceSN;
    var deviceName = jsonObj.data[0].deviceName;
    var buildingName = jsonObj.data[0].buildingName;
    var date = jsonObj.data[0].date;
    var indoor = jsonObj.data[0].indoor;
    var dateTime = date.replace(/([^T]+)T([^\.]+).*/g, "$1 $2").slice(0, -3) + ":00";
    var latitude = jsonObj.data[0].latitude;
    var longitude = jsonObj.data[0].longitude;
   
    proj4.defs(
        "EPSG:5181",
        "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs"
      );
    proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
    var coords = proj4("EPSG:4326", "EPSG:5181", [longitude, latitude]);
    var coordX = coords[0];
    var coordY = coords[1];
    console.log(coordX);
    console.log(coordY);
   ;
    //기상청 위도경도 변경 로직 실행
    // var kmaGrid = dfsXyConv("toXY", latitude, longitude);
    // console.log(kmaGrid);
    //여기서 이제 proxy/getWeather 호출 하면됨
    function outdata() {
        return new Promise( function( resolve ) {
                requestAjax( "POST", host + "/Proxy/getStation?latitude=" + coordX + "&longitude=" + coordY, function( err, datums ) {
                var res = JSON.parse(datums);
                console.log(res);
                document.getElementById( 'wd3' ).innerHTML = res.data[0].addr;
                var apiURI = "http://api.openweathermap.org/data/2.5/weather?q="+ res.data[0].stationName+"&appid="+"1ddf0dd5d9d4f22ab840e98975ad2675";
                requestAjax( "GET", apiURI , function( err, datums ) {
                    resolve( datums );
                    var res1 = JSON.parse(datums);
                    console.log(res1);
                    if(datums == '{"cod":"404","message":"city not found"}'){
                    var apiURI1 = "http://api.openweathermap.org/data/2.5/weather?q="+ stationName +"&appid="+"1ddf0dd5d9d4f22ab840e98975ad2675";
                    requestAjax( "GET", apiURI1 , function( err, datums ) {
                        resolve( datums );
                        var res2 = JSON.parse(datums);
                        console.log(res2);
                        document.getElementById('outHumidity').innerHTML = (res2.main.temp- 273.15).toFixed(1)+"℃";
                    });    
                }else{
                    document.getElementById('outHumidity').innerHTML = (res1.main.temp- 273.15).toFixed(1)+"℃";
                    }
                });
                
                requestAjax( "POST", host + "/Proxy/getDust?stationName=" + res.data[0].stationName , function( err, datums ) {
                    resolve( datums );
                    var res1 = JSON.parse(datums);
                    console.log(res1);
                    document.getElementById( 'wd' ).innerHTML = res1.data[0].pm10Value + "㎍/㎥";
                    document.getElementById( 'wd2' ).innerHTML = res1.data[0].pm25Value + "㎍/㎥";
                });
                })
            })       
           
     
    
    }
    outdata();
    document.getElementById( 'dName' ).innerHTML = deviceName ;
    document.getElementById( 'serial' ).innerHTML = deviceSN ;
    document.getElementById( 'bName' ).innerHTML = buildingName ;
    document.getElementById( 'date' ).innerHTML = dateTime ;
    
   

    if (buildingName == '충북대학교') {
        document.getElementById( 'bt_report' ).style.display = "none";
        document.getElementById( 'bt_excel' ).style.width = "293px";
      };

  if(indoor == '0') {
        // document.getElementById( 'indo' ).style.display = "none";
        document.getElementById( 'tex' ).style.display = "none";
        document.getElementById( 'tex2' ).style.display = "none";
        document.getElementById( 'tempDid' ).style.top = "-333px";
        document.getElementById( 'tempDid' ).style.left = "921px";
        document.getElementById( 'tempDid' ).style.height = "212px";
        document.getElementById( 'tempDid' ).style.width = "23%";
        document.getElementById( 'humiDid' ).style.top = "-333px";
        document.getElementById( 'humiDid' ).style.left = "930px";
        document.getElementById( 'humiDid' ).style.height = "212px";
        document.getElementById( 'humiDid' ).style.width = "23%";
        document.getElementById( 'vocDid' ).style.display = "none";
        document.getElementById( 'co2Did' ).style.display = "none";
        document.getElementById( 'hchoDid' ).style.display = "none";
        document.getElementById( 'noiseDid' ).style.display = "none";
        document.getElementById( 'coDid' ).style.display = "none";
        document.getElementById( 'kid' ).style.display = "none";
        document.getElementById( 'future' ).style.display = "none";
        document.getElementById( 'pm10Did' ).style.width = "23%";
        document.getElementById( 'pm25Did' ).style.width = "23%";
        document.getElementById( 'pm10Did' ).style.top = "21px";
        document.getElementById( 'pm25Did' ).style.top = "21px";
        document.getElementById( 'pm10Did' ).style.height = "214px";
        document.getElementById( 'pm25Did' ).style.height = "214px";
        document.getElementById( 'pm25Did' ).style.left = "30px";
        document.getElementById( 'fineDustScore2' ).style.height = "166px";
        document.getElementById( 'fineDustScore2' ).style.width = "132px";
        document.getElementById( 'fineDustScore2' ).style.left = "139px";
        document.getElementById( 'fineDustScore2' ).style.top = "1px";
        document.getElementById( 'fineDustScore2' ).style.display = "block";
        document.getElementById( 'ultraFineDustScore2' ).style.height = "166px";
        document.getElementById( 'ultraFineDustScore2' ).style.width = "132px";
        document.getElementById( 'ultraFineDustScore2' ).style.left = "139px";
        document.getElementById( 'ultraFineDustScore2' ).style.top = "1px";
        document.getElementById( 'fineDustIdxColor' ).style.height = "166px";
        document.getElementById( 'fineDustIdxColor' ).style.width = "132px";
        document.getElementById( 'fineDustIdxColor' ).style.left = "139px";
        document.getElementById( 'fineDustIdxColor' ).style.top = "1px";
        document.getElementById( 'ultraFineDustIdxColor' ).style.height = "166px";
        document.getElementById( 'ultraFineDustIdxColor' ).style.width = "132px";
        document.getElementById( 'ultraFineDustIdxColor' ).style.left = "139px";
        document.getElementById( 'ultraFineDustIdxColor' ).style.top = "1px";
        document.getElementById( 'did' ).style.bottom = "-147px";
        document.getElementById( 'pm10text' ).style.top = "156px";
        document.getElementById( 'pm25text' ).style.top = "156px";
        document.getElementById( 'fineDustScore' ).style.left = "15px";
        document.getElementById( 'fineDustScore' ).style.top = "156px";
        document.getElementById( 'ultraFineDustScore' ).style.left = "15px";
        document.getElementById( 'ultraFineDustScore' ).style.top = "156px";
        document.getElementById( 'fineDustScore1' ).style.left = "85px";
        document.getElementById( 'ultraFineDustScore1' ).style.left = "85px";
        document.getElementById( 'asds' ).style.display = "none";
        document.getElementById( 'asds1' ).style.display = "none";
      }
      //ultraFineDustScore2 fineDustScore2 fineDustIdxColor ultraFineDustIdxColor
      generateChartData2(); 
    //   asd();
}
//기상청 위도 경도 변경 로직
// 위경도를 기상청 grid x,y 로 변경 - http://werty.co.kr/blog/3011
// LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
function dfsXyConv(code, v1, v2) {
    // LCC DFS 좌표변환을 위한 기초 자료
    //
    var RE = 6371.00877; // 지구 반경(km)
    var GRID = 5.0; // 격자 간격(km)
    var SLAT1 = 30.0; // 투영 위도1(degree)
    var SLAT2 = 60.0; // 투영 위도2(degree)
    var OLON = 126.0; // 기준점 경도(degree)
    var OLAT = 38.0; // 기준점 위도(degree)
    var XO = 43; // 기준점 X좌표(GRID)
    var YO = 136; // 기준점 Y좌표(GRID)
  
    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;
  
    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;
  
    var sn =
      Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
      Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = (re * sf) / Math.pow(ro, sn);
    var rs = {};
    if (code == "toXY") {
      rs["lat"] = v1;
      rs["lng"] = v2;
      var ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
      ra = (re * sf) / Math.pow(ra, sn);
      var theta = v2 * DEGRAD - olon;
      if (theta > Math.PI) theta -= 2.0 * Math.PI;
      if (theta < -Math.PI) theta += 2.0 * Math.PI;
      theta *= sn;
      rs["nx"] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
      rs["ny"] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    } else {
      rs["nx"] = v1;
      rs["ny"] = v2;
      var xn = v1 - XO;
      var yn = ro - v2 + YO;
      ra = Math.sqrt(xn * xn + yn * yn);
      if (sn < 0.0) -ra;
      var alat = Math.pow((re * sf) / ra, 1.0 / sn);
      alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;
  
      if (Math.abs(xn) <= 0.0) {
        theta = 0.0;
      } else {
        if (Math.abs(yn) <= 0.0) {
          theta = Math.PI * 0.5;
          if (xn < 0.0) -theta;
        } else theta = Math.atan2(xn, yn);
      }
      var alon = theta / sn + olon;
      rs["lat"] = alat * RADDEG;
      rs["lng"] = alon * RADDEG;
    }
    return rs;
  }



function weatherfomation(jsonObj) {
    var pm10Value1 = outdoorDustData;
    var pm25Value1 = outdoorDustData1;
  
}


function initInfo() {
    return new Promise( function( resolve ) {
        
        requestAjax( "POST", host + "/RecentData/getRecentDataByDeviceSN?deviceSN=" + sn, function( err, datums ) {
            resolve( datums );
        });
    })
    .then( function( result ) {
        var jsonObj = JSON.parse( result );
        // console.log(result);
        initInfomation( jsonObj );
        generateChartData2(jsonObj);
    });
}




function weatherinit() {
    return new Promise( function( resolve ) {
        requestAjax( "POST", host + "/Proxy/getDust?stationName="+stationName, function( err, datums ) {
            resolve( datums );
        });
    })
    .then( function( result ) {
        var jsonObj = JSON.parse( result );
        weatherfomation( jsonObj );
    })
    
}


function buildinginit() {
    return new Promise( function( resolve ) {
        requestAjax( "POST", host + "/Device/getDeviceBySerialNumber2?serialNumber="+sn, function( err, datums ) {
            resolve( datums );
            
        });
    })
    .then( function( result ) {
        var jsonObj = JSON.parse( result );
        weatherfomation( jsonObj );
        console.log(result);
        });

}


function weatherfomation1(jsonObj) {
    var id = jsonObj.data[0].id;
    var pm25Value = jsonObj.data[0].pm25Value;
    var address = jsonObj.data[0].address;
    var ultraFineDustIdx = jsonObj.data[0].pm10Index;
}


var apiURI = host + "/Building/allBuilding";
        $.ajax({
            url: apiURI,
            dataType: "json",
            type: "GET",
            async: "false",
            success: function(resp) {
            }
        })

      
function getScopeVal( item ) {
return new Promise( function( resolve ) {
    requestAjax( "POST", host + "/indextable/getIndexTableBySensorType?sensorType=" + item, function( err, datums ) {
        resolve( datums );
    });
});
}

function generateChartData2() {
    new Promise( function( resolve) {
        requestAjax( "POST", host + "/recentData/getRecentDataByDeviceSN?deviceSN=" + sn ,function( err, datums ) {
            resolve( datums );
            })
        }).then( function( result ) {
            jsonObj = JSON.parse( result );
            // console.log(result);
          
            if(jsonObj.data[0].predict_yn == '0'){
                new Promise( function( resolve) {
                    requestAjax( "POST", host + "/report/getDevice10min?serialNumber=" + sn ,function( err, datums ) {
                        resolve( datums );
                        document.getElementById('1').style.display = 'none';
                        document.getElementById('2').style.display = 'none';
                        document.getElementById('3').style.display = 'none';
                        document.getElementById('4').style.display = 'none';
                        document.getElementById('5').style.display = 'none';
                        document.getElementById('pm10_10').style.display = 'none';
                        document.getElementById('pm10_30').style.display = 'none';
                        document.getElementById('pm25_10').style.display = 'none';
                        document.getElementById('pm25_30').style.display = 'none';
                        document.getElementById('beom').style.display = 'none';
                    })
                }).then( function( result ) {
                    jsonObj = JSON.parse( result );
                    // console.log(result);
                    draw5_1LineChartRepeatly();
                })
            }else if(jsonObj.data[0].predict_yn == '1'){
                new Promise( function( resolve) {
                    requestAjax( "POST", host + "/report/getPredDataBySerial?serialNumber=" + sn ,function( err, datums ) {
                        resolve( datums );
                    })
                }).then( function( result ) {
                        jsonObj = JSON.parse( result );
                        setTotalSCore1( jsonObj )
                        // console.log(result);
                        draw5_1LineChartRepeatly1();
                        document.getElementById('6').style.display = 'none';
                        document.getElementById('beom1').style.display = 'none';
                })
            }
        })
     
    }
    // get chart val
    


function setTotalSCore1(jsonObj) {
  
    if(jsonObj.data[0].pm10 <= 29){
        document.getElementById('pm10_10').style.backgroundImage = "url('images/1icon_bg_weather-good.png')";
        document.getElementById('pm10_10').style.height  = "50px"
        document.getElementById('pm10_10').style.width  = "48px"
        document.getElementById('pm10_10').style.left  = "-190px"
        document.getElementById('pm10_10').style.top  = "93px"
    }else if (30 <= jsonObj.data[0].pm10 <= 50) {
        document.getElementById('pm10_10').style.backgroundImage = "url('images/1icon_bg_weather-normal.png')";
        document.getElementById('pm10_10').style.height  = "50px"
        document.getElementById('pm10_10').style.width  = "48px"
        document.getElementById('pm10_10').style.left  = "-190px"
        document.getElementById('pm10_10').style.top  = "93px"
    }else if (51 <= jsonObj.data[0].pm10 <= 79) {
        document.getElementById('pm10_10').style.backgroundImage = "url('images/1icon_bg_weather-bad.png')";
        document.getElementById('pm10_10').style.height  = "50px"
        document.getElementById('pm10_10').style.width  = "48px"
        document.getElementById('pm10_10').style.left  = "-190px"
        document.getElementById('pm10_10').style.top  = "93px"
    } else if (80 <= jsonObj.data[0].pm10 <= 100) {
        document.getElementById('pm10_10').style.backgroundImage ="url('images/1icon_bg_weather-bad1.png')";
        document.getElementById('pm10_10').style.height  = "50px"
        document.getElementById('pm10_10').style.width  = "48px"
        document.getElementById('pm10_10').style.left  = "-190px"
        document.getElementById('pm10_10').style.top  = "93px"
    } else if (101 <= jsonObj.data[0].pm10 <= 239) {
        document.getElementById('pm10_10').style.backgroundImage ="url('images/1icon_bg_weather-very-bad.png')";
        document.getElementById('pm10_10').style.height  = "50px"
        document.getElementById('pm10_10').style.width  = "48px"
        document.getElementById('pm10_10').style.left  = "-190px"
        document.getElementById('pm10_10').style.top  = "93px"
    } else if (240 <= jsonObj.data[0].pm10 <= 500) {
        document.getElementById('pm10_10').style.backgroundImage ="url('images/1icon_bg_weather-very-bad1.png')";
        document.getElementById('pm10_10').style.height  = "50px"
        document.getElementById('pm10_10').style.width  = "48px"
        document.getElementById('pm10_10').style.left  = "-190px"
        document.getElementById('pm10_10').style.top  = "93px"
    }
    
    if(jsonObj.data[0].pm10 <= 29){
        document.getElementById('pm10_30').style.backgroundImage = "url('images/1icon_bg_weather-good.png')";
        document.getElementById('pm10_30').style.height  = "50px"
        document.getElementById('pm10_30').style.width  = "48px"
        document.getElementById('pm10_30').style.left  = "-190px"
        document.getElementById('pm10_30').style.top  = "166px"
    }
    else if (30 <= jsonObj.data[0].pm10 <= 50) {
        document.getElementById('pm10_30').style.backgroundImage = "url('images/1icon_bg_weather-normal.png')";
        document.getElementById('pm10_30').style.height  = "50px"
        document.getElementById('pm10_30').style.width  = "48px"
        document.getElementById('pm10_30').style.left  = "-190px"
        document.getElementById('pm10_30').style.top  = "166px"
    }else if (51 <= jsonObj.data[0].pm10 <= 79) {
        document.getElementById('pm10_30').style.backgroundImage = "url('images/1icon_bg_weather-bad.png')";
        document.getElementById('pm10_30').style.height  = "50px"
        document.getElementById('pm10_30').style.width  = "48px"
        document.getElementById('pm10_30').style.left  = "-190px"
        document.getElementById('pm10_30').style.top  = "166px"
    } else if (80 <= jsonObj.data[0].pm10 <= 100) {
        document.getElementById('pm10_30').style.backgroundImage ="url('images/1icon_bg_weather-bad1.png')";
        document.getElementById('pm10_30').style.height  = "50px"
        document.getElementById('pm10_30').style.width  = "48px"
        document.getElementById('pm10_30').style.left  = "-190px"
        document.getElementById('pm10_30').style.top  = "166px"
    } else if (101 <= jsonObj.data[0].pm10 <= 239) {
        document.getElementById('pm10_30').style.backgroundImage ="url('images/1icon_bg_weather-very-bad.png')";
        document.getElementById('pm10_30').style.height  = "50px"
        document.getElementById('pm10_30').style.width  = "48px"
        document.getElementById('pm10_30').style.left  = "-190px"
        document.getElementById('pm10_30').style.top  = "166px"
    } else if (240 <= jsonObj.data[0].pm10 <= 500) {
        document.getElementById('pm10_30').style.backgroundImage ="url('images/1icon_bg_weather-very-bad1.png')";
        document.getElementById('pm10_30').style.height  = "50px"
        document.getElementById('pm10_30').style.width  = "48px"
        document.getElementById('pm10_30').style.left  = "-190px"
        document.getElementById('pm10_30').style.top  = "166px"
    }   

    if(jsonObj.data[0].pm25 <= 29){
        document.getElementById('pm25_10').style.backgroundImage = "url('images/1icon_bg_weather-good.png')";
        document.getElementById('pm25_10').style.height  = "50px"
        document.getElementById('pm25_10').style.width  = "48px"
        document.getElementById('pm25_10').style.left  = "-105px"
        document.getElementById('pm25_10').style.top  = "93px"
    }else if (30 <= jsonObj.data[0].pm25 <= 50) {
        document.getElementById('pm25_10').style.backgroundImage = "url('images/1icon_bg_weather-normal.png')";
        document.getElementById('pm25_10').style.height  = "50px"
        document.getElementById('pm25_10').style.width  = "48px"
        document.getElementById('pm25_10').style.left  = "-105px"
        document.getElementById('pm25_10').style.top  = "93px"
    }else if (51 <= jsonObj.data[0].pm25 <= 79) {
        document.getElementById('pm25_10').style.backgroundImage = "url('images/1icon_bg_weather-bad.png')";
        document.getElementById('pm25_10').style.height  = "50px"
        document.getElementById('pm25_10').style.width  = "48px"
        document.getElementById('pm25_10').style.left  = "-105px"
        document.getElementById('pm25_10').style.top  = "93px"
    } else if (80<= jsonObj.data[0].pm25 <= 100) {
        document.getElementById('pm25_10').style.backgroundImage ="url('images/1icon_bg_weather-bad1.png')";
        document.getElementById('pm25_10').style.height  = "50px"
        document.getElementById('pm25_10').style.width  = "48px"
        document.getElementById('pm25_10').style.left  = "-105px"
        document.getElementById('pm25_10').style.top  = "93px"
    } else if (101 <= jsonObj.data[0].pm25 <= 239) {
        document.getElementById('pm25_10').style.backgroundImage ="url('images/1icon_bg_weather-very-bad.png')";
        document.getElementById('pm25_10').style.height  = "50px"
        document.getElementById('pm25_10').style.width  = "48px"
        document.getElementById('pm25_10').style.left  = "-105px"
        document.getElementById('pm25_10').style.top  = "93px"
    } else if (240 <= jsonObj.data[0].pm25 <= 500) {
        document.getElementById('pm25_10').style.backgroundImage ="url('images/1icon_bg_weather-very-bad1.png')";
        document.getElementById('pm25_10').style.height  = "50px"
        document.getElementById('pm25_10').style.width  = "48px"
        document.getElementById('pm25_10').style.left  = "-105px"
        document.getElementById('pm25_10').style.top  = "93px"
    }
    
    if(jsonObj.data[0].pm25 <= 29){
        document.getElementById('pm25_30').style.backgroundImage = "url('images/1icon_bg_weather-good.png')";
        document.getElementById('pm25_30').style.height  = "50px"
        document.getElementById('pm25_30').style.width  = "48px"
        document.getElementById('pm25_30').style.left  = "-105px"
        document.getElementById('pm25_30').style.top  = "166px"
    }else if (jsonObj.data[0].pm25 <= 50) {
        document.getElementById('pm25_30').style.backgroundImage = "url('images/1icon_bg_weather-normal.png')";
        document.getElementById('pm25_30').style.height  = "50px"
        document.getElementById('pm25_30').style.width  = "48px"
        document.getElementById('pm25_30').style.left  = "-105px"
        document.getElementById('pm25_30').style.top  = "166px"
    }else if (51 <= jsonObj.data[0].pm25 <= 79) {
        document.getElementById('pm25_30').style.backgroundImage = "url('images/1icon_bg_weather-bad.png')";
        document.getElementById('pm25_30').style.height  = "50px"
        document.getElementById('pm25_30').style.width  = "48px"
        document.getElementById('pm25_30').style.left  = "-105px"
        document.getElementById('pm25_30').style.top  = "166px"
    } else if (80<= jsonObj.data[0].pm25 <= 100) {
        document.getElementById('pm25_30').style.backgroundImage ="url('images/1icon_bg_weather-bad1.png')";
        document.getElementById('pm25_30').style.height  = "50px"
        document.getElementById('pm25_30').style.width  = "48px"
        document.getElementById('pm25_30').style.left  = "-105px"
        document.getElementById('pm25_30').style.top  = "166px"
    } else if (101 <= jsonObj.data[0].pm25 <= 239) {
        document.getElementById('pm25_30').style.backgroundImage ="url('images/1icon_bg_weather-very-bad.png')";
        document.getElementById('pm25_30').style.height  = "50px"
        document.getElementById('pm25_30').style.width  = "30px" 
        document.getElementById('pm25_30').style.left  = "-105px"
        document.getElementById('pm25_30').style.top  = "166px"
    } else if (240 <= jsonObj.data[0].pm25 <= 500) {
        document.getElementById('pm25_30').style.backgroundImage ="url('images/1icon_bg_weather-very-bad1.png')";
        document.getElementById('pm25_30').style.height  = "50px"
        document.getElementById('pm25_30').style.width  = "48px"
        document.getElementById('pm25_30').style.left  = "-105px"
        document.getElementById('pm25_30').style.top  = "166px"
    }   
    
}
        
        
        function draw5_1LineChartRepeatly1() {
            new Chart( 
                document.getElementById("myChart"), {
                type: 'line',
                data: {
                    display: false, //this will remove only the label
                    labels: ["30분 전","20분 전", "10분 전","현재","10분 후","30분 후","1시간 후"],
                    datasets: [{
                        label: 'PM10',
                        backgroundColor: "#ED7D31",
                        borderColor: "#ED7D31",
                        borderWidth: 1,
                        lineTension : 0.2,
                        fill: false,
                        data:[
                        jsonObj.data[3].pm10,
                        jsonObj.data[2].pm10, // 20분전
                        jsonObj.data[1].pm10, // 10분전
                        jsonObj.data[0].pm10, // 현재
                        null,
                        null,
                        null,
                        ]
                    },
                    {
                        label: '예측',
                        backgroundColor: "#d09f63",
                        borderColor: "#d09f63",
                        borderDash: [5, 5],
                        borderWidth: 1,
                        fill: false,
                        data:[
                        null,
                        null,
                        null,
                        jsonObj.data[0].pm10,
                        jsonObj.data[10].pm10, // 10분후
                        jsonObj.data[9].pm10, // 30분후 
                        jsonObj.data[8].pm10, // 1시간후 
                        ]
                    },
                    {
                        label: 'PM2.5',
                        backgroundColor: "#FFC000",
                        borderColor: "#FFC000",
                        fill: false,
                        borderWidth: 1,
                        data: [
                        jsonObj.data[3].pm25,
                        jsonObj.data[2].pm25,
                        jsonObj.data[1].pm25,
                        jsonObj.data[0].pm25,
                        null,
                        null,
                        null,  
                        ],
                    },
                    {
                        label: '예측',
                        backgroundColor: "#866a25",
                        borderColor: "#866a25",
                        fill: false,
                        borderWidth: 1,
                        borderDash: [5, 5],
                        data: [
                        null,
                        null,
                        null,
                        jsonObj.data[0].pm25,
                        jsonObj.data[10].pm25,
                        jsonObj.data[9].pm25,  // 30분후 
                        jsonObj.data[8].pm25  // 1시간후 
                                              // 3시간후
                        ], 
                    },
                  ],
                },
                options: {
                    
                    plugins:{
                        datalabels:{
                            color:"white",
                            display:false  // 데이터 표시 
                        },
                        
                    },
                    animation: {
                        duration: 2000,
                        maintainAspectRatio: false,
                    },
                    legend: { 
                        
                        labels: { 
                            fontColor: 'white', 
                            fontSize: 12 
                        } 
                        },
                    legend: {
                        display: false
                     },
                     tooltips: {
                        enabled: false
                     },   
                    // 범례 제거
                    labels: {
                        fontColor: 'white' // label color
                       },
                    fontColor : "red",
                    scales: {
                          xAxes: [{
                              ticks:{
                                color: 'white',
                                fontColor : 'white',
                                fontSize : 11,
                                gridLines: '4',
                            },
                            gridLines:{
                               borderDash: [1,5],
                                color:"white",
                                lineWidth: [0,0,0,2,0,0,0],
                                drawBorder: true
                            }
                        }],
                        yAxes: [{
                            type: "linear", //기본 linear로 설정해야함.
                            display: true, //label 표시 설정
                            id: "y-axis", //label id 설정
                            gridLines: {
                                drawOnChartArea: false //background 라인 생성
                            },
                        
                            ticks: {
                                precision: 1,
                                stepSize: 18.1,
                                beginAtZero: true,
                                min: 0,
                                // max: 250,
                                stepSize : 0,
                                fontColor : "white",
                                fontSize : 14,
                            },
                            gridLines:{
                                lineWidth: [0,0,0,0,0,0,0,0,0,0,0,0],
                                color:"grey",
                            },
                         
                        }]
                    },
                }
            });
        };
       
        function draw5_1LineChartRepeatly() {
            new Chart(document.getElementById("myChart1"), {
                type: 'line',
                data: {
                    display: false, //this will remove only the label
                    labels: ["한시간 전","50분 전", "40분 전","30분 전","20분 전","10분 전","현재"],
                    datasets: [{
                        label: 'PM10',
                        backgroundColor: "#ED7D31",
                        borderColor: "#ED7D31",
                        borderWidth: 1,
                        lineTension : 0.2,
                        fill: false,
                        data:[
                        jsonObj.data[59].pm10,
                        jsonObj.data[50].pm10, // 20분전
                        jsonObj.data[40].pm10, // 10분전
                        jsonObj.data[30].pm10, // 현재
                        jsonObj.data[20].pm10, // 20분전
                        jsonObj.data[10].pm10, // 10분전
                        jsonObj.data[0].pm10, // 현재
                        ]
                    },
                    {
                        label: 'PM2.5',
                        backgroundColor: "#FFC000",
                        borderColor: "#FFC000",
                        fill: false,
                        borderWidth: 1,
                        data: [
                        jsonObj.data[59].pm25,
                        jsonObj.data[50].pm25,
                        jsonObj.data[40].pm25,
                        jsonObj.data[30].pm25,
                        jsonObj.data[20].pm25,
                        jsonObj.data[10].pm25,
                        jsonObj.data[0].pm25,
                        ],
                    },
                  ],
                },
                options: {
                    plugins:{
                        datalabels:{
                            color:"white",
                            display:false  // 데이터 표시 
                        },
                    },
                    animation: {
                        duration: 2000,
                    },
                    legend: {
                        display: false
                     },
                     tooltips: {
                        enabled: false
                     },   
                    // 범례 제거
                    labels: {
                        fontColor: 'white' // label color
                       },
                    fontColor : "red",
                    scales: {
                        xAxes: [{
                            ticks:{
                                color: 'white',
                                fontColor : 'white',
                                fontSize : 11,
                                gridLines: '4',
                                
                            },
                            gridLines:{
                                borderDash: [1, 5],
                                color:"white",
                                lineWidth: [1,0,0,0,0,0,2],
                                zeroLineColor:"rgba(255,255,255,0.5)",
                                drawBorder: true
                            }
                        }],
                        yAxes: [{
                            ticks:{
                            beginAtZero: true,
                            name: 'A',
                            type: 'linear',
                            position: 'left',
                            min: 0,
                            stepSize : 0,
                            fontColor : "white",
                            scalePositionLeft: true
                            },
                            gridLines:{
                                    lineWidth: [0,0,0,0,0,0,0,0,0,0,0,0],
                                    color:"grey",
                                }
                        },
                    
                        ],
                    },
                }
            });
        }
        

