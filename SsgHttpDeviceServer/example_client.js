//출처 - https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10

var net = require('net');

// creating a custom socket client and connecting it....
var client  = new net.Socket();
client.connect({    
    port: 11115,
	host: 'smart.aircok.com'
	//host: 'localhost'
});

client.on('connect',function(){
    console.log('Client: connection established with server');

    // writing data to server
    client.write('202006190936|200600123456789012345|0001|0005|0005|00000|00365|1258|543|0000|00060|v5.1.2|!=');
});

client.setEncoding('utf8');

client.on('data',function(data){
    console.log('reponseData from server:' + data);
    client.end();
});

client.on('end', function(){    
    console.log('disconnected from server');
});