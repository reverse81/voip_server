var crypto = require("crypto");
require('dotenv').config();
var jwt = require('jsonwebtoken');

var privatekey = process.env.SECRET_KEY;
//r7eJMF+TM7CUgQbD74RMtufwmSn5GaXVQtcPof9DJOB/dlVkyTbCzwWc7t4PHGJI

var _decrypt = (secretKey, cryptoStr) => {
  try{
    var cipherBuffer =  new Buffer(cryptoStr, 'base64');

    var decipher = crypto.createDecipheriv("aes-256-ecb", secretKey , '');

    output = decipher.update(cipherBuffer, 'binary', 'utf8');
    output += decipher.final('utf8');
    return output
  }catch(e){
    console.log(e);
    return e;
  }
}

function encrypt_aes_256(text){
  const plaintext = Buffer.from(text, 'utf8');
  const cipher = crypto.createCipheriv('aes-256-ecb', privatekey , Buffer.from([]));
  const ciphertext = Buffer.concat([ cipher.update(plaintext), cipher.final() ]);
  console.log(ciphertext.toString('base64'));
  return ciphertext.toString('base64')
}

var encrypt_sha = (key) => {
  try {
    var hash = crypto.createHash('sha256').update(key).digest('base64');
    return hash;
  } catch (exception) {
      throw new Error(exception.message);
  }
}

module.exports = {
    get: function() {
        return null;
    },
    encrypt: function(algo, data){
      if(algo == "SHA256"){
        return encrypt_sha(data);
      }
      else if (algo == 'aes-256-ecb') {
        return encrypt_aes_256(data)

      }
    },
    decrypt: function(secretKey, cryptoStr){
      return _decrypt(secretKey, cryptoStr);
    }
}
