const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

// 获取继续学习列表
router.get('/continue-learning', verifyToken, dashboardController.getContinueLearning);

module.exports = router;
