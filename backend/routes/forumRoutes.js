const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { verifyToken } = require('../middleware/authMiddleware');

// 公开接口 (或者也可以要求登录，根据需求。这里假设查看是公开的，或者前端会传token)
// 为了简单起见，查看帖子列表和详情可以不强制登录，但如果有token可以解析出当前用户状态(虽然这里主要是读操作)
// 这里的实现暂时不强制 verifyToken 对于 GET 请求，除非业务要求必须登录才能看。
// 但考虑到 plan 中写了 "公开/登录"，我们先不加 verifyToken，或者加上 verifyToken 但允许未登录(需要修改 middleware 支持 optional auth)。
// 为了简化，我们假设查看帖子是公开的。

router.get('/posts', forumController.getPosts);
router.get('/posts/:id', forumController.getPostById);

// 需要登录的接口
router.post('/posts', verifyToken, forumController.createPost);
router.delete('/posts/:id', verifyToken, forumController.deletePost);

router.post('/posts/:id/comments', verifyToken, forumController.createComment);
router.delete('/comments/:id', verifyToken, forumController.deleteComment);

module.exports = router;
