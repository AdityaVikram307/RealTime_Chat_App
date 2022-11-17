const express = require('express');
const login = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c';

const User = require('../models/user.model');

login.post('/', function(req, res) {
  const password = req.body.password;
  const username = req.body.username;


  if (username == "" || password == "" || !username || !password) {
    return res.status(401).send("invalid input");
  }

  const filter = {"username": username};
  User.findOne(filter, (err, user) => {
    if(err){
      return res.status(500).send('Internal Server Error - Failed to Retrieve user info');
    }


    if(!user) {
      return res.status(401).json();
    }


    bcrypt.compare(password, user.password, (err, result) => {

      if(!result) {
        return res.status(401).json();
      }


      else {

        const _2hrs = Math.floor(Date.now() / 1000) + (2 * 60 * 60);
        let payload = {"usr": username, "exp": _2hrs};
        let token = jwt.sign(payload, secret, {algorithm: 'HS256'});

        res.cookie('jwt', token);
        const data = {
          token: token,
          user: {
            username: username,
            nickname: user.nickname
          }
        };
        res.status(200).json(data);
      }
    });
  });
});

module.exports = login;
