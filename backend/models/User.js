const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '登录账号 (唯一ID)'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING,
    comment: '用户昵称 (显示名)'
  },
  avatar: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.ENUM('STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'),
    defaultValue: 'STUDENT',
    comment: '角色'
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'BANNED'),
    defaultValue: 'ACTIVE',
    comment: '账号状态'
  }
}, {
  tableName: 'User',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
