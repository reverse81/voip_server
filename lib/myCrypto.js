var crypto = require("crypto");

var jwt = require('jsonwebtoken');

var privatekey = ""

var decrypt = (secretKey, cryptoStr) => {
  try {
    var buf = new Buffer(cryptoStr, 'base64');

    var iv = buf.slice(0, 16);
    var crypt = buf.toString('base64', 16);

    var decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, iv);

    decipher.setAutoPadding(true);
    var dec = decipher.update(crypt, 'base64', 'utf-8');
    dec += decipher.final('utf-8');

    return dec
  } catch (e) {
    return null
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

var encrypt_sha = (pwd) => {
  try {
    var hash = crypto.createHash('sha256').update(pwd).digest('base64');
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
  trh{
    var decoded = jwt.verify(data, key);
    return decoded;
  } catch (exception){
    throw new Error(exception.message);
  }

}


module.exports = {
    get: function() {
        return null;
    }
}
