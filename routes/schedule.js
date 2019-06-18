var express = require('express');
var router = express.Router();
const session = require('express-session');
var database = require('../data/dataCrypto')
require('dotenv').config();
var jwt = require('jsonwebtoken');
var privatekey = process.env.SECRET_KEY;
var mycrypto = require("../lib/cryptoAlgorithms");

module.exports = function (passport) {
  router.post('/create', function (request, res, next) {

  });

  router.get('/phone_number', function (request, res, next) {

  });

  router.get('/members', function (request, res, next) {

  });

  return router;
}
