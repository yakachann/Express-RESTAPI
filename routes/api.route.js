const router = require('express').Router();
//prismaというORMツールを使用するためにPrismaClientが必要なのでPrismaClientを@prisma/clientからインポートしている
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * 全ての製品を取得するためのルート
 */
router.get('/products', async (req, res, next) => {
  try {
    //await:非同期で処理されるプロミスを待機（今回はfindManyでproductの全てのレコードを取得するまで次に進まない仕様）
    const products = await prisma.product.findMany({
      //リクエストを行うたびにカテゴリーも含める
      include: { category: true },
    });
    //全てのカテゴリーの取得
    const categories = await prisma.category.findMany({
      include: { products: true },
    });
    res.json({ products, categories });
  } catch (error) {
    next(error);
  }
});

/**
 * IDによる製品を取得するためのルート
 */
router.get('/products/:id', async (req, res, next) => {
  try {
    //リクエストパラメーターからIDの取得
    const { id } = req.params;
    //リクエストパラメーター内のIDは文字列のため、prismaに渡す際に数値に変換
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id)
      },
      include: { category: true },
    })
    //console.log(product.quantity)
    res.json(product);
  } catch (error) {
    next(error);
  }
});

/**
 * 新しい製品を作成するためのルート
 */
router.post('/products', async (req, res, next) => {
  try {
    //作成するときはcreate使用、今回はreq.bodyに記載済みなので下記のような指定でOK
    const product = await prisma.product.create({
      data: req.body,
    })
    res.json(product)
  } catch (error) {
    next(error);
  }


});

/**
 * 製品を削除するためのルート
 */
router.delete('/products/:id', async (req, res, next) => {
  try {
    //リクエストパラメーターからIDの取得
    const { id } = req.params;
    const deletedProduct = await prisma.product.delete({
      where: {
        id: Number(id),
      }
    })
    res.json(deletedProduct);
  } catch (error) {
    next(error);
  }
});

/**
 * 製品を更新するためのルート
 */
router.patch('/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: req.body,
      include: {
        category: true
      }
    })
    res.json(product)

  } catch (error) {
    next(error);
  }
});

module.exports = router;
