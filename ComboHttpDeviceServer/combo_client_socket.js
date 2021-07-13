var net = require('net');
var client = net.connect({
	port: 11115,
	host: 'smart.aircok.com'
	// host: 'localhost'
}, function() {
	console.log('Client connected');

	client.write('202006190936|200600123456789012345|0001|0005|0005|00000|00365|1258|543|0000|00060|v5.1.2|!=');
	//setInterval(function() {
	//	client.write('Test Data ' + (+new Date()) + '\r\n');
	//}, 5000);
});

client.on('data', function(data) {
	console.log('클라이언트데이터수신['+ data.toString()+']');
	client.end();
});

client.on('end', function() {
	console.log('Client disconnected');
});

