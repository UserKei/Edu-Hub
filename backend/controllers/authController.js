const User = require('../models/User');
const InviteCode = require('../models/InviteCode');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password, nickname, role, inviteCode } = req.body;

    // 0. 输入验证
    // 用户名: 3-20位，仅允许字母、数字、下划线
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!username || !usernameRegex.test(username) || username.length < 3 || username.length > 20) {
      return res.status(400).json({ message: '用户名只能包含字母、数字和下划线，长度 3-20 位' });
    }

    // 密码: 6-32位，仅允许字母、数字和特殊字符
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
    if (!password || password.length < 6 || password.length > 32) {
      return res.status(400).json({ message: '密码长度需在 6-32 个字符之间' });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: '密码只能包含字母、数字和特殊字符' });
    }

    // 昵称: 2-20位，支持中文、字母、数字、下划线
    const nicknameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/;
    if (nickname) {
      if (nickname.length < 2 || nickname.length > 20) {
        return res.status(400).json({ message: '昵称长度需在 2-20 个字符之间' });
      }
      if (!nicknameRegex.test(nickname)) {
        return res.status(400).json({ message: '昵称只能包含中文、字母、数字和下划线' });
      }
    }

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

      if (codeRecord.expires_at && new Date() > new Date(codeRecord.expires_at)) {
        return res.status(400).json({ message: '邀请码已过期' });
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

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. 输入验证
    // 用户名: 3-20位，仅允许字母、数字、下划线
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!username || !usernameRegex.test(username) || username.length < 3 || username.length > 20) {
      return res.status(400).json({ message: '用户名只能包含字母、数字和下划线，长度 3-20 位' });
    }

    // 密码: 6-32位
    if (!password || password.length < 6 || password.length > 32) {
      return res.status(400).json({ message: '密码长度需在 6-32 个字符之间' });
    }

    // 2. 查询用户
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 检查用户状态
    if (user.status === 'BANNED') {
      return res.status(403).json({ message: '账号已被封禁，请联系管理员' });
    }

    // 3. 验证密码 (明文比较)
    if (user.password !== password) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 4. 生成 JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 5. 返回结果
    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        role: user.role,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};
