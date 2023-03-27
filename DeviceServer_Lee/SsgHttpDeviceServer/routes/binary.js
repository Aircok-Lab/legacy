var express = require("express");
var router = express.Router();
const fs = require("fs");
var os = require("os");

var result = "";

function isEmptyObject(param) {
  return Object.keys(param).length === 0 && param.constructor === Object;
}

router.post("/", function(req, res, next) {

  console.log("/ binary 호출됨.......");

  if ( isEmptyObject(req.body) && isEmptyObject(req.query)) {    
     result =
      "NO|" +
      //paramDate +                                
      "전송데이터가없습니다." +
      "|!="; 
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end(result);  
      return;
  }
  
  // 스트림 단위로 파일 읽고 쓰기
  var paramPageNum = req.body.pageNum || req.query.pageNum;
  var paramFileName = req.body.fileName || req.query.fileName;
  var sratNum = 0;
  var endNum = 0;

  //if ( parseInt(paramPageNum) > 64 || parseInt(paramPageNum) < 1) {
    if ( parseInt(paramPageNum) > 256 || parseInt(paramPageNum) < 1) {
    result =
    "NO|" +
    //paramDate +                                
    "페이지 요청번호를 초과 하였습니다." +
    "|!="; 
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end(result);  
    return;
  }

  //startNum = ( paramPageNum * 2048 ) - 2048; 
  //endNum = ( paramPageNum * 2048) - 1; 

  startNum = ( paramPageNum * 512 ) - 512; 
  endNum = ( paramPageNum * 512) - 1; 

  //console.log("starrNUm:" + startNum);
  //console.log("endNum:" + endNum);

  var fs = require('fs');
  var infile = fs.createReadStream('./uploads/'+paramFileName,{falgs : 'r',start: startNum,end:endNum });
  
  infile.on('data',function(data){

    //console.log('읽어 들인 데이터',data);
    //console.log('읽어 들인 데이터길이',data.length);    
    
    // var buf2 = Buffer.from(data);
    //console.log('복사한 데이터',buf2);
    //var buf_12 = Buffer.alloc(16);

    //var buf_result = Buffer.from(data);

    //var buf_result = Buffer.from(data); // .toString("utf-8");
    //console.log('읽어 들인 데이터1',buf_result);

    //var buf_start = Buffer.from("$$aircok:s$$");
    //console.log('읽어 들인 데이터2',buf_start);

    //var step;
    //for (step = 0; step < 2048; step += 16) {    
    //  buf_12 = buf_12 ^ buf2.slice(step, step+16);  // 20200923 16 바이트씩 ^or 뺀다...
    //}

    /* var buf_12 = Buffer.alloc(16);
        buf_12 = buf2.slice(0, 16);
    var buf_13 = Buffer.alloc(16);
        buf_13 = buf2.slice(16, 32);    
    var buf_14 = Buffer.alloc(16);
        buf_14 = buf2.slice(2032, 2048);   */
    //    console.log('자른값',buf_12);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/octet-stream");
    //res.setHeader("checksum", "0x12345678");
    //res.setHeader("Date", "111111");
    //res.setHeader("X-Powered-By", "Express");
    //res.setHeader("Content-Length", "2048");
    //res.setHeader("Connection", "keep-alive");
    //res.setHeader("checksum", "0x12345678");
    //res.setHeader("checksum", "0x12345678");

    // res.writeHead(200, {'Content-Type':'application/octet-stream', 'checksum':'0x12345678'});
    
    // res.end("$$aircok:s$$"+data+buf_12+"$$aircok:e$$"); 
    //res.end("$$aircok:s$$"+data+buf2+"$$aircok:e$$"); 
    // var result_string = buf_result.toString();
    // console.log(result_string);

    //res.end("$$aircok:s$$"+buf_result.toString("utf-8",0,2047 )+"$$aircok:e$$"); 
    //res.end(buf_start+buf_result); 
    //res.end("$$aircok:s$$"+data.to+"$$aircok:e$$"); 
    //res.end(buf_result); 
    res.end(data); 
    
    //buf2 = null;
    // buf_12 = null;

  });

  // Stream 이벤트 등록

  /* infile.on('end',function(){
    console.log('파일 읽기 종료');
    outfile.end(function(){
        console.log('파일 쓰기 종료');
    })
  }) */
  
  
  // res.end();
  //return; 

  
  //result = "dddddddddddd";  
  
});

module.exports = router;
