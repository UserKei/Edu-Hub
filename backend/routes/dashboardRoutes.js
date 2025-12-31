const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// 获取继续学习列表
router.get('/continue-learning', authMiddleware, dashboardController.getContinueLearning);

module.exports = router;
