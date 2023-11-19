const express = require('express');
const {
  createProduct,
  readAllProducts,
  readDetailProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products.controller.js');
const authMiddleware = require('../middlewares/need-signin.middleware.js');
const routerProducts = express.Router();

//상품 등록
routerProducts.post('/products', authMiddleware, createProduct);

//상품 목록 조회
routerProducts.get('/products', readAllProducts);

//상품 개별 조회
routerProducts.get('/products/:productId', readDetailProduct);

//상품 정보 수정
routerProducts.put('/products/:productId', authMiddleware, updateProduct);

//상품 삭제
routerProducts.delete('/products/:productId', authMiddleware, deleteProduct);

module.exports = routerProducts;
