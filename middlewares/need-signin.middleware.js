const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.CUSTOMIZE_SECRET_KEY;

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      return res.status(401).json({ message: '토큰 타입이 일치하지 않습니다.' });
    }

    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;

    const user = await Users.findOne({ where: { userId } });
    if (!user) {
      res.clearCookie('authorization');
      return res.status(401).json({ message: '토큰 사용자가 존재하지 않습니다.' });
    }
    res.locals.user = user;

    next();
  } catch (error) {
    res.clearCookie('authorization');
    return res.status(401).json({
      message: '비정상적인 요청입니다.',
    });
  }
};
