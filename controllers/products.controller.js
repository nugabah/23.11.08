const { Products } = require('../models');

// 상품 등록
exports.createProduct = async (req, res) => {
  const { userId } = res.locals.user;
  const { title, content } = req.body;

  const product = await Products.create({
    UserId: userId,
    title,
    content,
  });

  return res.status(201).json({ data: product });
};
// async (req, res) => {
//   const { title, content, author, password } = req.body;
//   if (!Object.keys(req.body).length) return res.status(400).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
//   try {
//     const status = 'FOR_SALE';
//     const createdAt = new Date();
//     await Products.create({ title, content, author, password, status, createdAt });
//     res.json({ message: '판매 상품을 등록하였습니다.' });
//   } catch (err) {
//     res.status(400).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
//   }
// };

// 상품 조회
exports.readAllProducts = async (req, res) => {
  const products = await Products.findAll({
    attributes: ['productId', 'name', 'title', 'content', 'status', 'createdAt', 'updatedAt'],
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json({ data: products });
};
// async (req, res) => {
//   const result = await Products.find({}).sort({ createdAt: -1 });
//   res.status(200).json({ data: result });
// };

//상품 상세 조회
exports.readDetailProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await Products.findOne({
    attributes: ['productId', 'name', 'title', 'content', 'status', 'createdAt', 'updatedAt'],
    where: { productId },
  });

  return res.status(200).json({ data: product });
};
// async (req, res) => {
//   const { productId } = req.params;
//   if (!productId) res.status(400).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
//   try {
//     const result = await Products.find({ _id: productId });
//     res.status(200).json({ data: result });
//   } catch (err) {
//     res.status(404).json({ errorMessage: '상품 조회에 실패하였습니다.' });
//   }
// };

// 상품 수정
exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { userId } = res.locals.user;
  const { title, content, status } = req.body;

  // 게시글을 조회합니다.
  const product = await Products.findOne({ where: { productId } });

  if (!product) {
    return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
  } else if (product.UserId !== userId) {
    return res.status(401).json({ message: '권한이 없습니다.' });
  }

  // 게시글의 권한을 확인하고, 게시글을 수정합니다.
  await Products.update(
    { title, content, status }, // title과 content 그리고 status 컬럼을 수정합니다.
    {
      where: {
        [Op.and]: [{ productId }, { UserId: userId }],
      },
    },
  );

  return res.status(200).json({ data: '게시글이 수정되었습니다.' });
};
// async (req, res) => {
//   const { productId } = req.params;
//   const { title, content, password, status } = req.body;
//   const correctPw = await Products.find({ _id: productId }).select('+password');
//   if (!Object.keys(req.body).length) return res.status(400).json({ Message: '데이터 형식이 올바르지 않습니다.' });
//   if (password !== correctPw[0].password) return res.status(401).json({ Message: '상품을 수정할 권한이 없습니다.' });
//   try {
//     const createdAt = new Date();
//     await Products.updateOne({ _id: productId }, { title, content, status, createdAt });
//     res.json({ message: '상품 정보를 수정하였습니다.' });
//   } catch (err) {
//     res.status(404).json({ Message: '상품 조회에 실패하였습니다.' });
//   }
// };

// 상품 삭제
exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const { userId } = res.locals.user;

  // 게시글을 조회합니다.
  const product = await Products.findOne({ where: { productId } });

  if (!product) {
    return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
  } else if (product.UserId !== userId) {
    return res.status(401).json({ message: '권한이 없습니다.' });
  }

  // 게시글의 권한을 확인하고, 게시글을 삭제합니다.
  await Products.destroy({
    where: {
      [Op.and]: [{ productId }, { UserId: userId }],
    },
  });

  return res.status(200).json({ data: '게시글이 삭제되었습니다.' });
};
// async (req, res) => {
//   const { productId } = req.params;
//   const { password } = req.body;
//   const correctPw = await Products.find({ _id: productId }).select('+password');
//   if (!Object.keys(req.body).length) return res.status(400).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
//   if (password !== correctPw[0].password) return res.status(401).json({ Message: '상품을 삭제할 권한이 없습니다.' });
//   try {
//     await Products.deleteOne({ _id: productId });
//     res.json({ message: '상품 정보를 삭제하였습니다.' });
//   } catch (err) {
//     res.status(404).json({ errorMessage: '상품 삭제에 실패하였습니다.' });
//   }
// };
