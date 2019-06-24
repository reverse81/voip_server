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

var encrypt_aes = (data, secretKey) => {
    try {
        var cipher = crypto.createCipher('aes-256-cbc', secretKey);
        var encrypted = Buffer.concat([cipher.update(new Buffer(JSON.stringify(data), "utf8")), cipher.final()]);

        return encrypted;
    } catch (exception) {
        throw new Error(exception.message);
    }
}

function encrypt_aes_256(text){
  var cipher = crypto.createCipher("aes-256-ecb",privatekey)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher("aes-256-ecb",privatekey)
  var dec = decipher.update(text,'base64','utf8')
  dec += decipher.final('utf8');
  return dec;
}

var encrypt_sha = (key) => {
  try {
    var hash = crypto.createHash('sha256').update(key).digest('base64');
    return hash;
  } catch (exception) {
      throw new Error(exception.message);
  }
}

var encryptToken = (data, key)=>{
  try{
    var token = jwt.sign(data, key);
    return token;
  } catch (exception){
    throw new Error(exception.message);
  }

}

var decryptToken = (data, key) => {
  try{
    var decoded = jwt.verify(data, key);
    return decoded;
  } catch (exception){
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
