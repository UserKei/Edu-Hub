const User = require('../models/User');
const InviteCode = require('../models/InviteCode');

exports.register = async (req, res) => {
  try {
    const { username, password, nickname, role, inviteCode } = req.body;

    // 1. 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: '用户名已被占用' });
    }

    // 2. 如果是教师角色，验证邀请码
    if (role === 'TEACHER') {
      if (!inviteCode) {
        return res.status(400).json({ message: '教师注册需要邀请码' });
      }

      const codeRecord = await InviteCode.findOne({ where: { code: inviteCode } });

      if (!codeRecord) {
        return res.status(400).json({ message: '邀请码无效' });
      }

      if (codeRecord.is_used) {
        return res.status(400).json({ message: '邀请码已被使用' });
      }

      // 标记邀请码为已使用
      codeRecord.is_used = true;
      await codeRecord.save();
    }

    // 3. 创建新用户 (不加密密码)
    const newUser = await User.create({
      username,
      password, // 明文存储
      nickname,
      role: role || 'STUDENT'
    });

    res.status(201).json({
      message: '注册成功',
      user: {
        id: newUser.id,
        username: newUser.username,
        nickname: newUser.nickname,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};
