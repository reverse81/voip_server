var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken')
const passport = require("passport");
const jwtStrategry  = require("./strategies/jwt")
passport.use(jwtStrategry);

router.get('/', function(req, res, next) {
  res.render('adminContent', { title: 'VoIP' });
});

router.post("/login", (req, res) => {
  let { email, pass } = req.body;
  console.log("email:" + email + ", pass: " + pass)

  //This lookup would normally be done using a database
  if (email === "hayangblue@gmail.com") {
      if (pass === "pass") { //the password compare would normally be done using bcrypt.
          const opts = {}  
          opts.expiresIn = 600;  //token expires in 10min
          const secret = "SECRET_KEY" //normally stored in process.env.secret
          const token = jwt.sign({ email }, secret, opts);
          return res.status(200).json({
              message: "Auth Passed",
              token
          })
      }
  }
  return res.status(401).json({ message: "Auth Failed" })
});

router.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('/admin/users...');
  res.render('users', { title: 'VoIP' });
})

module.exports = router;
