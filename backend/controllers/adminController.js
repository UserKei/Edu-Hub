const User = require('../models/User');
const InviteCode = require('../models/InviteCode');
const { Op } = require('sequelize');

// 获取用户列表
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    // 搜索逻辑: 匹配用户名或昵称
    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { nickname: { [Op.like]: `%${search}%` } }
      ];
    }

    // 角色筛选
    if (role) {
      where.role = role;
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: { exclude: ['password'] }, // 不返回密码
      order: [['created_at', 'DESC']]
    });

    res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      users: rows
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 修改用户状态 (封禁/解封)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'ACTIVE' or 'BANNED'

    if (!['ACTIVE', 'BANNED'].includes(status)) {
      return res.status(400).json({ message: '无效的状态值' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 保护超级管理员
    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ message: '无法修改超级管理员的状态' });
    }

    // 防止普通管理员封禁其他管理员 (可选策略)
    if (user.role === 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: '权限不足：无法操作管理员账号' });
    }

    user.status = status;
    await user.save();

    res.json({ message: '用户状态更新成功', user });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 重置用户密码
exports.resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ message: '无法重置超级管理员密码' });
    }

    // 生成临时密码 (这里简单设置为 '123456'，实际应生成随机串)
    const tempPassword = '123456'; 
    user.password = tempPassword; // 注意：实际项目中应加密存储
    await user.save();

    res.json({ message: '密码重置成功', tempPassword });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 生成邀请码
exports.generateInviteCode = async (req, res) => {
  try {
    const { expires_at } = req.body;
    
    // 生成随机 6 位大写字母+数字
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newCode = await InviteCode.create({
      code,
      created_by: req.user.id,
      expires_at: expires_at || null
    });

    res.status(201).json({ message: '邀请码生成成功', code: newCode });
  } catch (error) {
    console.error('Generate invite code error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取邀请码列表
exports.getInviteCodes = async (req, res) => {
  try {
    const codes = await InviteCode.findAll({
      order: [['created_at', 'DESC']],
      limit: 50 // 简单限制返回数量
    });
    res.json(codes);
  } catch (error) {
    console.error('Get invite codes error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};
