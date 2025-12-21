const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// 所有路由都需要管理员权限
router.use(verifyToken, requireAdmin);

// 用户管理
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.post('/users/:id/reset-password', adminController.resetUserPassword);

// 邀请码管理
router.post('/invite-codes', adminController.generateInviteCode);
router.get('/invite-codes', adminController.getInviteCodes);

module.exports = router;
