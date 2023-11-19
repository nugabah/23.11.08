const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.CUSTOMIZE_SECRET_KEY;

exports.signUp = async (req, res) => {
  const { email, password, passwordCheck, name } = req.body;
  const isExistUser = await Users.findOne({ where: { email } });

  if (!Object.keys(req.body).length) {
    return res.status(409).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
  }
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
  try {
    const user = await Users.create({ email, password, name });
    const userWithoutPassword = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return res.status(201).json({ data: userWithoutPassword });
  } catch (err) {
    res.status(400).json({ errorMessage: '에러가 발생했습니다.' });
  }
};

exports.logIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
  } else if (user.password !== password) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  try {
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
  } catch (err) {
    res.status(400).json({ errorMessage: '에러가 발생했습니다.' });
  }
};
