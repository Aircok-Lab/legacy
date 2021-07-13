// 출처 - https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10

var net = require('net');

// creates the server
var server = net.createServer();

var responseData = null;

//emitted when server closes ...not emitted until all connections closes.
server.on('close',function(){
    console.log('Server closed !');
});

// emitted when new client connects
server.on('connection',function(socket){

    //var no_of_connections =  server.getConnections(); // sychronous version
    server.getConnections(function(error,count){
        console.log('Number of concurrent connections to the server : ' + count);
    });

    socket.setEncoding('utf8');

    socket.on('data',function(data){
        console.log('Client sent : ' + data.toString());       
        // responseData = data.toString() + '|01|3C00|200';
        responseData = 'OK|'+data.toString();
        socket.write(responseData);
        //socket.write('responseData');
        console.log('response data : ', (new Date()).toString(), responseData);
        responseData = null;
    });

    socket.on('error',function(error){
        console.log('Error : ' + error);
    });

    socket.on('end',function(data){
        console.log('Socket ended from other end!');
        console.log('End data : ' + data);
    });

    socket.on('close',function(error){
        if(error){
            console.log('Socket was closed coz of transmission error');
        }
    });

});

// emits when any error occurs -> calls closed event immediately after this.
server.on('error',function(error){
    console.log('Error: ' + error);
});

//emits when server is bound with server.listen
server.on('listening',function(){
    console.log('Server is listening!');
});

server.maxConnections = 10000;

//static port allocation
// server.listen(8110);
server.listen(11115, function() {
    console.log('Server listening for connections');
});
