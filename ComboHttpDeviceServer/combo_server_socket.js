var net = require('net');

var responseData = null;
//  limit = 5000;  // 5초 이내에 완성된 데이터가 들어오지 않을 경우 400을 응답

var server = net.createServer(function(client) {
  console.log('Client connected');

  var responseCode = '200';

  client.on('data', function(data) {
  console.log('Client sent ' + data.toString());       
  // responseData = data.toString() + '|01|3C00|200';
  responseData = 'OK|'+data.toString();
  client.write(responseData);
  console.log('response data', (new Date()).toString(), responseData);
  responseData = null;
    
  });
  client.on('end', function() {
    console.log('Client disconnected');
  });
});
//server.listen(8107, function() {
server.listen(11115, function() {
  console.log('Server listening for connections');
});
