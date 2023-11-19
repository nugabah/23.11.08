const express = require('express');
const { signUp, logIn } = require('../controllers/users.controller.js');
const usersRouter = express.Router();

// 회원가입
usersRouter.post('/users/signup', signUp);

// 로그인
usersRouter.post('/users/login', logIn);

module.exports = usersRouter;
