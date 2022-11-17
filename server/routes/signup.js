const express = require('express');
const signup = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const secret = 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c';

signup.post('/', (req, res) => {
  const username = req.body.username;
  const nickname = req.body.nickname;
  const password = req.body.password;


  if (username === "" || password === "" || nickname === "") {
    return res.status(400).json('invalid field');
  }

  if(password.length < 6) {
    return res.status(400).send('User validation failed: Password should be at least 6 characters.')
  }


  bcrypt.hash(password, 10, (err, hash) => {
    if(err) {
      return res.status(400).send('invalid password');
    }

    const newUser = new User({
      username: username,
      password: hash,
      nickname: nickname
    });

    newUser.save()
      .then(() => {

        const _2hrs = Math.floor(Date.now() / 1000) + (2 * 60 * 60);
        let payload = {"usr": username, "exp": _2hrs};
        let token = jwt.sign(payload, secret, {algorithm: 'HS256'});


        res.cookie('jwt', token);
        const data = {
          token: token,
          user: {
            username: username,
            nickname: nickname
          }
        };
        res.status(200).json(data);
      })
      .catch(err => res.status(400).send(err.message));
  });
});

module.exports = signup;
