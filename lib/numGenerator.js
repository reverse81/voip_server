
module.exports = {
    password_generator: function(len) {
      var length = (len)?(len):(12);
      var string = "abcdefghijklmnopqrstuvwxyz"; //to upper
      var numeric = '0123456789';
      var punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
      var password = "";
      var character = "";
      var crunch = true;
      while( password.length<length ) {
          entity1 = Math.ceil(string.length * Math.random()*Math.random());
          entity2 = Math.ceil(numeric.length * Math.random()*Math.random());
          entity3 = Math.ceil(punctuation.length * Math.random()*Math.random());
          hold = string.charAt( entity1 );
          hold = (password.length%2==0)?(hold.toUpperCase()):(hold);
          character += hold;
          character += numeric.charAt( entity2 );
          character += punctuation.charAt( entity3 );
          password = character;
      }
      password=password.split('').sort(function(){return 0.5-Math.random()}).join('');
      return password.substr(0,len);
    },
    leftPadWithZeros: function(number, length)  {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    },
    makeNumber: function(len){
      var num = Math.random().toString().slice(2,len+2);
      return this.leftPadWithZeros(num, len)
    }
}
