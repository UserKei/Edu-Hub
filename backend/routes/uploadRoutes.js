const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// 统一上传接口
// 前端可以通过 type 参数或者直接上传，后端根据 mimetype 自动分文件夹
router.post('/', uploadController.uploadMiddleware, uploadController.handleUpload);

module.exports = router;
