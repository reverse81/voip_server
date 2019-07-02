'use strict';

const net = require('net');
const PORT = 5123;
var mycrypto = require('../lib/cryptoAlgorithms')

var _getConnection = (ip) => {
  try{
    var client = net.connect({port:PORT, host:ip}, function(err){
      console.log("connect: ", ip);
      this.on('error', function(ex) {
        console.log("handled error");
        console.log(ex);
        throw ex;
        // client.destroy();
      });

      this.setTimeout(5);
      this.on('end', function(){
        console.log(ip + "end");
      })

      this.on('timeout', function(){
        console.log('time out');
        this.destroy();
      })
      this.on('close', function(){
        console.log('close');
        this.destroy();
      })
    })
    client.on('error', function(ex) {
      console.log("handled error");
      console.log(ex);
      client.destroy();
    });
    client.setTimeout(5);
    client.on('end', function(){
      console.log(ip + "end");
      client.destroy();
    })

    client.on('timeout', function(){
      console.log('time out');
      this.destroy();
    })
    client.on('close', function(){
      console.log('close');
      this.close();
    })
    return client;
  }
  catch(e){
    console.log(e);
    // return e;
    throw e
  }
}

var _writeData = (socket, data) => {
  try{
    var encrypted = mycrypto.encrypt('aes-256-ecb', JSON.stringify(data))
    var success = !socket.write(encrypted);
  }
  catch(e){
    console.log(e);
    throw new Error('Error')
  }
}


module.exports = {
  getConnection:function(ip){
    return _getConnection(ip);
  },
  writeData:function(socket, data){
    return _writeData(socket, data);
  }
}
