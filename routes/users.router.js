const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/need-signin.middleware.js');
const { Users } = require('../models');
const usersRouter = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.CUSTOMIZE_SECRET_KEY;

// 회원가입
usersRouter.post('/users/signup', async (req, res) => {
  const { email, password, passwordCheck, name } = req.body;
  const isExistUser = await Users.findOne({ where: { email } });

  if (email.split('@').length !== 2) {
    return res.status(409).json({ message: '이메일 형식이 아닙니다.' });
  }
  if (isExistUser) {
    return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
  }
  if (password.length < 6) {
    return res.status(409).json({ message: '비밀번호는 6자 이상입니다.' });
  }
  if (password !== passwordCheck) {
    return res.status(409).json({ message: '확인 비밀번호와 다릅니다.' });
  }
  // Users 테이블에 사용자를 추가합니다.
  const user = await Users.create({ email, password, name });
  const userWithoutPassword = {
    userId: user.userId,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  return res.status(201).json({ data: userWithoutPassword });
});

// 로그인
usersRouter.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
  } else if (user.password !== password) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  const token = jwt.sign(
    {
      userId: user.userId,
    },
    secretKey,
    { expiresIn: '12h' },
  );
  let expires = new Date();
  expires.setMinutes(expires.getMinutes() + 720);
  res.cookie('authorization', `Bearer ${token}`, {
    expires: expires,
  });
  return res.status(200).json({ message: '로그인 성공' });
});

// // 사용자 조회
// usersRouter.get('/users/signup', async (req, res) => {
//   const { userId } = req.params;

//   const user = await Users.findOne({
//     attributes: ['userId', 'name', 'email', 'createdAt', 'updatedAt'],
//     // include: [
//     //   {
//     //     model: UserInfos, // 1:1 관계를 맺고있는 UserInfos 테이블을 조회합니다.
//     //     attributes: ['name', 'age', 'gender', 'profileImage'],
//     //   },
//     // ],
//     where: { userId },
//   });

//   return res.status(200).json({ data: user });
// });

module.exports = usersRouter;
