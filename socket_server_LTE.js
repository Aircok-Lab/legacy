var net = require("net");
var readline = require("readline");
var fs = require("fs");
var request = require("request");

// 펌웨어 파일 내용을 담을 배열
var HEXfileData = [];

// 펌웨어 파일 경로
var firmwareFilePath = "http://115.178.65.141:13701/uploads/";

// 펌웨어 파일 이름
var firmwareFileName = "AIRCOK_LTE.hex";

// 펌웨어 파일을 라인별로 읽기 처리
var rl = readline.createInterface({
  input: request(firmwareFilePath + firmwareFileName), // 펌웨어 파일
  crlfDelay: Infinity
});

// 펌웨어 파일을 라인별로 배열에 넣음
rl.on("line", function(line) {
  console.log(line);
  HEXfileData.push(line);
});

// 서버 생성
var server = net.createServer(function(client) {
  console.log("Client", client);
  console.log("Client connected", new Date().toString());
  console.log("Firmware FileName : " + firmwareFileName);

  // 클라이언트로부터 데이터 수신
  client.on("data", function(data) {
    console.log("Client sent " + data.toString(), new Date().toString());

    // 클라이언트에서 4자리 숫자를 보내면 해당 숫자의 번호에 해당하는 HEX File 전송
    if (data.toString().length === 4) {
      var index = parseInt(data.toString(), 10);
      if (HEXfileData[index]) {
        client.write(HEXfileData[index]);
        console.log(
          "Client write " + HEXfileData[index].toString(),
          new Date().toString()
        );
      }
    }
  });

  // 클라이언트 접속 종료
  client.on("end", function() {
    console.log("Client disconnected", new Date().toString());
  });

  // 클라이언트와 연결시에 클라이언트에 응답
  //client.write('Hello');
});

// 서버 수신 대기 시작
server.listen(5050, function() {
  console.log("Server listening for connections");
});
