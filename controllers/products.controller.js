const { Products, Users } = require('../models');
const url = require('url');
// 상품 등록
exports.createProduct = async (req, res) => {
  const { userId } = res.locals.user;
  const { title, content } = req.body;
  const joinUser = await Users.findOne({ where: { userId } });

  if (!Object.keys(req.body).length) {
    return res.status(409).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
  }
  try {
    const product = await Products.create({
      userId: userId,
      name: joinUser.name,
      title,
      content,
    });
    return res.status(201).json({ Message: '게시글이 등록되었습니다.' });
  } catch (err) {
    res.status(400).json({ errorMessage: '에러가 발생했습니다.' });
  }
};

// 상품 조회
exports.readAllProducts = async (req, res) => {
  let getUrl = req.url;
  let queryData = url.parse(getUrl, true).query;
  let sortingWord = 'DESC';
  if (queryData.sort) {
    const sortValue = queryData.sort.toLowerCase();
    if (sortValue === 'asc') {
      sortingWord = 'ASC';
    } else if (sortValue === 'desc') {
      sortingWord = 'DESC';
    }
  }
  try {
    const products = await Products.findAll({
      attributes: ['productId', 'title', 'name', 'content', 'status', 'createdAt', 'updatedAt'],
      order: [['createdAt', sortingWord]],
    });
    return res.status(200).json({ data: products });
  } catch (err) {
    res.status(400).json({ errorMessage: '에러가 발생했습니다.' });
  }
};

//상품 상세 조회
exports.readDetailProduct = async (req, res) => {
  const { productId } = req.params;

  const product = await Products.findOne({
    attributes: ['productId', 'title', 'name', 'content', 'status', 'createdAt', 'updatedAt'],
    where: { productId },
  });
  if (!product) {
    return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
  }
  return res.status(200).json({ data: product });
};

// 상품 수정
exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { userId } = res.locals.user;
  const { title, content, status } = req.body;

  const product = await Products.findOne({ where: { productId } });
  if (!Object.keys(req.body).length) {
    return res.status(409).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
  }
  if (!product) {
    return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
  } else if (product.userId !== userId) {
    return res.status(401).json({ message: '권한이 없습니다.' });
  }
  if (status !== 'FOR_SALE' && status !== 'SOLD_OUT') {
    return res.status(409).json({ message: '판매 중이거나 판매 완료여야 합니다.' });
  }
  try {
    await Products.update(
      { title, content, status },
      {
        where: { productId },
      },
    );

    return res.status(201).json({ data: '게시글이 수정되었습니다.' });
  } catch (err) {
    res.status(400).json({ errorMessage: '에러가 발생했습니다.' });
  }
};

// 상품 삭제
exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const { userId } = res.locals.user;

  const product = await Products.findOne({ where: { productId } });

  if (!product) {
    return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
  } else if (product.userId !== userId) {
    return res.status(401).json({ message: '권한이 없습니다.' });
  }
  try {
    await Products.destroy({
      where: { productId },
    });

    return res.status(200).json({ data: '게시글이 삭제되었습니다.' });
  } catch (err) {
    res.status(400).json({ errorMessage: '에러가 발생했습니다.' });
  }
};
