const express = require('express');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users.router.js');
const productsRouter = require('./routes/products.router.js');

const app = express();
const port = 3000;

app.use(express.json());

app.use(cookieParser());

app.use('/api', [productsRouter, usersRouter]);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
