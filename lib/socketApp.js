'use strict';

const net = require('net');
const PORT = 5123;
var mycrypto = require('../lib/cryptoAlgorithms')

var _getConnection = (ip) => {
  var client = net.connect({port:PORT, host:ip}, function(){
    console.log("connect: ", ip);
    this.setTimeout(500);
    this.on('end', function(){
      console.log(ip + "end");
    })

    this.on('error', function(ex) {
      console.log("handled error");
      console.log(ex);
      client.destroy();
    });

    this.on('timeout', function(){
      console.log('time out');
      this.destroy();
    })
    this.on('close', function(){
      console.log('close');
      this.destroy();
    })
  })
  return client;
}

var _writeData = (socket, data) => {
  var encrypted = mycrypto.encrypt('aes-256-ecb', JSON.stringify(data))
  var success = !socket.write(encrypted);

}


module.exports = {
  getConnection:function(ip){
    return _getConnection(ip);
  },
  writeData:function(socket, data){
    return _writeData(socket, data);
  }
}
