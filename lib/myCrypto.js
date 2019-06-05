var crypto = require("crypto");

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

var encrypt = (pwd) => {
  var hash = crypto.createHash('sha256').update(pwd).digest('base64');
  return hash;
}


module.exports = {
    get: function() {
        return null;
    }
}
