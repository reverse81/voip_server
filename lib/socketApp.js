

var net = require('net');
var mycrypto = require('../lib/cryptoAlgorithms')

var client = new net.Socket();

module.exports = {
	socket_client:function (ip, schedule){
		client.connect(5123, ip, function() {
			console.log(`Connected: ${ip}:5123`);
			console.log(schedule);
			var encrypted = mycrypto.encrypt('aes-256-ecb', JSON.stringify(schedule))
			client.write(encrypted);
			client.destroy();
		});

		client.on('close', function() {
			console.log('Connection closed');
		});

		client.on('error', function(ex) {
		  console.log("handled error");
		  console.log(ex);
			client.destroy();
		});
	}

}
